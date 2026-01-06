//! Tests for backing-related types
//!
//! Tests for TransactionBacking, BackingPolicy, BackingAggregates,
//! TransactionType, CounterpartyPolicy, and BackedTransactionRecord.

use veil::types::backing::*;

// ============================================================================
// TRANSACTION BACKING TESTS
// ============================================================================

#[test]
fn test_backing_weight() {
    assert_eq!(TransactionBacking::Unbacked.weight(), UNBACKED_WEIGHT);
    assert_eq!(
        TransactionBacking::Backed { backing_ref: None }.weight(),
        BACKED_WEIGHT
    );
}

// ============================================================================
// BACKING POLICY TESTS
// ============================================================================

#[test]
fn test_policy_threshold() {
    let policy = BackingPolicy::threshold(30);

    assert!(!policy.allows_unbacked(15)); // Below threshold
    assert!(!policy.allows_unbacked(29)); // Still below
    assert!(policy.allows_unbacked(30));  // At threshold
    assert!(policy.allows_unbacked(50));  // Above threshold
}

#[test]
fn test_policy_permissive() {
    let policy = BackingPolicy::permissive();

    assert!(policy.allows_unbacked(0));
    assert!(policy.allows_unbacked(100));
}

#[test]
fn test_policy_strict() {
    let policy = BackingPolicy::strict();

    assert!(!policy.allows_unbacked(0));
    assert!(!policy.allows_unbacked(99));
    assert!(policy.allows_unbacked(100));
}

// ============================================================================
// BACKING STATS TESTS
// ============================================================================

#[test]
fn test_verified_ratio() {
    let stats = BackingStats {
        tx_backed: 7,
        tx_unbacked: 3,
    };
    assert_eq!(stats.verified_ratio(), 70);

    let empty = BackingStats::default();
    assert_eq!(empty.verified_ratio(), 0);
}

#[test]
fn test_requires_backing() {
    let strict_policy = BackingPolicy::threshold(50);

    assert!(requires_backing(30, &strict_policy));  // Low trust → needs backing
    assert!(!requires_backing(60, &strict_policy)); // High trust → no backing needed
}

// ============================================================================
// TRANSACTION TYPE TESTS
// ============================================================================

#[test]
fn test_transaction_type_weights() {
    assert_eq!(TransactionType::Backed.weight(), 1.0);
    assert_eq!(TransactionType::Unbacked.weight(), 0.3);
}

// ============================================================================
// COUNTERPARTY POLICY TESTS
// ============================================================================

#[test]
fn test_counterparty_policy_trust_threshold() {
    let policy = CounterpartyPolicy {
        require_backing_below_trust: 30,
        accept_unbacked: true,
        require_backing_above_value: None,
    };

    assert!(policy.requires_backing(25, 10000));
    assert!(!policy.requires_backing(35, 10000));
    assert!(!policy.requires_backing(30, 10000));
}

// ============================================================================
// BACKING AGGREGATES TESTS
// ============================================================================

#[test]
fn test_backing_aggregates() {
    let mut agg = BackingAggregates::default();

    agg.record(TransactionType::Backed, 10000);
    agg.record(TransactionType::Backed, 20000);
    agg.record(TransactionType::Unbacked, 5000);

    assert_eq!(agg.backed_count, 2);
    assert_eq!(agg.unbacked_count, 1);
    assert_eq!(agg.backed_volume, 30000);
    assert_eq!(agg.unbacked_volume, 5000);
    assert_eq!(agg.total_count(), 3);

    assert!((agg.backed_ratio() - 0.666).abs() < 0.01);
}
