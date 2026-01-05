use crate::formulas::*;
use crate::types::*;
use charms_sdk::data::check;
use sha2::{Digest, Sha256};
use secp256k1::{Message, PublicKey, Secp256k1, ecdsa::Signature as SecpSignature};

pub fn compute_badge_id(utxo_data: &[u8]) -> B32 {
    let mut hasher = Sha256::new();
    hasher.update(utxo_data);
    let result = hasher.finalize();
    let hash_bytes: [u8; 32] = result.into();
    B32::from(hash_bytes)
}

pub fn verify_signature(
    message: &[u8],
    signature: &Signature,
    pubkey: &PubKey,
) -> bool {
    if message.len() != 32 {
        return false;
    }

    let msg = match Message::from_digest_slice(message) {
        Ok(m) => m,
        Err(_) => return false,
    };

    let pk = match PublicKey::from_slice(pubkey) {
        Ok(p) => p,
        Err(_) => return false,
    };

    let sig = match SecpSignature::from_compact(signature) {
        Ok(s) => s,
        Err(_) => return false,
    };

    // Create context directly instead of using static LazyLock (which requires std)
    let secp = Secp256k1::verification_only();
    secp.verify_ecdsa(&msg, &sig, &pk).is_ok()
}

pub fn hash_record(record: &TransactionRecord) -> B32 {
    let mut hasher = Sha256::new();

    hasher.update(record.nonce.as_bytes());
    hasher.update(record.party_a.as_bytes());
    hasher.update(record.party_b.as_bytes());
    hasher.update(&record.value.to_le_bytes());

    let tx_type_byte = match record.tx_type {
        TxType::P2PSale => 0u8,
        TxType::LoanOrigination => 1u8,
        TxType::LoanRepayment => 2u8,
        TxType::ServiceProvided => 3u8,
        TxType::Other => 4u8,
    };
    hasher.update(&[tx_type_byte]);

    let result = hasher.finalize();
    let hash_bytes: [u8; 32] = result.into();
    B32::from(hash_bytes)
}

pub fn validate_record(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    outcome: Outcome,
    value: u64,
    current_block: u64,
    witness: &RecordWitness,
) -> bool {
    let record_hash = hash_record(&witness.record);

    check!(verify_signature(
        record_hash.as_bytes(),
        &witness.my_signature,
        &old_badge.pubkey,
    ));

    check!(verify_signature(
        record_hash.as_bytes(),
        &witness.counterparty_signature,
        &witness.counterparty_pubkey,
    ));

    check!(witness.record.has_party(&old_badge.id));

    check!(witness.record.outcome == outcome);
    check!(witness.record.value == value);

    check!(witness.record.nonce != old_badge.last_nonce);

    check!(new_badge.id == old_badge.id);
    check!(new_badge.created_at == old_badge.created_at);
    check!(new_badge.pubkey == old_badge.pubkey);

    check!(new_badge.tx_total == old_badge.tx_total.saturating_add(1));

    match &outcome {
        Outcome::Positive => {
            check!(new_badge.tx_positive == old_badge.tx_positive.saturating_add(1));
            check!(new_badge.tx_negative == old_badge.tx_negative);
        }
        Outcome::Negative { .. } => {
            check!(new_badge.tx_positive == old_badge.tx_positive);
            check!(new_badge.tx_negative == old_badge.tx_negative.saturating_add(1));
        }
    }

    check!(new_badge.volume_total == old_badge.volume_total.saturating_add(value));

    let value_squared = (value as u128).saturating_mul(value as u128);
    check!(new_badge.volume_sum_squares == old_badge.volume_sum_squares.saturating_add(value_squared));

    let (expected_window_count, expected_window_volume, expected_window_start) =
        update_window(old_badge, value, current_block);

    check!(new_badge.window_tx_count == expected_window_count);
    check!(new_badge.window_volume == expected_window_volume);
    check!(new_badge.window_start == expected_window_start);

    let expected_trust = compute_trust(new_badge, current_block);
    let expected_flags = compute_flags(new_badge, value, current_block);
    let expected_risk = compute_risk(&expected_flags);

    check!(new_badge.trust == expected_trust);
    check!(new_badge.flags == expected_flags);
    check!(new_badge.risk == expected_risk);

    check!(new_badge.last_nonce == witness.record.nonce);
    check!(new_badge.last_update == current_block);

    check!(new_badge.vouches_out == old_badge.vouches_out);
    check!(new_badge.vouches_in == old_badge.vouches_in);
    check!(new_badge.cascade_damage == old_badge.cascade_damage);

    true
}
