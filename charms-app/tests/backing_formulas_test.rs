//! Tests for backing-related formulas
//!
//! Tests for weighted trust computation and backing-aware aggregates.

use veil::types::backing::{BackingAggregates, TransactionType, BACKED_WEIGHT, UNBACKED_WEIGHT};
use veil::formulas::backing::{BackingWeightedAggregates, check_low_verified_ratio, compute_weighted_trust};

// ============================================================================
// WEIGHTED AGGREGATES TESTS
// ============================================================================

#[test]
fn test_weighted_aggregates_backed() {
    let mut agg = BackingWeightedAggregates::default();

    agg.record(TransactionType::Backed, true, 100_000);

    assert_eq!(agg.tx_backed, 1);
    assert_eq!(agg.tx_unbacked, 0);
    assert_eq!(agg.weighted_positive, BACKED_WEIGHT);
    assert_eq!(agg.weighted_negative, 0.0);
}

#[test]
fn test_weighted_aggregates_unbacked() {
    let mut agg = BackingWeightedAggregates::default();

    agg.record(TransactionType::Unbacked, true, 100_000);

    assert_eq!(agg.tx_backed, 0);
    assert_eq!(agg.tx_unbacked, 1);
    assert_eq!(agg.weighted_positive, UNBACKED_WEIGHT);
}

#[test]
fn test_verified_ratio() {
    let agg = BackingWeightedAggregates {
        tx_backed: 7,
        tx_unbacked: 3,
        ..Default::default()
    };

    assert_eq!(agg.verified_ratio(), 70);
    assert!(agg.meets_verified_threshold());
}

// ============================================================================
// LOW VERIFIED RATIO FLAG TESTS
// ============================================================================

#[test]
fn test_low_verified_ratio_flag() {
    let mut agg = BackingAggregates::default();

    // Not enough history
    agg.record(TransactionType::Backed, 1000);
    agg.record(TransactionType::Unbacked, 1000);
    assert!(!check_low_verified_ratio(&agg, 7));

    // Build more history with low ratio
    for _ in 0..10 {
        agg.record(TransactionType::Unbacked, 1000);
    }
    assert!(check_low_verified_ratio(&agg, 12));
}

// ============================================================================
// WEIGHTED TRUST TESTS
// ============================================================================

#[test]
fn test_weighted_trust_backed_positive() {
    let mut agg = BackingWeightedAggregates::default();

    // 10 backed positive transactions
    for _ in 0..10 {
        agg.record(TransactionType::Backed, true, 100_000);
    }

    let trust = compute_weighted_trust(&agg, 10000, 20, 0);

    // Should have high trust
    assert!(trust > 60);
}

#[test]
fn test_weighted_trust_unbacked_discounted() {
    let mut backed_agg = BackingWeightedAggregates::default();
    let mut unbacked_agg = BackingWeightedAggregates::default();

    // 10 backed positive transactions
    for _ in 0..10 {
        backed_agg.record(TransactionType::Backed, true, 100_000);
    }

    // 10 unbacked positive transactions
    for _ in 0..10 {
        unbacked_agg.record(TransactionType::Unbacked, true, 100_000);
    }

    let backed_trust = compute_weighted_trust(&backed_agg, 10000, 20, 0);
    let unbacked_trust = compute_weighted_trust(&unbacked_agg, 10000, 20, 0);

    // Backed should have higher trust
    assert!(backed_trust > unbacked_trust);
}
