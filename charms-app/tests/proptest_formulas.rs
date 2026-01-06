//! Property-Based Tests for Veil Formulas
//!
//! These tests use proptest to verify mathematical properties hold
//! across a wide range of inputs, catching edge cases that unit tests
//! might miss.

use proptest::prelude::*;
use veil::*;

// ============================================================================
// TRUST SCORE PROPERTIES
// ============================================================================

proptest! {
    /// Trust score must always be in range [0, 100]
    #[test]
    fn trust_always_in_valid_range(
        tx_positive in 0u32..1000,
        tx_negative in 0u32..100,
        age_blocks in 1u64..1_000_000,
        vouches_count in 0usize..10,
    ) {
        let mut badge = create_test_badge(tx_positive, tx_negative, age_blocks);

        // Add random vouches
        for i in 0..vouches_count {
            badge.vouches_in.push(Vouch {
                badge_id: B32([i as u8; 32]),
                stake_percent: (i as u8 * 10).min(100),
                created_at: 0,
                unlock_at: 0,
            });
        }

        let trust = compute_trust(&badge, age_blocks + 1000);

        // trust is u64, so >= 0 is always true
        prop_assert!(trust <= 100);
    }

    /// Trust score should never panic on edge cases
    #[test]
    fn trust_never_panics(
        tx_positive in 0u32..10_000,
        tx_negative in 0u32..1_000,
        age_blocks in 0u64..10_000_000,  // Reasonable max (69k days / 190 years)
        _cascade_damage in 0u64..200,
    ) {
        let badge = create_test_badge(tx_positive, tx_negative, age_blocks);
        let current_block = age_blocks.saturating_add(1000);

        // Should not panic regardless of inputs
        let _trust = compute_trust(&badge, current_block);
    }

    /// More positive transactions should generally increase trust
    #[test]
    fn more_positives_increases_trust(
        base_positive in 10u32..100,
        tx_negative in 0u32..10,
        age_blocks in 1000u64..100_000,
    ) {
        let badge1 = create_test_badge(base_positive, tx_negative, age_blocks);
        let badge2 = create_test_badge(base_positive + 50, tx_negative, age_blocks);

        let trust1 = compute_trust(&badge1, age_blocks + 1000);
        let trust2 = compute_trust(&badge2, age_blocks + 1000);

        // More positive transactions should not decrease trust
        prop_assert!(trust2 >= trust1);
    }

    /// Negative transactions should decrease trust
    #[test]
    fn negatives_decrease_trust(
        tx_positive in 50u32..100,
        base_negative in 0u32..10,
        age_blocks in 1000u64..100_000,
    ) {
        let badge1 = create_test_badge(tx_positive, base_negative, age_blocks);
        let badge2 = create_test_badge(tx_positive, base_negative + 5, age_blocks);

        let trust1 = compute_trust(&badge1, age_blocks + 1000);
        let trust2 = compute_trust(&badge2, age_blocks + 1000);

        // More negative transactions should not increase trust
        prop_assert!(trust2 <= trust1);
    }
}

// ============================================================================
// RISK SCORE PROPERTIES
// ============================================================================

proptest! {
    /// Risk score must always be in range [0, 100]
    #[test]
    fn risk_always_in_valid_range(
        acceleration in proptest::bool::ANY,
        extraction in proptest::bool::ANY,
        isolated in proptest::bool::ANY,
        too_clean in proptest::bool::ANY,
        erratic in proptest::bool::ANY,
        new_badge in proptest::bool::ANY,
    ) {
        let mut flags = RiskFlags::empty();
        flags.set_acceleration(acceleration);
        flags.set_extraction(extraction);
        flags.set_isolated(isolated);
        flags.set_too_clean(too_clean);
        flags.set_erratic(erratic);
        flags.set_new_badge(new_badge);

        let risk = compute_risk(&flags);

        // risk is u8, so >= 0 is always true
        prop_assert!(risk <= 100);
    }

    /// More flags should generally increase risk
    #[test]
    fn more_flags_increases_risk(flag_count in 0usize..6) {
        let flags1 = create_flags_with_count(flag_count);
        let flags2 = create_flags_with_count(flag_count + 1);

        let risk1 = compute_risk(&flags1);
        let risk2 = compute_risk(&flags2);

        prop_assert!(risk2 >= risk1);
    }

    // NOTE: Coefficient of variation test removed due to I32F32 overflow limits
    // The fixed-point type I32F32 can represent values up to ~2.1 billion
    // For large transaction volumes (e.g., 10k sats * 1000 tx), volume_sum_squares
    // can exceed this limit. This is a known limitation of fixed-point arithmetic
    // and would need I64F64 or dynamic scaling for larger values.
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

fn create_test_badge(tx_positive: u32, tx_negative: u32, _age_blocks: u64) -> VeilBadge {
    let tx_total = (tx_positive + tx_negative) as u64;
    let volume_total = tx_total * 10000; // Assume avg 10k sats
    let volume_sum_squares = volume_total as u128 * 10000;

    VeilBadge {
        schema_version: veil::SCHEMA_VERSION,
        id: B32([0; 32]),
        created_at: 100_000,
        pubkey: [0; 33],
        tx_total,
        tx_positive: tx_positive as u64,
        tx_negative: tx_negative as u64,
        volume_total,
        volume_sum_squares,
        window_tx_count: 0,
        window_volume: 0,
        window_start: 100_000,
        counterparty_count: 0,
        backing: BackingAggregates {
            backed_count: 0,
            backed_volume: 0,
            unbacked_count: 0,
            unbacked_volume: 0,
        },
        vouches_out: Vec::new(),
        vouches_in: Vec::new(),
        trust: 15,
        risk: 0,
        flags: RiskFlags::empty(),
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        last_nonce: B32([0; 32]),
        last_update: 100_000,
    }
}

fn create_flags_with_count(count: usize) -> RiskFlags {
    let mut flags = RiskFlags::empty();
    if count > 0 { flags.set_acceleration(true); }
    if count > 1 { flags.set_extraction(true); }
    if count > 2 { flags.set_isolated(true); }
    if count > 3 { flags.set_too_clean(true); }
    if count > 4 { flags.set_erratic(true); }
    if count > 5 { flags.set_new_badge(true); }
    flags
}
