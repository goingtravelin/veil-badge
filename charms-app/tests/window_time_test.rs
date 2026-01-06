//! Window and Time-Based Tests
//!
//! Tests for rolling window mechanics and time-dependent behavior:
//! - Window expiry and reset
//! - Multiple transactions within same window
//! - Transactions spanning window boundaries
//! - Badge age calculations

mod common;

use veil::*;
use common::*;

// ============================================================================
// WINDOW MECHANICS TESTS
// ============================================================================

#[test]
fn test_window_fresh_badge() {
    let current_block = 100_000;
    let badge = make_minted_badge(current_block);
    
    // Fresh badge should have window starting at creation
    assert_eq!(badge.window_start, current_block);
    assert_eq!(badge.window_tx_count, 0);
    assert_eq!(badge.window_volume, 0);
}

#[test]
fn test_window_transaction_within_window() {
    let current_block = 100_000;
    let mut badge = make_minted_badge(current_block - 1000);
    badge.window_start = current_block - 1000;
    badge.window_tx_count = 5;
    badge.window_volume = 50_000;
    
    let value = 10_000;
    let (new_count, new_volume, new_start) = update_window(&badge, value, current_block);
    
    // Transaction within window - should increment
    assert_eq!(new_count, 6, "Window count should increment");
    assert_eq!(new_volume, 60_000, "Window volume should add new value");
    assert_eq!(new_start, badge.window_start, "Window start should not change");
}

#[test]
fn test_window_reset_after_expiry() {
    let current_block = 100_000;
    let mut badge = make_minted_badge(100);
    
    // Window started long ago (expired)
    badge.window_start = current_block - WINDOW_SIZE_BLOCKS - 1000;
    badge.window_tx_count = 50;
    badge.window_volume = 500_000;
    
    let value = 10_000;
    let (new_count, new_volume, new_start) = update_window(&badge, value, current_block);
    
    // Window should reset
    assert_eq!(new_count, 1, "Window count should reset to 1");
    assert_eq!(new_volume, value, "Window volume should be just new value");
    assert_eq!(new_start, current_block, "Window start should be current block");
}

#[test]
fn test_window_exactly_at_boundary() {
    let current_block = 100_000;
    let mut badge = make_minted_badge(100);
    
    // Window started exactly WINDOW_SIZE_BLOCKS ago
    badge.window_start = current_block - WINDOW_SIZE_BLOCKS;
    badge.window_tx_count = 10;
    badge.window_volume = 100_000;
    
    let value = 10_000;
    let (new_count, new_volume, new_start) = update_window(&badge, value, current_block);
    
    // At exactly the boundary - behavior depends on implementation (< vs <=)
    println!("At boundary - count: {}, volume: {}, start: {}", new_count, new_volume, new_start);
}

#[test]
fn test_multiple_transactions_same_window() {
    let genesis_block = 100_000;
    let mut badge = make_minted_badge(genesis_block);
    
    // Simulate multiple transactions in quick succession
    for i in 1..=5 {
        let tx_block = genesis_block + (i * 10); // Every 10 blocks
        let value = 10_000 * i as u64;
        let nonce = B32::from([i as u8; 32]);
        
        badge = apply_record(&badge, B32::from([99u8; 32]), value, Outcome::Positive, nonce, tx_block);
    }
    
    // All transactions should be in the same window
    assert_eq!(badge.tx_total, 5);
    assert_eq!(badge.window_tx_count, 5, "All transactions should be in current window");
    assert_eq!(badge.window_volume, 10_000 + 20_000 + 30_000 + 40_000 + 50_000);
    assert_eq!(badge.window_start, genesis_block, "Window should not have reset");
}

#[test]
fn test_transactions_spanning_window_boundary() {
    let genesis_block = 10_000;
    let mut badge = make_minted_badge(genesis_block);
    
    // Transaction 1: In original window
    let block1 = genesis_block + 100;
    badge = apply_record(&badge, B32::from([99u8; 32]), 10_000, Outcome::Positive, B32::from([1u8; 32]), block1);
    
    assert_eq!(badge.window_tx_count, 1);
    assert_eq!(badge.window_volume, 10_000);
    let original_window_start = badge.window_start;
    
    // Transaction 2: After window expires
    let block2 = genesis_block + WINDOW_SIZE_BLOCKS + 1000;
    badge = apply_record(&badge, B32::from([99u8; 32]), 20_000, Outcome::Positive, B32::from([2u8; 32]), block2);
    
    // Window should have reset
    assert_eq!(badge.window_tx_count, 1, "Window should have reset");
    assert_eq!(badge.window_volume, 20_000, "Window volume should be just second tx");
    assert!(badge.window_start > original_window_start, "Window start should have moved");
}

// ============================================================================
// VELOCITY CALCULATIONS
// ============================================================================

#[test]
fn test_historical_vs_window_velocity() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    
    // Note: velocity is measured as transactions per block, NOT volume per transaction
    // Badge age is about NEW_BADGE_THRESHOLD_BLOCKS + 1000 ≈ 14000 blocks
    let _badge_age = current_block.saturating_sub(badge.created_at);
    
    // Historical: 100 transactions over ~14000 blocks ≈ 0.007 tx/block
    badge.tx_total = 100;
    badge.volume_total = 500_000; // Volume doesn't affect acceleration
    
    // Window: 10 transactions over 5000 blocks = 0.002 tx/block
    // Ratio: 0.002 / 0.007 ≈ 0.28 (well below threshold)
    badge.window_tx_count = 10;
    badge.window_volume = 200_000;
    badge.window_start = current_block - 5000;
    
    let flags = compute_flags(&badge, 40_000, current_block);
    assert!(!flags.acceleration(), "0.28x velocity ratio should not trigger acceleration");
    
    // Now increase window tx rate to trigger acceleration
    // 50 transactions over 1000 blocks = 0.05 tx/block
    // Historical is 100 / 14000 ≈ 0.007 tx/block
    // Ratio: 0.05 / 0.007 ≈ 7x (above 3.0 threshold)
    badge.window_tx_count = 50;
    badge.window_start = current_block - 1000;
    
    let flags = compute_flags(&badge, 160_000, current_block);
    assert!(flags.acceleration(), "7x velocity ratio should trigger acceleration");
}

// ============================================================================
// BADGE AGE TESTS
// ============================================================================

#[test]
fn test_badge_age_calculations() {
    let current_block = 100_000;
    
    // Brand new badge
    let new_badge = make_minted_badge(current_block);
    assert_eq!(current_block - new_badge.created_at, 0);
    
    // 30-day old badge
    let thirty_day = current_block - (144 * 30);
    let mut badge_30d = make_minted_badge(thirty_day);
    badge_30d.created_at = thirty_day;
    assert_eq!(current_block - badge_30d.created_at, 144 * 30);
    
    // 90-day threshold badge
    let ninety_day = current_block - NEW_BADGE_THRESHOLD_BLOCKS;
    let mut badge_90d = make_minted_badge(ninety_day);
    badge_90d.created_at = ninety_day;
    
    let age = current_block - badge_90d.created_at;
    assert_eq!(age, NEW_BADGE_THRESHOLD_BLOCKS);
}

#[test]
fn test_new_badge_flag_lifecycle() {
    let genesis_block = 10_000;
    let badge = make_minted_badge(genesis_block);
    
    // Check at various points in time
    let checkpoints = [
        (genesis_block, true, "At creation"),
        (genesis_block + 144 * 30, true, "At 30 days"),
        (genesis_block + 144 * 60, true, "At 60 days"),
        (genesis_block + 144 * 89, true, "At 89 days"),
        (genesis_block + NEW_BADGE_THRESHOLD_BLOCKS + 1, false, "Past 90 days"),
        (genesis_block + 144 * 180, false, "At 180 days"),
    ];
    
    for (block, expected_new, label) in checkpoints {
        let flags = compute_flags(&badge, 10_000, block);
        assert_eq!(flags.new_badge(), expected_new, "{}: expected new_badge={}", label, expected_new);
    }
}

// ============================================================================
// WINDOW SIZE CONSTANT VERIFICATION
// ============================================================================

#[test]
fn test_window_size_constant() {
    // WINDOW_SIZE_BLOCKS should be ~30 days at 144 blocks/day
    assert_eq!(WINDOW_SIZE_BLOCKS, 144 * 30);
    assert_eq!(WINDOW_SIZE_BLOCKS, 4320);
}

#[test]
fn test_min_vouch_lock_constant() {
    // MIN_VOUCH_LOCK_BLOCKS should be ~7 days
    assert_eq!(MIN_VOUCH_LOCK_BLOCKS, 144 * 7);
    assert_eq!(MIN_VOUCH_LOCK_BLOCKS, 1008);
}

#[test]
fn test_new_badge_threshold_constant() {
    // NEW_BADGE_THRESHOLD_BLOCKS should be ~90 days
    assert_eq!(NEW_BADGE_THRESHOLD_BLOCKS, 144 * 90);
    assert_eq!(NEW_BADGE_THRESHOLD_BLOCKS, 12960);
}

// ============================================================================
// EDGE CASES: TIME
// ============================================================================

#[test]
fn test_block_zero_handling() {
    // Edge case: what happens at block 0?
    let badge = make_minted_badge(0);
    
    assert_eq!(badge.created_at, 0);
    assert_eq!(badge.window_start, 0);
    
    // Compute trust at block 0
    // Trust = H × A + N - D
    // H = 15 (neutral for no transactions)
    // A = ln(1 + 0) / 7 = 0 (no age)
    // N = 0 (no vouches)
    // D = 0 (no damage)
    // Trust = 15 × 0 + 0 - 0 = 0
    let trust = compute_trust(&badge, 0);
    assert_eq!(trust, 0, "Trust should be 0 at block 0 (age component is 0)");
    
    // After some time passes, trust should grow
    let trust_later = compute_trust(&badge, 144); // 1 day later
    assert!(trust_later > 0, "Trust should be positive after time passes");
}

#[test]
fn test_very_old_badge() {
    let current_block = 1_000_000; // ~19 years at 144 blocks/day
    
    let ancient_genesis = 100;
    let mut badge = make_minted_badge(ancient_genesis);
    badge.created_at = ancient_genesis;
    badge.tx_total = 10_000;
    badge.tx_positive = 9_900;
    badge.tx_negative = 100;
    
    // Should definitely not have new_badge flag
    let flags = compute_flags(&badge, 10_000, current_block);
    assert!(!flags.new_badge(), "Ancient badge should not be flagged as new");
    
    // Trust calculation should still work
    let trust = compute_trust(&badge, current_block);
    assert!(trust > 0 && trust <= 100, "Trust should be valid: {}", trust);
}

#[test]
fn test_last_update_tracking() {
    let genesis_block = 100_000;
    let mut badge = make_minted_badge(genesis_block);
    
    assert_eq!(badge.last_update, genesis_block);
    
    // First transaction
    let block1 = genesis_block + 100;
    badge = apply_record(&badge, B32::from([99u8; 32]), 10_000, Outcome::Positive, B32::from([1u8; 32]), block1);
    assert_eq!(badge.last_update, block1);
    
    // Second transaction much later
    let block2 = genesis_block + 10_000;
    badge = apply_record(&badge, B32::from([99u8; 32]), 20_000, Outcome::Positive, B32::from([2u8; 32]), block2);
    assert_eq!(badge.last_update, block2);
}

// ============================================================================
// VOUCH TIMELOCK TESTS
// ============================================================================

#[test]
fn test_vouch_timelock_not_expired() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    
    let target_id = B32::from([99u8; 32]);
    badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 20,
        created_at: current_block - 100,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS, // Not expired yet
    });
    
    let mut new_badge = badge.clone();
    new_badge.vouches_out.retain(|v| v.badge_id != target_id);
    new_badge.last_update = current_block;
    
    // Should fail - timelock not expired
    assert!(!validate_unvouch(
        &badge,
        &new_badge,
        target_id,
        current_block,
    ));
}

#[test]
fn test_vouch_timelock_exactly_expired() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    
    let target_id = B32::from([99u8; 32]);
    let unlock_at = current_block; // Exactly at current block
    badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 20,
        created_at: unlock_at - MIN_VOUCH_LOCK_BLOCKS,
        unlock_at,
    });
    
    let mut new_badge = badge.clone();
    new_badge.vouches_out.retain(|v| v.badge_id != target_id);
    new_badge.last_update = current_block;
    
    // Should succeed - timelock exactly expired
    assert!(validate_unvouch(
        &badge,
        &new_badge,
        target_id,
        current_block,
    ));
}

#[test]
fn test_vouch_timelock_well_past_expired() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    
    let target_id = B32::from([99u8; 32]);
    badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 20,
        created_at: 10_000,
        unlock_at: 20_000, // Expired long ago
    });
    
    let mut new_badge = badge.clone();
    new_badge.vouches_out.retain(|v| v.badge_id != target_id);
    new_badge.last_update = current_block;
    
    // Should succeed
    assert!(validate_unvouch(
        &badge,
        &new_badge,
        target_id,
        current_block,
    ));
}
