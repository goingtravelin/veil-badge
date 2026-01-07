//! Vouch Network Tests
//!
//! Tests for vouch relationships including:
//! - ReceiveVouch and LoseVouch actions
//! - Multi-vouch scenarios
//! - Chain cascades
//! - Vouch capacity management

mod common;

use veil::*;
use common::*;

// ============================================================================
// RECEIVE VOUCH TESTS
// ============================================================================

#[test]
fn test_receive_vouch_success() {
    let current_block = 100_000;
    let mut old_badge = make_established_badge(current_block);
    
    // Ensure old_badge trust is consistent with formula
    old_badge.trust = compute_trust(&old_badge, current_block);
    old_badge.flags = compute_flags(&old_badge, 0, current_block);
    old_badge.risk = compute_risk(&old_badge.flags);
    
    let voucher_id = make_voucher_badge_id();
    let stake_percent = 25u8;
    let vouch_created_at = current_block - 100;
    let vouch_unlock_at = vouch_created_at + MIN_VOUCH_LOCK_BLOCKS;
    
    // Create new badge with incoming vouch added
    let mut new_badge = old_badge.clone();
    new_badge.vouches_in.push(Vouch {
        badge_id: voucher_id,
        stake_percent,
        created_at: vouch_created_at,
        unlock_at: vouch_unlock_at,
    });
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, 0, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);
    
    assert!(validate_receive_vouch(
        &old_badge,
        &new_badge,
        voucher_id,
        stake_percent,
        vouch_created_at,
        vouch_unlock_at,
        current_block,
    ));
}

#[test]
fn test_receive_vouch_duplicate_rejected() {
    let current_block = 100_000;
    let mut old_badge = make_established_badge(current_block);
    
    let voucher_id = make_voucher_badge_id();
    
    // Already has this incoming vouch
    old_badge.vouches_in.push(Vouch {
        badge_id: voucher_id,
        stake_percent: 10,
        created_at: current_block - 1000,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    // Try to add another vouch from same voucher
    let mut new_badge = old_badge.clone();
    new_badge.vouches_in.push(Vouch {
        badge_id: voucher_id, // Same voucher!
        stake_percent: 20,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    assert!(!validate_receive_vouch(
        &old_badge,
        &new_badge,
        voucher_id,
        20,
        current_block,
        current_block + MIN_VOUCH_LOCK_BLOCKS,
        current_block,
    ));
}

#[test]
fn test_receive_vouch_increases_trust() {
    let current_block = 100_000;
    let mut old_badge = make_established_badge(current_block);
    
    // Ensure old_badge is consistent with formula
    old_badge.trust = compute_trust(&old_badge, current_block);
    let old_trust = old_badge.trust;
    
    let voucher_id = make_voucher_badge_id();
    
    let mut new_badge = old_badge.clone();
    new_badge.vouches_in.push(Vouch {
        badge_id: voucher_id,
        stake_percent: 50, // Significant stake
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, 0, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);
    
    // Trust should increase (network bonus)
    assert!(new_badge.trust >= old_trust, 
        "Trust should increase or stay same with incoming vouch: old={}, new={}", old_trust, new_badge.trust);
}

// ============================================================================
// LOSE VOUCH TESTS
// ============================================================================

#[test]
fn test_lose_vouch_success() {
    let current_block = 100_000;
    let mut old_badge = make_established_badge(current_block);
    
    let voucher_id = make_voucher_badge_id();
    
    // Has an incoming vouch
    old_badge.vouches_in.push(Vouch {
        badge_id: voucher_id,
        stake_percent: 25,
        created_at: current_block - 5000,
        unlock_at: current_block - 1000, // Timelock expired
    });
    
    // Remove the vouch
    let mut new_badge = old_badge.clone();
    new_badge.vouches_in.retain(|v| v.badge_id != voucher_id);
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, 0, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);
    
    assert!(validate_lose_vouch(
        &old_badge,
        &new_badge,
        voucher_id,
        current_block,
    ));
}

#[test]
fn test_lose_vouch_nonexistent_rejected() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    
    let voucher_id = make_voucher_badge_id();
    // Note: old_badge has no incoming vouches
    
    let new_badge = old_badge.clone();
    
    // Can't lose a vouch that doesn't exist
    assert!(!validate_lose_vouch(
        &old_badge,
        &new_badge,
        voucher_id,
        current_block,
    ));
}

// ============================================================================
// MULTI-VOUCH SCENARIOS
// ============================================================================

#[test]
fn test_badge_vouching_for_multiple_targets() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    badge.trust = 70; // High trust to vouch
    
    // Ensure badge is consistent with formula
    badge.trust = compute_trust(&badge, current_block);
    badge.flags = compute_flags(&badge, 0, current_block);
    badge.risk = compute_risk(&badge.flags);
    
    // Vouch for 3 different targets
    let targets = [
        (B32::from([1u8; 32]), 30u8),
        (B32::from([2u8; 32]), 25u8),
        (B32::from([3u8; 32]), 20u8),
    ];
    
    for (i, (target_id, stake)) in targets.iter().enumerate() {
        let old_badge = badge.clone();
        
        badge.vouches_out.push(Vouch {
            badge_id: *target_id,
            stake_percent: *stake,
            created_at: current_block,
            unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
        });
        badge.last_update = current_block;
        // Recompute derived values
        badge.trust = compute_trust(&badge, current_block);
        badge.flags = compute_flags(&badge, 0, current_block);
        badge.risk = compute_risk(&badge.flags);
        
        let witness = VouchWitness {
            target_current_trust: 50,
        };
        
        assert!(validate_vouch(
            &old_badge,
            &badge,
            *target_id,
            *stake,
            MIN_VOUCH_LOCK_BLOCKS,
            current_block,
            &witness,
        ), "Vouch {} should succeed", i + 1);
    }
    
    // Total stake: 30 + 25 + 20 = 75%
    assert_eq!(badge.vouches_out.len(), 3);
    let total_stake: u8 = badge.vouches_out.iter().map(|v| v.stake_percent).sum();
    assert_eq!(total_stake, 75);
    assert_eq!(remaining_vouch_capacity(&badge), 25);
}

#[test]
fn test_multiple_badges_vouch_for_same_target() {
    let current_block = 100_000;
    let mut target = make_established_badge(current_block);
    
    // Ensure target is consistent with formula
    target.trust = compute_trust(&target, current_block);
    target.flags = compute_flags(&target, 0, current_block);
    target.risk = compute_risk(&target.flags);
    
    // 3 different badges vouch for target
    let vouchers = [
        (B32::from([1u8; 32]), 20u8),
        (B32::from([2u8; 32]), 30u8),
        (B32::from([3u8; 32]), 15u8),
    ];
    
    for (voucher_id, stake) in vouchers.iter() {
        let old_target = target.clone();
        
        target.vouches_in.push(Vouch {
            badge_id: *voucher_id,
            stake_percent: *stake,
            created_at: current_block,
            unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
        });
        target.trust = compute_trust(&target, current_block);
        target.flags = compute_flags(&target, 0, current_block);
        target.risk = compute_risk(&target.flags);
        
        assert!(validate_receive_vouch(
            &old_target,
            &target,
            *voucher_id,
            *stake,
            current_block,
            current_block + MIN_VOUCH_LOCK_BLOCKS,
            current_block,
        ));
    }
    
    assert_eq!(target.vouches_in.len(), 3);
    
    // Network score should be sum of stakes
    let network_score = compute_network_score(&target);
    assert_eq!(network_score, 65); // 20 + 30 + 15
    
    // Should not be isolated
    assert!(!target.flags.isolated());
}

// ============================================================================
// CHAIN CASCADE TESTS
// ============================================================================

#[test]
fn test_chain_cascade_a_vouches_b_vouches_c() {
    // Setup: A vouches for B, B vouches for C
    // When C fails, damage cascades: C -> B -> A
    
    let current_block = 100_000;
    
    // Create badges
    let (_, pk_a) = make_keypair(0x11);
    let (_, pk_b) = make_keypair(0x22);
    let (_, pk_c) = make_keypair(0x33);
    
    let mut badge_a = make_badge_with_pubkey(current_block, pk_a, 0xAA);
    let mut badge_b = make_badge_with_pubkey(current_block, pk_b, 0xBB);
    let mut badge_c = make_badge_with_pubkey(current_block, pk_c, 0xCC);
    
    badge_a.trust = 70;
    badge_b.trust = 60;
    badge_c.trust = 50;
    
    // A vouches for B (30% stake)
    badge_a.vouches_out.push(Vouch {
        badge_id: badge_b.id,
        stake_percent: 30,
        created_at: current_block - 1000,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    badge_b.vouches_in.push(Vouch {
        badge_id: badge_a.id,
        stake_percent: 30,
        created_at: current_block - 1000,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    // B vouches for C (40% stake)
    badge_b.vouches_out.push(Vouch {
        badge_id: badge_c.id,
        stake_percent: 40,
        created_at: current_block - 500,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    badge_c.vouches_in.push(Vouch {
        badge_id: badge_b.id,
        stake_percent: 40,
        created_at: current_block - 500,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    
    println!("Initial state:");
    println!("  A trust: {}, vouches_out to B: 30%", badge_a.trust);
    println!("  B trust: {}, vouches_out to C: 40%", badge_b.trust);
    println!("  C trust: {}", badge_c.trust);
    
    // C has a SEVERE negative outcome
    let severity = Severity::Severe;
    
    // Step 1: C's failure cascades to B
    let damage_to_b = calculate_cascade_damage(&severity, 40); // 50 * 40 / 100 = 20
    assert_eq!(damage_to_b, 20);
    
    badge_b.cascade_damage += damage_to_b;
    badge_b.trust = compute_trust(&badge_b, current_block);
    
    println!("\nAfter C's failure:");
    println!("  B cascade_damage: {}", badge_b.cascade_damage);
    println!("  B trust: {}", badge_b.trust);
    
    // Step 2: B's damage could cascade to A if B also fails
    // (In practice, cascade only triggers on negative outcomes, not just damage)
    // But let's show what WOULD happen if B then failed:
    let hypothetical_damage_to_a = calculate_cascade_damage(&Severity::Major, 30); // 15 * 30 / 100 = 4
    assert_eq!(hypothetical_damage_to_a, 4);
    
    println!("\nIf B later fails (Major severity):");
    println!("  Damage to A would be: {}", hypothetical_damage_to_a);
}

#[test]
fn test_cascade_damage_calculation_all_severities() {
    // Minor: 5 damage base
    assert_eq!(calculate_cascade_damage(&Severity::Minor, 100), 5);  // 5 * 100 / 100
    assert_eq!(calculate_cascade_damage(&Severity::Minor, 50), 2);   // 5 * 50 / 100 = 2.5 -> 2
    assert_eq!(calculate_cascade_damage(&Severity::Minor, 10), 0);   // 5 * 10 / 100 = 0.5 -> 0
    
    // Major: 15 damage base
    assert_eq!(calculate_cascade_damage(&Severity::Major, 100), 15);
    assert_eq!(calculate_cascade_damage(&Severity::Major, 50), 7);   // 15 * 50 / 100 = 7.5 -> 7
    assert_eq!(calculate_cascade_damage(&Severity::Major, 20), 3);   // 15 * 20 / 100 = 3
    
    // Severe: 50 damage base
    assert_eq!(calculate_cascade_damage(&Severity::Severe, 100), 50);
    assert_eq!(calculate_cascade_damage(&Severity::Severe, 50), 25);
    assert_eq!(calculate_cascade_damage(&Severity::Severe, 25), 12); // 50 * 25 / 100 = 12.5 -> 12
}

// ============================================================================
// VOUCH AT CAPACITY TESTS
// ============================================================================

#[test]
fn test_vouch_at_exactly_100_percent() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    badge.trust = 70;
    
    // Already at 90%
    badge.vouches_out = vec![
        Vouch { badge_id: B32::from([1u8; 32]), stake_percent: 50, created_at: 0, unlock_at: current_block + 10000 },
        Vouch { badge_id: B32::from([2u8; 32]), stake_percent: 40, created_at: 0, unlock_at: current_block + 10000 },
    ];
    
    // Ensure badge is consistent with formula after setting vouches
    badge.trust = compute_trust(&badge, current_block);
    badge.flags = compute_flags(&badge, 0, current_block);
    badge.risk = compute_risk(&badge.flags);
    
    assert_eq!(remaining_vouch_capacity(&badge), 10);
    
    // Vouch exactly 10% more (should succeed)
    let old_badge = badge.clone();
    let target_id = B32::from([3u8; 32]);
    badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 10,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    badge.last_update = current_block;
    // Recompute derived values after adding vouch
    badge.trust = compute_trust(&badge, current_block);
    badge.flags = compute_flags(&badge, 0, current_block);
    badge.risk = compute_risk(&badge.flags);
    
    let witness = VouchWitness { target_current_trust: 50 };
    
    assert!(validate_vouch(
        &old_badge,
        &badge,
        target_id,
        10,
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
    
    assert_eq!(remaining_vouch_capacity(&badge), 0);
}

#[test]
fn test_vouch_over_100_percent_rejected() {
    let current_block = 100_000;
    let mut badge = make_established_badge(current_block);
    badge.trust = 70;
    
    // At 95%
    badge.vouches_out = vec![
        Vouch { badge_id: B32::from([1u8; 32]), stake_percent: 95, created_at: 0, unlock_at: current_block + 10000 },
    ];
    
    // Try to add 10% more (would be 105%)
    let old_badge = badge.clone();
    let target_id = B32::from([2u8; 32]);
    badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 10,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    badge.last_update = current_block;
    
    let witness = VouchWitness { target_current_trust: 50 };
    
    assert!(!validate_vouch(
        &old_badge,
        &badge,
        target_id,
        10,
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
}

// ============================================================================
// VOUCH ELIGIBILITY TESTS
// ============================================================================

#[test]
fn test_can_vouch_trust_threshold() {
    let current_block = 100_000;
    
    let mut low_trust = make_minted_badge(current_block);
    low_trust.trust = 20;
    assert!(!can_vouch(&low_trust), "Trust 20 should not be able to vouch");
    
    let mut at_threshold = make_minted_badge(current_block);
    at_threshold.trust = 30; // MIN_TRUST_TO_VOUCH
    assert!(can_vouch(&at_threshold), "Trust 30 should be able to vouch");
    
    let mut high_trust = make_minted_badge(current_block);
    high_trust.trust = 80;
    assert!(can_vouch(&high_trust), "Trust 80 should be able to vouch");
}

#[test]
fn test_can_receive_vouch_trust_threshold() {
    let current_block = 100_000;
    
    let mut low_trust = make_minted_badge(current_block);
    low_trust.trust = 10;
    assert!(!can_receive_vouch(&low_trust), "Trust 10 should not receive vouches");
    
    let mut at_threshold = make_minted_badge(current_block);
    at_threshold.trust = 20; // MIN_TRUST_TO_RECEIVE_VOUCH
    assert!(can_receive_vouch(&at_threshold), "Trust 20 should receive vouches");
}

#[test]
fn test_vouch_target_too_low_trust_rejected() {
    let current_block = 100_000;
    let old_badge = make_established_badge(current_block);
    
    let target_id = make_target_badge_id();
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: target_id,
        stake_percent: 10,
        created_at: current_block,
        unlock_at: current_block + MIN_VOUCH_LOCK_BLOCKS,
    });
    new_badge.last_update = current_block;
    
    // Target has low trust (below MIN_TRUST_TO_RECEIVE_VOUCH)
    let witness = VouchWitness {
        target_current_trust: 10, // Too low!
    };
    
    assert!(!validate_vouch(
        &old_badge,
        &new_badge,
        target_id,
        10,
        MIN_VOUCH_LOCK_BLOCKS,
        current_block,
        &witness,
    ));
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

fn make_badge_with_pubkey(current_block: u64, pubkey: PubKey, genesis_byte: u8) -> VeilBadge {
    let genesis = [genesis_byte; 32];
    VeilBadge {
        schema_version: SCHEMA_VERSION,
        id: compute_badge_id(&genesis),
        created_at: current_block - NEW_BADGE_THRESHOLD_BLOCKS - 1000,
        pubkey,
        tx_total: 20,
        tx_positive: 19,
        tx_negative: 1,
        volume_total: 500_000,
        volume_sum_squares: 500_000u128 * 500_000u128 / 20,
        window_tx_count: 5,
        window_volume: 100_000,
        window_start: current_block - WINDOW_SIZE_BLOCKS + 1000,
        counterparty_count: 15,
        backing: BackingAggregates::default(),
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        trust: 65,
        risk: 15,
        flags: RiskFlags::default(),
        last_nonce: B32::zero(),
        last_update: current_block - 100,
    }
}
