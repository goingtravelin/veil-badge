//! Shared test fixtures and helpers for Veil Protocol tests
//!
//! This module provides reusable components for testing:
//! - Key pair generation and signing
//! - Badge factory functions
//! - Charms SDK test helpers

#![allow(dead_code)] // Test helpers may not be used in all test files

use veil::*;
use charms_sdk::data::{App, B32 as AppB32, Data, TxId, UtxoId};
use std::collections::BTreeMap;
use secp256k1::{Message, PublicKey, Secp256k1, SecretKey};

// ============================================================================
// KEYPAIR HELPERS
// ============================================================================

/// Create a deterministic keypair from a seed byte
pub fn make_keypair(seed: u8) -> (SecretKey, PubKey) {
    let secp = Secp256k1::new();
    let key_material = [seed; 32];
    let secret_key = SecretKey::from_slice(&key_material)
        .expect("32 bytes, within curve order");
    let public_key = PublicKey::from_secret_key(&secp, &secret_key);

    let pk_bytes = public_key.serialize();
    let mut pubkey = [0u8; 33];
    pubkey.copy_from_slice(&pk_bytes);

    (secret_key, pubkey)
}

/// Sign a 32-byte message with a secret key
pub fn sign_message(message: &[u8; 32], secret_key: &SecretKey) -> Signature {
    let secp = Secp256k1::new();
    let msg = Message::from_digest_slice(message).expect("32 byte message");
    let sig = secp.sign_ecdsa(&msg, secret_key);

    let sig_bytes = sig.serialize_compact();
    let mut signature = [0u8; 64];
    signature.copy_from_slice(&sig_bytes);
    signature
}

/// Create a valid signature for testing using seed 0x11
pub fn make_signature(message: &[u8; 32]) -> (Signature, PubKey) {
    let secp = Secp256k1::new();
    let secret_key = SecretKey::from_slice(&[0x11u8; 32])
        .expect("32 bytes, within curve order");
    let public_key = PublicKey::from_secret_key(&secp, &secret_key);

    let msg = Message::from_digest_slice(message).expect("32 byte message");
    let sig = secp.sign_ecdsa(&msg, &secret_key);

    let sig_bytes = sig.serialize_compact();
    let mut signature = [0u8; 64];
    signature.copy_from_slice(&sig_bytes);

    let pk_bytes = public_key.serialize();
    let mut pubkey = [0u8; 33];
    pubkey.copy_from_slice(&pk_bytes);

    (signature, pubkey)
}

/// Create a counterparty signature using seed 0x22
pub fn make_counterparty_signature(message: &[u8; 32]) -> (Signature, PubKey) {
    let secp = Secp256k1::new();
    let secret_key = SecretKey::from_slice(&[0x22u8; 32])
        .expect("32 bytes, within curve order");
    let public_key = PublicKey::from_secret_key(&secp, &secret_key);

    let msg = Message::from_digest_slice(message).expect("32 byte message");
    let sig = secp.sign_ecdsa(&msg, &secret_key);

    let sig_bytes = sig.serialize_compact();
    let mut signature = [0u8; 64];
    signature.copy_from_slice(&sig_bytes);

    let pk_bytes = public_key.serialize();
    let mut pubkey = [0u8; 33];
    pubkey.copy_from_slice(&pk_bytes);

    (signature, pubkey)
}

// ============================================================================
// CHARMS SDK HELPERS
// ============================================================================

/// Create a test Charms App instance
pub fn make_app() -> App {
    App {
        tag: 'n',
        identity: AppB32([0x01; 32]),
        vk: AppB32([0x00; 32]),
    }
}

/// Create a test UTXO ID
pub fn make_utxo(id_byte: u8, index: u32) -> UtxoId {
    UtxoId(TxId([id_byte; 32]), index)
}

/// Wrap a badge in a BTreeMap for Charms transaction
pub fn wrap_badge(app: &App, badge: &VeilBadge) -> BTreeMap<App, Data> {
    let mut map = BTreeMap::new();
    map.insert(app.clone(), Data::from(badge));
    map
}

// ============================================================================
// BADGE FACTORIES
// ============================================================================

/// Standard genesis UTXO for testing
pub fn make_genesis_utxo() -> Vec<u8> {
    vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
         17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
}

/// Create a standard test public key
pub fn make_pubkey() -> PubKey {
    let (_, pk) = make_signature(&[0u8; 32]);
    pk
}

/// Create a freshly minted badge (no transaction history)
pub fn make_minted_badge(current_block: u64) -> VeilBadge {
    let genesis = make_genesis_utxo();
    let backing_agg = BackingAggregates::default();
    VeilBadge {
        id: compute_badge_id(&genesis),
        created_at: current_block,
        pubkey: make_pubkey(),
        tx_total: 0,
        tx_positive: 0,
        tx_negative: 0,
        volume_total: 0,
        volume_sum_squares: 0,
        window_tx_count: 0,
        window_volume: 0,
        window_start: current_block,
        counterparty_count: 0,
        backing: backing_agg,
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        trust: 15,
        risk: 35,
        flags: RiskFlags::NEW_BADGE | RiskFlags::ISOLATED,
        last_nonce: B32::zero(),
        last_update: current_block,
    }
}

/// Create an established badge with transaction history (trust >= 30)
pub fn make_established_badge(current_block: u64) -> VeilBadge {
    let genesis = make_genesis_utxo();
    let backing_agg = BackingAggregates::default();
    // Use saturating_sub to avoid underflow
    let created_at = current_block.saturating_sub(NEW_BADGE_THRESHOLD_BLOCKS + 1000);
    let window_start = current_block.saturating_sub(WINDOW_SIZE_BLOCKS).saturating_add(1000);
    VeilBadge {
        id: compute_badge_id(&genesis),
        created_at,
        pubkey: make_pubkey(),
        tx_total: 20,
        tx_positive: 19,
        tx_negative: 1,
        volume_total: 500_000,
        volume_sum_squares: 500_000u128 * 500_000u128 / 20,
        window_tx_count: 5,
        window_volume: 100_000,
        window_start,
        counterparty_count: 15,
        backing: backing_agg,
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        trust: 65, // Established badge with good history
        risk: 15,
        flags: RiskFlags::default(),
        last_nonce: B32::zero(),
        last_update: current_block - 100,
    }
}

/// Create a test badge with specific trust level
pub fn make_badge_with_trust(current_block: u64, trust: u64) -> VeilBadge {
    let mut badge = make_established_badge(current_block);
    badge.trust = trust;
    badge
}

/// Create target badge ID for vouch tests
pub fn make_target_badge_id() -> B32 {
    let mut id = [0u8; 32];
    for i in 0..32 {
        id[i] = (i + 100) as u8;
    }
    B32::from(id)
}

/// Create voucher badge ID for vouch tests
pub fn make_voucher_badge_id() -> B32 {
    let mut id = [0u8; 32];
    for i in 0..32 {
        id[i] = (i + 200) as u8;
    }
    B32::from(id)
}

// ============================================================================
// RECORD HELPERS
// ============================================================================

/// Create a signed transaction record between two badges
pub fn create_signed_record(
    party_a: B32,
    party_b: B32,
    value: u64,
    outcome: Outcome,
    nonce: B32,
) -> (TransactionRecord, Signature, Signature, PubKey) {
    let record = TransactionRecord {
        nonce,
        party_a,
        party_b,
        value,
        tx_type: TxType::P2PSale,
        timestamp: 1700000000,
        outcome,
    };

    let record_hash = hash_record(&record);
    let (my_sig, _) = make_signature(record_hash.as_bytes());
    let (counterparty_sig, counterparty_pk) = make_counterparty_signature(record_hash.as_bytes());

    (record, my_sig, counterparty_sig, counterparty_pk)
}

/// Apply a record transaction to a badge and compute the new state
pub fn apply_record(
    old_badge: &VeilBadge,
    _counterparty_id: B32,
    value: u64,
    outcome: Outcome,
    nonce: B32,
    current_block: u64,
) -> VeilBadge {
    let mut new_badge = old_badge.clone();
    
    // Update transaction counts
    new_badge.tx_total += 1;
    match &outcome {
        Outcome::Positive => new_badge.tx_positive += 1,
        Outcome::Negative { .. } => new_badge.tx_negative += 1,
    }
    
    // Update volume aggregates
    new_badge.volume_total += value;
    new_badge.volume_sum_squares += (value as u128) * (value as u128);
    
    // Update rolling window
    let (wcount, wvol, wstart) = update_window(old_badge, value, current_block);
    new_badge.window_tx_count = wcount;
    new_badge.window_volume = wvol;
    new_badge.window_start = wstart;
    
    // Update replay protection
    new_badge.last_nonce = nonce;
    new_badge.last_update = current_block;
    
    // Recompute derived scores
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, value, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);
    
    new_badge
}
