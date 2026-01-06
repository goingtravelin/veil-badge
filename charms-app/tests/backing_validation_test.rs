//! Tests for backing-related validation
//!
//! Tests for validate_against_policy and backing proof validation.

use veil::types::backing::*;
use veil::validation::backing::*;

// ============================================================================
// POLICY VALIDATION TESTS
// ============================================================================

#[test]
fn test_validate_against_policy() {
    let policy = CounterpartyPolicy::default(); // require_backing_below_trust: 30

    // Low trust + Unbacked → Error
    let result = validate_against_policy(
        TransactionType::Unbacked,
        &policy,
        25, // trust below threshold
        10000,
    );
    assert!(matches!(result, Err(BackingValidationError::BackingRequired { .. })));

    // Low trust + Backed → OK
    let result = validate_against_policy(
        TransactionType::Backed,
        &policy,
        25,
        10000,
    );
    assert!(result.is_ok());

    // High trust + Unbacked → OK
    let result = validate_against_policy(
        TransactionType::Unbacked,
        &policy,
        50,
        10000,
    );
    assert!(result.is_ok());
}
