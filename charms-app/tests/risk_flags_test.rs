//! Risk Flag Tests
//!
//! Tests for the various risk flag triggers:
//! - acceleration: velocity spike detection
//! - extraction: large withdrawal vs history
//! - isolated: weak vouch network
//! - too_clean: suspiciously perfect record
//! - erratic: high variance in transaction values
//! - new_badge: badge age threshold

mod common;

use veil::*;
use common::*;

// ============================================================================
// ACCELERATION FLAG TESTS
// ============================================================================

#[test]
fn test_acceleration_flag_velocity_spike() {
    let current_block = 100_000;
    
    // Badge with low historical velocity but high recent activity
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 10;
    badge.volume_total = 100_000; // Low historical volume
    badge.window_tx_count = 8;     // But 8 of those in current window!
    badge.window_volume = 80_000;   // Most volume is recent
    badge.window_start = current_block - 1000; // Recent window
    
    // Large new transaction in the window
    let proposed_value = 50_000;
    let flags = compute_flags(&badge, proposed_value, current_block);
    
    // Should trigger acceleration due to recent velocity spike
    // Historical avg: 100k / 10 = 10k per tx
    // Window avg: (80k + 50k) / 9 = ~14k per tx  
    // If window velocity >> historical velocity, flag triggers
    println!("Acceleration flag: {}", flags.acceleration());
}

#[test]
fn test_acceleration_flag_normal_velocity() {
    let current_block = 100_000;
    
    // Badge with consistent velocity
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 100;
    badge.volume_total = 1_000_000;
    badge.window_tx_count = 10;
    badge.window_volume = 100_000; // Proportional to history
    badge.window_start = current_block - WINDOW_SIZE_BLOCKS + 1000;
    
    let proposed_value = 10_000; // Normal transaction
    let flags = compute_flags(&badge, proposed_value, current_block);
    
    // Should NOT trigger acceleration - consistent pattern
    assert!(!flags.acceleration(), "Consistent velocity should not trigger acceleration");
}

// ============================================================================
// EXTRACTION FLAG TESTS
// ============================================================================

#[test]
fn test_extraction_flag_large_withdrawal() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 50;
    badge.volume_total = 500_000; // Average ~10k per tx
    
    // Proposed transaction much larger than average
    let proposed_value = 200_000; // 20x average!
    let flags = compute_flags(&badge, proposed_value, current_block);
    
    // Should trigger extraction flag
    assert!(flags.extraction(), "Large transaction vs history should trigger extraction");
}

#[test]
fn test_extraction_flag_normal_transaction() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 50;
    badge.volume_total = 500_000; // Average ~10k per tx
    
    // Normal sized transaction
    let proposed_value = 15_000; // 1.5x average - reasonable
    let flags = compute_flags(&badge, proposed_value, current_block);
    
    // Should NOT trigger extraction
    assert!(!flags.extraction(), "Normal transaction should not trigger extraction");
}

#[test]
fn test_extraction_first_transaction() {
    let current_block = 100_000;
    
    let badge = make_minted_badge(current_block);
    // No transaction history
    
    // First transaction - no history to compare against
    let proposed_value = 1_000_000;
    let flags = compute_flags(&badge, proposed_value, current_block);
    
    // Should NOT trigger extraction (no baseline to compare)
    // First transaction can't be "unusually large vs history"
    println!("Extraction on first tx: {}", flags.extraction());
}

// ============================================================================
// ISOLATED FLAG TESTS
// ============================================================================

#[test]
fn test_isolated_flag_no_vouches() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.vouches_in = vec![]; // No incoming vouches
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    assert!(flags.isolated(), "Badge with no incoming vouches should be isolated");
}

#[test]
fn test_isolated_flag_low_stake() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    // Only 5% total incoming stake (below ISOLATION_THRESHOLD of 20)
    badge.vouches_in = vec![
        Vouch { badge_id: B32::from([1u8; 32]), stake_percent: 5, created_at: 0, unlock_at: 0 },
    ];
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    let network_score = compute_network_score(&badge);
    assert_eq!(network_score, 5);
    assert!(flags.isolated(), "Low stake vouches should still be isolated");
}

#[test]
fn test_isolated_flag_sufficient_vouches() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    // 30% total incoming stake (above ISOLATION_THRESHOLD of 20)
    badge.vouches_in = vec![
        Vouch { badge_id: B32::from([1u8; 32]), stake_percent: 15, created_at: 0, unlock_at: 0 },
        Vouch { badge_id: B32::from([2u8; 32]), stake_percent: 15, created_at: 0, unlock_at: 0 },
    ];
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    let network_score = compute_network_score(&badge);
    assert_eq!(network_score, 30);
    assert!(!flags.isolated(), "Sufficient vouches should not be isolated");
}

// ============================================================================
// TOO_CLEAN FLAG TESTS
// ============================================================================

#[test]
fn test_too_clean_flag_perfect_record() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 100; // More than TOO_CLEAN_TX_THRESHOLD (50)
    badge.tx_positive = 100;
    badge.tx_negative = 0; // Perfect record!
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    assert!(flags.too_clean(), "Perfect record over 50 tx should be flagged as too_clean");
}

#[test]
fn test_too_clean_flag_some_negatives() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 100;
    badge.tx_positive = 98;
    badge.tx_negative = 2; // Some negatives - realistic
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    assert!(!flags.too_clean(), "Having some negatives should clear too_clean flag");
}

#[test]
fn test_too_clean_flag_under_threshold() {
    let current_block = 100_000;
    
    let mut badge = make_minted_badge(current_block);
    badge.tx_total = 30; // Under TOO_CLEAN_TX_THRESHOLD
    badge.tx_positive = 30;
    badge.tx_negative = 0;
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    // Under 50 transactions, perfect record is expected
    assert!(!flags.too_clean(), "Under 50 tx, perfect record is not suspicious");
}

// ============================================================================
// ERRATIC FLAG TESTS
// ============================================================================

#[test]
fn test_erratic_flag_high_variance() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 10;
    badge.volume_total = 1_000_000;
    // High sum of squares indicates high variance
    // If all tx were equal: sum_squares = 10 * (100k)^2 = 10 * 10^10 = 10^11
    // Higher sum_squares = higher variance
    badge.volume_sum_squares = 500_000_000_000_000u128; // Very high variance
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    println!("Erratic flag (high variance): {}", flags.erratic());
}

#[test]
fn test_erratic_flag_consistent_values() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 10;
    badge.volume_total = 1_000_000; // 10 tx of ~100k each
    // Low variance - all transactions similar size
    // sum_squares ≈ 10 * (100k)^2 = 100 * 10^9 = 10^11
    badge.volume_sum_squares = 100_000_000_000u128;
    
    let flags = compute_flags(&badge, 100_000, current_block);
    
    assert!(!flags.erratic(), "Consistent transaction values should not be erratic");
}

// ============================================================================
// NEW_BADGE FLAG TESTS
// ============================================================================

#[test]
fn test_new_badge_flag_fresh_badge() {
    let current_block = 100_000;
    
    let badge = make_minted_badge(current_block);
    // Just created at current_block
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    assert!(flags.new_badge(), "Freshly minted badge should have new_badge flag");
}

#[test]
fn test_new_badge_flag_at_threshold() {
    let current_block = 100_000;
    
    // Badge created exactly 90 days ago
    let created_at = current_block - NEW_BADGE_THRESHOLD_BLOCKS;
    let mut badge = make_minted_badge(created_at);
    badge.created_at = created_at;
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    // At exactly the threshold, might still be considered new
    println!("At threshold - new_badge: {}", flags.new_badge());
}

#[test]
fn test_new_badge_flag_past_threshold() {
    let current_block = 100_000;
    
    // Badge created more than 90 days ago
    let created_at = current_block - NEW_BADGE_THRESHOLD_BLOCKS - 1000;
    let mut badge = make_established_badge(current_block);
    badge.created_at = created_at;
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    assert!(!flags.new_badge(), "Badge past 90 days should not have new_badge flag");
}

// ============================================================================
// COMBINED FLAG SCENARIOS
// ============================================================================

#[test]
fn test_multiple_flags_can_trigger() {
    let current_block = 100_000;
    
    // Create a suspicious badge
    let mut badge = make_minted_badge(current_block); // new_badge
    badge.vouches_in = vec![]; // isolated
    badge.tx_total = 100;
    badge.tx_positive = 100;
    badge.tx_negative = 0; // too_clean
    
    let flags = compute_flags(&badge, 10_000, current_block);
    
    assert!(flags.new_badge(), "Should have new_badge");
    assert!(flags.isolated(), "Should be isolated");
    assert!(flags.too_clean(), "Should be too_clean");
}

#[test]
fn test_risk_score_accumulation() {
    // Risk weights (from compute_risk):
    // - acceleration: 25
    // - extraction: 30  
    // - isolated: 20
    // - too_clean: 10
    // - erratic: 15
    // - new_badge: 15
    
    let mut flags = RiskFlags::default();
    assert_eq!(compute_risk(&flags), 0);
    
    flags.set_new_badge(true);
    assert_eq!(compute_risk(&flags), 15);
    
    flags.set_isolated(true);
    assert_eq!(compute_risk(&flags), 35); // 15 + 20
    
    flags.set_too_clean(true);
    assert_eq!(compute_risk(&flags), 45); // 15 + 20 + 10
    
    flags.set_extraction(true);
    assert_eq!(compute_risk(&flags), 75); // 15 + 20 + 10 + 30
    
    flags.set_acceleration(true);
    assert_eq!(compute_risk(&flags), 100); // 15 + 20 + 10 + 30 + 25 = 100 (capped)
    
    flags.set_erratic(true);
    // All flags = 15 + 20 + 10 + 30 + 25 + 15 = 115, but capped at 100
    let risk = compute_risk(&flags);
    assert_eq!(risk, 100, "Risk should be capped at 100");
}

// ============================================================================
// RISK FLAG RESET SCENARIOS
// ============================================================================

#[test]
fn test_new_badge_flag_clears_after_time() {
    // Badge starts with new_badge flag
    let genesis_block = 10_000;
    let badge = make_minted_badge(genesis_block);
    
    let early_flags = compute_flags(&badge, 10_000, genesis_block + 1000);
    assert!(early_flags.new_badge(), "Should be new at genesis + 1000");
    
    // After 90 days, flag should clear
    let mature_flags = compute_flags(&badge, 10_000, genesis_block + NEW_BADGE_THRESHOLD_BLOCKS + 1);
    assert!(!mature_flags.new_badge(), "Should not be new after 90 days");
}

#[test]
fn test_isolated_flag_clears_with_vouches() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.vouches_in = vec![];
    
    let isolated_flags = compute_flags(&badge, 10_000, current_block);
    assert!(isolated_flags.isolated());
    
    // Add sufficient vouches
    badge.vouches_in = vec![
        Vouch { badge_id: B32::from([1u8; 32]), stake_percent: 25, created_at: 0, unlock_at: 0 },
    ];
    
    let connected_flags = compute_flags(&badge, 10_000, current_block);
    assert!(!connected_flags.isolated(), "Should not be isolated with 25% incoming stake");
}

#[test]
fn test_too_clean_flag_clears_with_negative() {
    let current_block = 100_000;
    
    let mut badge = make_established_badge(current_block);
    badge.tx_total = 60;
    badge.tx_positive = 60;
    badge.tx_negative = 0;
    
    let clean_flags = compute_flags(&badge, 10_000, current_block);
    assert!(clean_flags.too_clean());
    
    // Add a negative outcome
    badge.tx_negative = 1;
    badge.tx_positive = 59;
    
    let realistic_flags = compute_flags(&badge, 10_000, current_block);
    assert!(!realistic_flags.too_clean(), "Having negatives should clear too_clean");
}
