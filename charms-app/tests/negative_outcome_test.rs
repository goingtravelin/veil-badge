//! Negative Outcome Variation Tests
//!
//! Tests for different severity levels and mixed outcome histories.

mod common;

use veil::*;
use common::*;

// ============================================================================
// SEVERITY LEVEL TESTS
// ============================================================================

#[test]
fn test_minor_severity_effects() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    let old_trust = old_badge.trust;
    
    let value = 50_000;
    let nonce = B32::from([1u8; 32]);
    let outcome = Outcome::Negative { severity: Severity::Minor };
    
    let new_badge = apply_record(
        &old_badge,
        B32::from([99u8; 32]),
        value,
        outcome.clone(),
        nonce,
        current_block,
    );
    
    // Minor severity: 5 damage
    println!("Minor severity:");
    println!("  Old trust: {}", old_trust);
    println!("  New trust: {}", new_badge.trust);
    println!("  Damage: {}", Severity::Minor.damage());
    
    assert_eq!(new_badge.tx_negative, old_badge.tx_negative + 1);
    // Trust should decrease, but by the smallest amount
    assert!(new_badge.trust <= old_trust, "Trust should not increase after negative");
}

#[test]
fn test_major_severity_effects() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    let old_trust = old_badge.trust;
    
    let value = 50_000;
    let nonce = B32::from([1u8; 32]);
    let outcome = Outcome::Negative { severity: Severity::Major };
    
    let new_badge = apply_record(
        &old_badge,
        B32::from([99u8; 32]),
        value,
        outcome.clone(),
        nonce,
        current_block,
    );
    
    // Major severity: 15 damage
    println!("Major severity:");
    println!("  Old trust: {}", old_trust);
    println!("  New trust: {}", new_badge.trust);
    println!("  Damage: {}", Severity::Major.damage());
    
    assert_eq!(new_badge.tx_negative, old_badge.tx_negative + 1);
}

#[test]
fn test_severe_severity_effects() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    let old_trust = old_badge.trust;
    
    let value = 50_000;
    let nonce = B32::from([1u8; 32]);
    let outcome = Outcome::Negative { severity: Severity::Severe };
    
    let new_badge = apply_record(
        &old_badge,
        B32::from([99u8; 32]),
        value,
        outcome.clone(),
        nonce,
        current_block,
    );
    
    // Severe severity: 50 damage
    println!("Severe severity:");
    println!("  Old trust: {}", old_trust);
    println!("  New trust: {}", new_badge.trust);
    println!("  Damage: {}", Severity::Severe.damage());
    
    assert_eq!(new_badge.tx_negative, old_badge.tx_negative + 1);
    // Severe should have significant impact
}

#[test]
fn test_severity_damage_values() {
    assert_eq!(Severity::Minor.damage(), 5);
    assert_eq!(Severity::Major.damage(), 15);
    assert_eq!(Severity::Severe.damage(), 50);
}

// ============================================================================
// MIXED OUTCOME HISTORY TESTS
// ============================================================================

#[test]
fn test_mixed_positive_negative_history() {
    let genesis_block = 100_000;
    let mut badge = make_minted_badge(genesis_block);
    
    // Record 10 transactions: 8 positive, 2 negative
    let outcomes = [
        Outcome::Positive,
        Outcome::Positive,
        Outcome::Negative { severity: Severity::Minor },
        Outcome::Positive,
        Outcome::Positive,
        Outcome::Positive,
        Outcome::Negative { severity: Severity::Major },
        Outcome::Positive,
        Outcome::Positive,
        Outcome::Positive,
    ];
    
    for (i, outcome) in outcomes.iter().enumerate() {
        let tx_block = genesis_block + (i as u64 * 100);
        let nonce = B32::from([(i + 1) as u8; 32]);
        
        badge = apply_record(
            &badge,
            B32::from([99u8; 32]),
            10_000,
            outcome.clone(),
            nonce,
            tx_block,
        );
    }
    
    assert_eq!(badge.tx_total, 10);
    assert_eq!(badge.tx_positive, 8);
    assert_eq!(badge.tx_negative, 2);
    
    println!("Mixed history (8 positive, 2 negative):");
    println!("  Trust: {}", badge.trust);
    println!("  Risk: {}", badge.risk);
    println!("  Too clean: {}", badge.flags.too_clean());
    
    // Should NOT be flagged as too_clean (has negatives)
    assert!(!badge.flags.too_clean());
}

#[test]
fn test_trust_recovery_after_negative() {
    let genesis_block = 100_000;
    let mut badge = make_established_badge(genesis_block);
    badge.trust = 70;
    
    println!("Starting trust: {}", badge.trust);
    
    // Record a severe negative
    badge = apply_record(
        &badge,
        B32::from([99u8; 32]),
        50_000,
        Outcome::Negative { severity: Severity::Severe },
        B32::from([1u8; 32]),
        genesis_block + 100,
    );
    
    let trust_after_negative = badge.trust;
    println!("Trust after severe negative: {}", trust_after_negative);
    
    // Record several positives to see recovery
    for i in 2..=10 {
        badge = apply_record(
            &badge,
            B32::from([99u8; 32]),
            10_000,
            Outcome::Positive,
            B32::from([i as u8; 32]),
            genesis_block + (i as u64 * 100),
        );
    }
    
    println!("Trust after 9 positives: {}", badge.trust);
    println!("Transactions: {} total, {} positive, {} negative",
             badge.tx_total, badge.tx_positive, badge.tx_negative);
    
    // Trust should have recovered somewhat
    assert!(badge.trust > trust_after_negative || trust_after_negative == 100,
        "Trust should recover with positive transactions");
}

#[test]
fn test_consecutive_negatives() {
    let genesis_block = 100_000;
    let mut badge = make_established_badge(genesis_block);
    badge.trust = 80;
    
    let trust_values: Vec<u64> = (0..5).map(|i| {
        badge = apply_record(
            &badge,
            B32::from([99u8; 32]),
            10_000,
            Outcome::Negative { severity: Severity::Major },
            B32::from([(i + 1) as u8; 32]),
            genesis_block + (i as u64 * 100),
        );
        badge.trust
    }).collect();
    
    println!("Trust after consecutive negatives:");
    for (i, trust) in trust_values.iter().enumerate() {
        println!("  After {} negatives: {}", i + 1, trust);
    }
    
    // Trust should be decreasing (or bottomed out)
    assert!(trust_values[4] <= trust_values[0], 
        "Trust should decrease with consecutive negatives");
}

// ============================================================================
// TRUST FORMULA COMPONENT TESTS
// ============================================================================

#[test]
fn test_history_component() {
    let current_block = 100_000;
    
    // Badge with all positives
    let mut all_positive = make_established_badge(current_block);
    all_positive.tx_total = 100;
    all_positive.tx_positive = 100;
    all_positive.tx_negative = 0;
    
    // Badge with 50/50
    let mut mixed = make_established_badge(current_block);
    mixed.tx_total = 100;
    mixed.tx_positive = 50;
    mixed.tx_negative = 50;
    
    // Badge with mostly negative
    let mut mostly_negative = make_established_badge(current_block);
    mostly_negative.tx_total = 100;
    mostly_negative.tx_positive = 20;
    mostly_negative.tx_negative = 80;
    
    let trust_positive = compute_trust(&all_positive, current_block);
    let trust_mixed = compute_trust(&mixed, current_block);
    let trust_negative = compute_trust(&mostly_negative, current_block);
    
    println!("Trust by outcome ratio:");
    println!("  All positive (100/0): {}", trust_positive);
    println!("  Mixed (50/50): {}", trust_mixed);
    println!("  Mostly negative (20/80): {}", trust_negative);
    
    assert!(trust_positive >= trust_mixed, "All positive should have higher trust than mixed");
    assert!(trust_mixed >= trust_negative, "Mixed should have higher trust than mostly negative");
}

#[test]
fn test_age_component() {
    let current_block = 100_000;
    
    // New badge (just created)
    let new_badge = make_minted_badge(current_block);
    
    // Established badge (past 90 days)
    let established = make_established_badge(current_block);
    
    let trust_new = compute_trust(&new_badge, current_block);
    let trust_established = compute_trust(&established, current_block);
    
    println!("Trust by age:");
    println!("  New badge: {}", trust_new);
    println!("  Established badge: {}", trust_established);
    
    // Both start at 50, but established has transaction history
    // Age itself may or may not directly affect trust (depends on formula)
}

#[test]
fn test_network_component() {
    let current_block = 100_000;
    
    // Isolated badge (no vouches)
    let mut isolated = make_established_badge(current_block);
    isolated.vouches_in = vec![];
    
    // Well-connected badge
    let mut connected = make_established_badge(current_block);
    connected.vouches_in = vec![
        Vouch { badge_id: B32::from([1u8; 32]), stake_percent: 30, created_at: 0, unlock_at: 0 },
        Vouch { badge_id: B32::from([2u8; 32]), stake_percent: 30, created_at: 0, unlock_at: 0 },
    ];
    
    let trust_isolated = compute_trust(&isolated, current_block);
    let trust_connected = compute_trust(&connected, current_block);
    
    println!("Trust by network:");
    println!("  Isolated (0 incoming): {} (network score: {})", 
             trust_isolated, compute_network_score(&isolated));
    println!("  Connected (60% incoming): {} (network score: {})", 
             trust_connected, compute_network_score(&connected));
    
    // Connected badge should have equal or higher trust due to network bonus
    assert!(trust_connected >= trust_isolated, 
        "Well-connected badge should have higher or equal trust");
}

#[test]
fn test_damage_component() {
    let current_block = 100_000;
    
    // Badge with no cascade damage
    let mut no_damage = make_established_badge(current_block);
    no_damage.cascade_damage = 0;
    
    // Badge with significant cascade damage
    let mut damaged = make_established_badge(current_block);
    damaged.cascade_damage = 30;
    
    let trust_healthy = compute_trust(&no_damage, current_block);
    let trust_damaged = compute_trust(&damaged, current_block);
    
    println!("Trust by cascade damage:");
    println!("  No damage: {}", trust_healthy);
    println!("  30 damage: {}", trust_damaged);
    
    // Damaged badge should have lower trust
    assert!(trust_damaged <= trust_healthy, 
        "Cascade damage should reduce trust");
}

// ============================================================================
// OUTCOME VALIDATION TESTS
// ============================================================================

#[test]
fn test_record_positive_validation() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100_000;
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
    
    assert!(validate_record(
        &old_badge,
        &new_badge,
        Outcome::Positive,
        value,
        current_block,
        &witness,
    ));
    
    assert_eq!(new_badge.tx_positive, 1);
    assert_eq!(new_badge.tx_negative, 0);
}

#[test]
fn test_record_negative_validation() {
    let current_block = 1000;
    let old_badge = make_minted_badge(100);
    let value = 100_000;
    let nonce = B32::from([1u8; 32]);
    let outcome = Outcome::Negative { severity: Severity::Major };

    let (record, my_sig, counterparty_sig, counterparty_pk) = 
        create_signed_record(
            old_badge.id,
            B32::from([99u8; 32]),
            value,
            outcome.clone(),
            nonce,
        );

    let witness = RecordWitness {
        record,
        my_signature: my_sig,
        counterparty_signature: counterparty_sig,
        counterparty_pubkey: counterparty_pk,
    };
    
    let new_badge = apply_record(&old_badge, B32::from([99u8; 32]), value, outcome.clone(), nonce, current_block);
    
    assert!(validate_record(
        &old_badge,
        &new_badge,
        outcome,
        value,
        current_block,
        &witness,
    ));
    
    assert_eq!(new_badge.tx_positive, 0);
    assert_eq!(new_badge.tx_negative, 1);
}
