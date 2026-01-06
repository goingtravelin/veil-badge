//! Unit tests for Veil Protocol validation
//!
//! Tests for mint, record, vouch, and cascade validation.

mod common;

use veil::*;
use common::*;

// ============================================================================
// MINT VALIDATION TESTS
// ============================================================================

#[test]
fn test_validate_mint_success() {
    let genesis = make_genesis_utxo();
    let pubkey = make_pubkey();
    let current_block = 100;
    
    let badge = make_minted_badge(current_block);
    
    assert!(validate_mint(&genesis, pubkey, &badge, current_block));
}

#[test]
fn test_validate_mint_wrong_id() {
    let genesis = make_genesis_utxo();
    let pubkey = make_pubkey();
    let current_block = 100;
    
    let mut badge = make_minted_badge(current_block);
    badge.id = B32::from([99u8; 32]); // Wrong ID
    
    assert!(!validate_mint(&genesis, pubkey, &badge, current_block));
}

#[test]
fn test_validate_mint_nonzero_counts() {
    let genesis = make_genesis_utxo();
    let pubkey = make_pubkey();
    let current_block = 100;
    
    let mut badge = make_minted_badge(current_block);
    badge.tx_total = 1; // Should be zero
    
    assert!(!validate_mint(&genesis, pubkey, &badge, current_block));
}

// ============================================================================
// RECORD VALIDATION TESTS
// ============================================================================

#[test]
fn test_validate_record_success() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100000;
    let nonce = B32::from([1u8; 32]);

    // Create the transaction record with signatures
    let (record, my_sig, counterparty_sig, counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            value,
            Outcome::Positive,
            nonce,
        );

    let witness = RecordWitness {
        record,
        my_signature: my_sig,
        counterparty_signature: counterparty_sig,
        counterparty_pubkey: counterparty_pk,
    };
    
    // Build the expected new badge state
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, Outcome::Positive, nonce, current_block);
    
    assert!(validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    ));
}

#[test]
fn test_validate_record_replay_attack() {
    let current_block = 1000;
    let mut old_badge = make_minted_badge(100);
    old_badge.last_nonce = B32::from([1u8; 32]); // Same nonce already used
    
    let record = TransactionRecord {
        nonce: B32::from([1u8; 32]), // REPLAY: same nonce
        party_a: old_badge.id,
        party_b: B32::from([99u8; 32]),
        value: 100000,
        tx_type: TxType::P2PSale,
        timestamp: 1700000000,
        outcome: Outcome::Positive,
    };
    
    let witness = RecordWitness {
        record,
        my_signature: [0u8; 64],
        counterparty_signature: [0u8; 64],
        counterparty_pubkey: [0u8; 33],
    };
    
    let mut new_badge = old_badge.clone();
    new_badge.tx_total = 1;
    new_badge.last_nonce = witness.record.nonce;
    
    // Should fail because nonce was already used
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        100000,
        current_block,
        &witness,
    ));
}

#[test]
fn test_validate_record_wrong_party() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    
    // Record doesn't include badge holder
    let record = TransactionRecord {
        nonce: B32::from([1u8; 32]),
        party_a: B32::from([98u8; 32]), // Different party
        party_b: B32::from([99u8; 32]), // Different party
        value: 100000,
        tx_type: TxType::P2PSale,
        timestamp: 1700000000,
        outcome: Outcome::Positive,
    };
    
    let witness = RecordWitness {
        record,
        my_signature: [0u8; 64],
        counterparty_signature: [0u8; 64],
        counterparty_pubkey: [0u8; 33],
    };
    
    let new_badge = old_badge.clone();
    
    // Should fail because badge holder is not a party
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        100000,
        current_block,
        &witness,
    ));
}

// ============================================================================
// VOUCH VALIDATION TESTS
// ============================================================================

#[test]
fn test_validate_vouch_success() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    let target_id = make_target_badge_id();
    let stake_percent = 25u8;
    let unlock_delay = MIN_VOUCH_LOCK_BLOCKS + 100;
    
    let witness = VouchWitness {
        target_current_trust: 40, // Target has enough trust
    };
    
    // Build expected new badge
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent,
        created_at: current_block,
        unlock_at: current_block + unlock_delay,
    });
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.last_update = current_block;
    
    assert!(validate_vouch(
        &old_badge,
        &new_badge,
        target_id,
        stake_percent,
        unlock_delay,
        current_block,
        &witness,
    ));
}

#[test]
fn test_validate_vouch_invalid_stake_zero() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    let target_id = make_target_badge_id();
    
    let witness = VouchWitness { target_current_trust: 40 };
    
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 0, // Invalid: must be >= 1
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    assert!(!validate_vouch(
        &old_badge,
        &new_badge,
        target_id,
        0, // Invalid stake
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
}

#[test]
fn test_validate_vouch_self_vouch_rejected() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    
    let witness = VouchWitness { target_current_trust: 40 };
    
    // Try to vouch for self
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: old_badge.id, // Self!
        stake_percent: 25,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    assert!(!validate_vouch(
        &old_badge,
        &new_badge,
        old_badge.id, // Self
        25,
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
}

#[test]
fn test_validate_vouch_exceeds_100_percent() {
    let current_block = 100_000;
    
    // Badge with existing vouches totaling 80%
    let mut old_badge = make_established_badge(current_block);
    old_badge.vouches_out.push(Vouch {
        badge_id: B32::from([1u8; 32]),
        stake_percent: 50,
        created_at: current_block - 1000,
        unlock_at: current_block + 5000,
    });
    old_badge.vouches_out.push(Vouch {
        badge_id: B32::from([2u8; 32]),
        stake_percent: 30,
        created_at: current_block - 500,
        unlock_at: current_block + 6000,
    });
    
    let witness = VouchWitness { target_current_trust: 40 };
    
    // Try to add 25% more (would exceed 100%)
    let target_id = make_target_badge_id();
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 25, // 80 + 25 = 105% > 100%
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    assert!(!validate_vouch(
        &old_badge,
        &new_badge,
        target_id,
        25,
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
}

// ============================================================================
// UNVOUCH VALIDATION TESTS
// ============================================================================

#[test]
fn test_validate_unvouch_success() {
    let current_block = 100_000;
    let target_id = make_target_badge_id();
    
    // Badge with existing vouch that has expired
    let vouch_created = current_block - MIN_VOUCH_LOCK_BLOCKS - 1000;
    let vouch_unlock = vouch_created + MIN_VOUCH_LOCK_BLOCKS;
    
    let mut old_badge = make_established_badge(current_block);
    old_badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 25,
        created_at: vouch_created,
        unlock_at: vouch_unlock,
    });
    
    // Remove the vouch
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.clear();
    new_badge.last_update = current_block;
    
    assert!(validate_unvouch(
        &old_badge,
        &new_badge,
        target_id,
        current_block,
    ));
}

#[test]
fn test_validate_unvouch_timelock_not_expired() {
    let current_block = 100_000;
    let target_id = make_target_badge_id();
    
    // Vouch hasn't expired yet
    let vouch_created = current_block - 100;
    let vouch_unlock = current_block + MIN_VOUCH_LOCK_BLOCKS;
    
    let mut old_badge = make_established_badge(current_block);
    old_badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 25,
        created_at: vouch_created,
        unlock_at: vouch_unlock,
    });
    
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.clear();
    
    // Should fail - timelock hasn't expired
    assert!(!validate_unvouch(
        &old_badge,
        &new_badge,
        target_id,
        current_block,
    ));
}

// ============================================================================
// CASCADE VALIDATION TESTS
// ============================================================================

#[test]
fn test_validate_cascade_success() {
    let current_block = 100_000;
    let source_id = make_target_badge_id();
    
    // Badge with vouch for source
    let mut old_badge = make_established_badge(current_block);
    old_badge.vouches_out.push(Vouch {
        badge_id: source_id,
        stake_percent: 40,
        created_at: current_block - 5000,
        unlock_at: current_block + 5000,
    });
    old_badge.trust = 70;
    
    // Witness proves source had negative outcome
    let witness = CascadeWitness {
        source_negative_proof: NegativeOutcomeProof {
            prev_tx_negative: 0,
            new_tx_negative: 1,
            severity: Severity::Major, // 15 base damage
        },
        vouch_record: Vouch {
            badge_id: source_id,
            stake_percent: 40,
            created_at: current_block - 5000,
            unlock_at: current_block + 5000,
        },
    };
    
    // Calculate expected damage: 15 * (40/100) = 6
    let expected_damage = calculate_cascade_damage(&Severity::Major, 40);
    assert_eq!(expected_damage, 6);
    
    // Build new badge with cascade damage applied
    let mut new_badge = old_badge.clone();
    new_badge.cascade_damage = expected_damage;
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, 0, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);
    new_badge.last_update = current_block;
    
    assert!(validate_cascade(
        &old_badge,
        &new_badge,
        source_id,
        expected_damage,
        &witness,
        current_block,
    ));
    
    // Verify trust decreased
    assert!(new_badge.trust < old_badge.trust);
}

#[test]
fn test_validate_cascade_no_vouch() {
    let current_block = 100_000;
    let source_id = make_target_badge_id();
    
    // Badge with NO vouch for source
    let old_badge = make_established_badge(current_block);
    
    let witness = CascadeWitness {
        source_negative_proof: NegativeOutcomeProof {
            prev_tx_negative: 0,
            new_tx_negative: 1,
            severity: Severity::Major,
        },
        vouch_record: Vouch {
            badge_id: source_id,
            stake_percent: 40,
            created_at: current_block - 5000,
            unlock_at: current_block + 5000,
        },
    };
    
    let mut new_badge = old_badge.clone();
    new_badge.cascade_damage = 6;
    
    // Should fail - badge never vouched for source
    assert!(!validate_cascade(
        &old_badge,
        &new_badge,
        source_id,
        6,
        &witness,
        current_block,
    ));
}

// ============================================================================
// NETWORK HELPER TESTS
// ============================================================================

#[test]
fn test_network_score_computation() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    
    // No incoming vouches
    assert_eq!(compute_network_score(&badge), 0);
    
    // Add some incoming vouches
    badge.vouches_in.push(Vouch {
        badge_id: B32::from([1u8; 32]),
        stake_percent: 25,
        created_at: current_block - 1000,
        unlock_at: current_block + 5000,
    });
    assert_eq!(compute_network_score(&badge), 25);
    
    badge.vouches_in.push(Vouch {
        badge_id: B32::from([2u8; 32]),
        stake_percent: 30,
        created_at: current_block - 500,
        unlock_at: current_block + 6000,
    });
    assert_eq!(compute_network_score(&badge), 55);
}

#[test]
fn test_remaining_vouch_capacity() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    
    // Full capacity initially
    assert_eq!(remaining_vouch_capacity(&badge), 100);
    
    // Add a 25% vouch
    badge.vouches_out.push(Vouch {
        badge_id: B32::from([1u8; 32]),
        stake_percent: 25,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    assert_eq!(remaining_vouch_capacity(&badge), 75);
    
    // Add more vouches
    badge.vouches_out.push(Vouch {
        badge_id: B32::from([2u8; 32]),
        stake_percent: 50,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    assert_eq!(remaining_vouch_capacity(&badge), 25);
}

#[test]
fn test_can_vouch_checks() {
    let current_block = 100_000;
    
    // New badge can't vouch
    let mut badge = make_minted_badge(current_block);
    badge.trust = MIN_TRUST_TO_VOUCH - 1;
    assert!(!can_vouch(&badge));
    
    // Badge at threshold can vouch
    badge.trust = MIN_TRUST_TO_VOUCH;
    assert!(can_vouch(&badge));
    
    // Established badge can vouch
    let established = make_established_badge(current_block);
    assert!(can_vouch(&established));
}
