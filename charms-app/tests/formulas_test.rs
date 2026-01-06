//! Unit tests for Veil Protocol formulas
//!
//! Tests for trust computation, risk flags, and cascade damage.

mod common;

use veil::*;

fn make_test_badge() -> VeilBadge {
    VeilBadge {
        id: B32::from([1u8; 32]),
        created_at: 0,
        pubkey: [2u8; 33],
        tx_total: 100,
        tx_positive: 95,
        tx_negative: 5,
        volume_total: 10_000_000, // 0.1 BTC total
        volume_sum_squares: 1_000_000_000_000, // For variance calc
        window_tx_count: 10,
        window_volume: 1_000_000,
        window_start: 14400, // Day 100
        counterparty_count: 50,
        backing: BackingAggregates::default(),
        vouches_out: vec![],
        vouches_in: vec![
            Vouch {
                badge_id: B32::from([3u8; 32]),
                stake_percent: 20,
                created_at: 1000,
                unlock_at: 2000,
            },
        ],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        trust: 0,
        risk: 0,
        flags: RiskFlags::default(),
        last_nonce: B32::zero(),
        last_update: 14400,
    }
}

#[test]
fn test_compute_trust_new_badge() {
    let badge = VeilBadge::default();
    let trust = compute_trust(&badge, 100);
    
    // New badge with no history should have ~15 trust (neutral)
    // But age factor reduces it significantly
    assert!(trust > 0);
    assert!(trust <= 15);
}

#[test]
fn test_compute_trust_established_badge() {
    let badge = make_test_badge();
    let trust = compute_trust(&badge, 50000);
    
    // Established badge with good history should have high trust
    // H = (95 - 25) / 100 * 100 = 70
    // A = ~1.0 (old enough)
    // N = 0.20 * 10 = 2
    // D = 0
    // Trust ≈ 70 * 1.0 + 2 = 72
    assert!(trust >= 60);
    assert!(trust <= 100);
}

#[test]
fn test_compute_flags_new_badge() {
    let mut badge = VeilBadge::default();
    badge.created_at = 1000;
    
    let flags = compute_flags(&badge, 100000, 2000);
    
    assert!(flags.new_badge());
    assert!(flags.isolated()); // No vouchers
}

#[test]
fn test_compute_flags_acceleration() {
    let mut badge = make_test_badge();
    badge.window_tx_count = 50; // 50 tx in recent window vs 100 total
    badge.window_start = 14000; // Recent window is small
    
    let flags = compute_flags(&badge, 100000, 14500);
    
    // Recent velocity should be much higher than historical
    assert!(flags.acceleration());
}

#[test]
fn test_compute_flags_extraction() {
    let badge = make_test_badge();
    // Average is 100,000 sats, propose 2,000,000 (20x)
    let flags = compute_flags(&badge, 2_000_000, 15000);
    
    assert!(flags.extraction());
}

#[test]
fn test_compute_flags_too_clean() {
    let mut badge = make_test_badge();
    badge.tx_negative = 0;
    
    let flags = compute_flags(&badge, 100000, 15000);
    
    assert!(flags.too_clean());
}

#[test]
fn test_compute_risk_maximum() {
    let flags = RiskFlags::ACCELERATION 
        | RiskFlags::EXTRACTION 
        | RiskFlags::ISOLATED 
        | RiskFlags::TOO_CLEAN 
        | RiskFlags::ERRATIC 
        | RiskFlags::NEW_BADGE;
    
    let risk = compute_risk(&flags);
    
    // 25 + 30 + 20 + 10 + 15 + 15 = 115, clamped to 100
    assert_eq!(risk, 100);
}

#[test]
fn test_cascade_damage() {
    assert_eq!(calculate_cascade_damage(&Severity::Minor, 100), 5);
    assert_eq!(calculate_cascade_damage(&Severity::Major, 50), 7);  // 15 * 50 / 100 = 7
    assert_eq!(calculate_cascade_damage(&Severity::Severe, 20), 10); // 50 * 20 / 100 = 10
}

#[test]
fn test_window_expiration() {
    let mut badge = VeilBadge::default();
    badge.window_start = 1000;
    
    // Within window
    assert!(!window_expired(&badge, 1000 + WINDOW_SIZE_BLOCKS - 1));
    
    // At expiration
    assert!(!window_expired(&badge, 1000 + WINDOW_SIZE_BLOCKS));
    
    // Past expiration
    assert!(window_expired(&badge, 1000 + WINDOW_SIZE_BLOCKS + 1));
}

#[test]
fn test_update_window_active() {
    let mut badge = VeilBadge::default();
    badge.window_start = 1000;
    badge.window_tx_count = 5;
    badge.window_volume = 50000;
    
    let (count, volume, start) = update_window(&badge, 10000, 2000);
    
    assert_eq!(count, 6);
    assert_eq!(volume, 60000);
    assert_eq!(start, 1000);
}

#[test]
fn test_update_window_expired() {
    let mut badge = VeilBadge::default();
    badge.window_start = 0;
    badge.window_tx_count = 100;
    badge.window_volume = 1000000;
    
    // Window has expired
    let new_block = WINDOW_SIZE_BLOCKS + 100;
    let (count, volume, start) = update_window(&badge, 10000, new_block);
    
    // Should reset
    assert_eq!(count, 1);
    assert_eq!(volume, 10000);
    assert_eq!(start, new_block);
}
