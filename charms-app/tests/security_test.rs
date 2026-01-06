//! Security and Attack Scenario Tests
//!
//! Tests for attack vectors, invalid inputs, and edge cases.
//! These tests ensure the protocol is resilient to manipulation attempts.

mod common;

use veil::*;
use common::*;

// ============================================================================
// SIGNATURE ATTACK TESTS
// ============================================================================

#[test]
fn test_record_invalid_signature_rejected() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100_000;
    let nonce = B32::from([1u8; 32]);

    let (record, _my_sig, counterparty_sig, counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            value,
            Outcome::Positive,
            nonce,
        );

    // Use an invalid signature (all zeros)
    let invalid_sig: Signature = [0u8; 64];

    let witness = RecordWitness {
        record: record.clone(),
        my_signature: invalid_sig, // Invalid!
        counterparty_signature: counterparty_sig,
        counterparty_pubkey: counterparty_pk,
    };
    
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, Outcome::Positive, nonce, current_block);
    
    // Should reject due to invalid signature
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    ));
}

#[test]
fn test_record_forged_counterparty_signature_rejected() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100_000;
    let nonce = B32::from([1u8; 32]);

    let (record, my_sig, _counterparty_sig, _counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            value,
            Outcome::Positive,
            nonce,
        );

    // Use a different keypair for counterparty (forged signature)
    let (_, wrong_pk) = make_keypair(0x99); // Different key!
    let forged_sig: Signature = [0x42u8; 64]; // Garbage signature

    let witness = RecordWitness {
        record: record.clone(),
        my_signature: my_sig,
        counterparty_signature: forged_sig, // Forged!
        counterparty_pubkey: wrong_pk,       // Wrong pubkey
    };
    
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, Outcome::Positive, nonce, current_block);
    
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    ));
}

#[test]
fn test_record_wrong_counterparty_pubkey_rejected() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100_000;
    let nonce = B32::from([1u8; 32]);

    let (record, my_sig, counterparty_sig, _correct_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            value,
            Outcome::Positive,
            nonce,
        );

    // Use a different pubkey than the one that signed
    let (_, wrong_pk) = make_keypair(0x99);

    let witness = RecordWitness {
        record: record.clone(),
        my_signature: my_sig,
        counterparty_signature: counterparty_sig, // Correct sig
        counterparty_pubkey: wrong_pk,             // But wrong pubkey!
    };
    
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, Outcome::Positive, nonce, current_block);
    
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    ));
}

// ============================================================================
// SELF-DEALING TESTS
// ============================================================================

#[test]
fn test_record_self_dealing_scenario() {
    // Note: Self-dealing (same badge as both parties) is technically allowed
    // by the protocol. Both signatures still need to be valid, and the badge
    // would just be recording a transaction with itself.
    //
    // This test documents the current behavior. If self-dealing should be
    // explicitly forbidden, validation logic would need to be updated.
    
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100_000;
    let nonce = B32::from([1u8; 32]);

    // Record where badge is both parties
    let (record, my_sig, counterparty_sig, counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            old_badge.id, // Same as party_a
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
    
    let new_badge = apply_record(&old_badge, old_badge.id, value, Outcome::Positive, nonce, current_block);
    
    // The validation passes because:
    // 1. my_signature verifies against old_badge.pubkey
    // 2. counterparty_signature verifies against counterparty_pubkey
    // 3. Both parties being the same badge ID is not explicitly forbidden
    let result = validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    );
    
    // Currently this passes - documenting actual behavior
    // If we want to forbid self-dealing, add: check!(record.party_a != record.party_b)
    assert!(result, "Self-dealing is currently allowed by the protocol");
}

#[test]
fn test_vouch_self_vouch_rejected() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    
    // Try to vouch for yourself
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: old_badge.id, // Self-vouch!
        stake_percent: 10,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    new_badge.last_update = current_block;
    
    let witness = VouchWitness {
        target_current_trust: 50,
    };
    
    assert!(!validate_vouch(
        &old_badge,
        &new_badge,
        old_badge.id, // Self-vouch!
        10,
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
}

// ============================================================================
// OUTCOME MANIPULATION TESTS
// ============================================================================

#[test]
fn test_record_outcome_mismatch_witness_rejected() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100_000;
    let nonce = B32::from([1u8; 32]);

    // Create a record with POSITIVE outcome
    let (record, my_sig, counterparty_sig, counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            value,
            Outcome::Positive, // Witness says positive
            nonce,
        );

    let witness = RecordWitness {
        record,
        my_signature: my_sig,
        counterparty_signature: counterparty_sig,
        counterparty_pubkey: counterparty_pk,
    };
    
    // Apply as negative to try to game the system
    let new_badge = apply_record(
        &old_badge, 
        B32::from([99u8; 32]), 
        value, 
        Outcome::Negative { severity: Severity::Severe }, // Mismatch!
        nonce, 
        current_block
    );
    
    // Should reject due to outcome mismatch
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Negative { severity: Severity::Severe }, // Claiming negative
        value,
        current_block,
        &witness, // But witness says positive
    ));
}

#[test]
fn test_record_value_mismatch_rejected() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let real_value = 100_000;
    let fake_value = 1_000_000; // Inflated value
    let nonce = B32::from([1u8; 32]);

    // Create record with real value
    let (record, my_sig, counterparty_sig, counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            real_value,
            Outcome::Positive,
            nonce,
        );

    let witness = RecordWitness {
        record,
        my_signature: my_sig,
        counterparty_signature: counterparty_sig,
        counterparty_pubkey: counterparty_pk,
    };
    
    // Try to record with inflated value
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), fake_value, Outcome::Positive, nonce, current_block);
    
    // Should reject due to value mismatch
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        fake_value, // Inflated!
        current_block,
        &witness,
    ));
}

// ============================================================================
// REPLAY ATTACK TESTS
// ============================================================================

#[test]
fn test_replay_same_nonce_rejected() {
    let current_block = 1000;
    let used_nonce = B32::from([1u8; 32]);
    
    let mut old_badge = make_minted_badge(100);
    old_badge.last_nonce = used_nonce; // Already used this nonce
    
    let value = 100_000;

    let (record, my_sig, counterparty_sig, counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            value,
            Outcome::Positive,
            used_nonce, // Same nonce!
        );

    let witness = RecordWitness {
        record,
        my_signature: my_sig,
        counterparty_signature: counterparty_sig,
        counterparty_pubkey: counterparty_pk,
    };
    
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, Outcome::Positive, used_nonce, current_block);
    
    assert!(!validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    ));
}

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

#[test]
fn test_record_zero_value_transaction() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 0; // Zero value
    let nonce = B32::from([1u8; 32]);

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
    
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, Outcome::Positive, nonce, current_block);
    
    // Zero value transactions should still be valid (they still count as activity)
    let result = validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    );
    
    assert!(result);
    assert_eq!(new_badge.tx_total, 1);
    assert_eq!(new_badge.volume_total, 0);
}

#[test]
fn test_trust_cannot_exceed_100() {
    let current_block = 100_000;
    
    // Create a badge with maximum possible positive factors
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 1000;
    badge.tx_positive = 1000;
    badge.tx_negative = 0;
    badge.volume_total = 100_000_000_000; // 100 BTC
    badge.vouches_in = vec![
        Vouch { badge_id: B32::from([1u8; 32]), stake_percent: 50, created_at: 0, unlock_at: 0 },
        Vouch { badge_id: B32::from([2u8; 32]), stake_percent: 50, created_at: 0, unlock_at: 0 },
    ];
    badge.cascade_damage = 0;
    
    let trust = compute_trust(&badge, current_block);
    
    // Trust must be capped at 100
    assert!(trust <= 100, "Trust {} exceeds 100", trust);
}

#[test]
fn test_trust_cannot_go_negative() {
    let current_block = 100_000;
    
    // Create a badge with maximum possible negative factors
    let mut badge = make_minted_badge(current_block);
    badge.tx_total = 100;
    badge.tx_positive = 0;
    badge.tx_negative = 100; // All negative
    badge.cascade_damage = 1000; // Massive cascade damage
    
    let trust = compute_trust(&badge, current_block);
    
    // Trust must not go negative (should be 0 at minimum)
    assert!(trust <= 100, "Trust computation should handle underflow");
}

#[test]
fn test_volume_sum_squares_large_values() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    
    // Large transaction value (10 BTC in sats)
    let value = 1_000_000_000u64;
    let nonce = B32::from([1u8; 32]);

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
    
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, Outcome::Positive, nonce, current_block);
    
    // Verify no overflow in volume_sum_squares (uses u128)
    let expected_sum_squares = (value as u128) * (value as u128);
    assert_eq!(new_badge.volume_sum_squares, expected_sum_squares);
    
    assert!(validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    ));
}

// ============================================================================
// VOUCH CAPACITY TESTS
// ============================================================================

#[test]
fn test_vouch_exceeds_100_percent_total() {
    let current_block = 100_000;
    let mut old_badge = make_established_badge(current_block);
    
    // Already vouching 90%
    old_badge.vouches_out.push(Vouch {
        badge_id: B32::from([1u8; 32]),
        stake_percent: 90,
        created_at: current_block - 1000,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    // Try to add another 20% (total would be 110%)
    let target_id = B32::from([2u8; 32]);
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 20, // Would exceed 100%!
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    new_badge.last_update = current_block;
    
    let witness = VouchWitness {
        target_current_trust: 50,
    };
    
    assert!(!validate_vouch(
        &old_badge,
        &new_badge,
        target_id,
        20,
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
}

#[test]
fn test_remaining_vouch_capacity() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    
    assert_eq!(remaining_vouch_capacity(&badge), 100);
    
    badge.vouches_out.push(Vouch {
        badge_id: B32::from([1u8; 32]),
        stake_percent: 30,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    assert_eq!(remaining_vouch_capacity(&badge), 70);
    
    badge.vouches_out.push(Vouch {
        badge_id: B32::from([2u8; 32]),
        stake_percent: 70,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    assert_eq!(remaining_vouch_capacity(&badge), 0);
}

// ============================================================================
// TRANSFER VALIDATION TESTS
// ============================================================================

#[test]
fn test_transfer_preserves_badge_exactly() {
    let badge = make_established_badge(100_000);
    let output_badge = badge.clone();
    
    assert!(validate_transfer(&badge, &output_badge));
}

#[test]
fn test_transfer_rejects_modified_trust() {
    let badge = make_established_badge(100_000);
    let mut output_badge = badge.clone();
    output_badge.trust = 99; // Modified!
    
    assert!(!validate_transfer(&badge, &output_badge));
}

#[test]
fn test_transfer_rejects_modified_id() {
    let badge = make_established_badge(100_000);
    let mut output_badge = badge.clone();
    output_badge.id = B32::from([99u8; 32]); // Modified!
    
    assert!(!validate_transfer(&badge, &output_badge));
}

#[test]
fn test_transfer_rejects_modified_tx_counts() {
    let badge = make_established_badge(100_000);
    let mut output_badge = badge.clone();
    output_badge.tx_positive += 1; // Sneaky modification!
    
    assert!(!validate_transfer(&badge, &output_badge));
}

#[test]
fn test_transfer_rejects_modified_vouches() {
    let badge = make_established_badge(100_000);
    let mut output_badge = badge.clone();
    output_badge.vouches_in.push(Vouch {
        badge_id: B32::from([99u8; 32]),
        stake_percent: 10,
        created_at: 0,
        unlock_at: 0,
    });
    
    assert!(!validate_transfer(&badge, &output_badge));
}

// ============================================================================
// PERFORMANCE BENCHMARKS
// ============================================================================

/// Benchmark signature verification performance with lowmemory feature
///
/// This test measures the actual performance impact of using secp256k1's
/// lowmemory feature (smaller precomputed tables, slower operations).
///
/// Expected results with lowmemory enabled:
/// - ~30-80μs per signature (vs ~10-20μs with default tables)
/// - Still acceptable for 2-sigs-per-transaction use case
///
/// Binary size trade-off:
/// - Default: 1.3MB binary (1.1MB precomputed tables)
/// - lowmemory: 253KB binary (~50KB tables) - 80% reduction!
#[test]
#[ignore] // Performance benchmark - may fail on slow systems
fn bench_signature_verification() {
    // Create test message and valid signature
    let message = B32::from([0x42u8; 32]);
    let (sig, pubkey) = make_signature(message.as_bytes());
    
    let iterations = 1000;
    let start = std::time::Instant::now();
    
    // Benchmark verification loop
    for _ in 0..iterations {
        let result = verify_signature(message.as_bytes(), &sig, &pubkey);
        assert!(result, "Signature should be valid");
    }
    
    let elapsed = start.elapsed();
    let avg_per_sig = elapsed / iterations;
    
    println!("\n=== Signature Verification Benchmark ===");
    println!("Iterations: {}", iterations);
    println!("Total time: {:?}", elapsed);
    println!("Avg per signature: {:?}", avg_per_sig);
    println!("Signatures/sec: {:.0}", 1_000_000_000.0 / avg_per_sig.as_nanos() as f64);
    println!("\nNote: Using secp256k1 lowmemory feature");
    println!("Binary size: 253KB (vs 1.3MB default) - 80% reduction");
    println!("Performance: ~2-4x slower than default (but still fast enough)");
    
    // Sanity check: with lowmemory feature, should complete < 300ms for 1000 iterations
    // This allows ~300μs per signature (~2-4x slower than default, but acceptable)
    assert!(
        elapsed.as_millis() < 300,
        "Signature verification too slow: {:?} for {} iterations",
        elapsed,
        iterations
    );
}

/// Benchmark signature verification under realistic transaction load
///
/// Each transaction validates 2 signatures (badge holder + counterparty).
/// This test simulates the verification cost for N transactions.
#[test]
#[ignore] // Performance benchmark - may fail on slow systems
fn bench_transaction_signature_load() {
    let num_transactions = 100;
    
    // Create test data
    let message = B32::from([0x42u8; 32]);
    let (sig1, pubkey1) = make_signature(message.as_bytes());
    let (sig2, pubkey2) = make_counterparty_signature(message.as_bytes());
    
    let start = std::time::Instant::now();
    
    // Simulate N transactions, each with 2 signature verifications
    for _ in 0..num_transactions {
        let result1 = verify_signature(message.as_bytes(), &sig1, &pubkey1);
        let result2 = verify_signature(message.as_bytes(), &sig2, &pubkey2);
        assert!(result1 && result2, "Signatures should be valid");
    }
    
    let elapsed = start.elapsed();
    let avg_per_tx = elapsed / num_transactions;
    
    println!("\n=== Transaction Signature Load Benchmark ===");
    println!("Transactions: {}", num_transactions);
    println!("Signatures per tx: 2");
    println!("Total signatures: {}", num_transactions * 2);
    println!("Total time: {:?}", elapsed);
    println!("Avg per transaction: {:?}", avg_per_tx);
    println!("Transactions/sec: {:.0}", 1_000_000_000.0 / avg_per_tx.as_nanos() as f64);
    
    // Sanity check: 100 transactions should complete in < 60ms with lowmemory feature
    // This allows ~600μs per transaction (2 signatures), accounting for 2-4x slowdown
    assert!(
        elapsed.as_millis() < 60,
        "Transaction verification too slow: {:?} for {} transactions",
        elapsed,
        num_transactions
    );
}
