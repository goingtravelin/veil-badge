//! Integration tests for Veil Protocol
//!
//! Full lifecycle tests that exercise multiple components together.

mod common;

use veil::*;
use common::*;
use charms_sdk::data::Transaction;
use std::collections::BTreeMap;

// ============================================================================
// BADGE LIFECYCLE TESTS
// ============================================================================

#[test]
fn test_full_badge_lifecycle() {
    let current_block = 1000;
    
    // 1. Mint a new badge
    let badge = make_minted_badge(current_block);
    assert_eq!(badge.trust, 15);
    assert_eq!(badge.tx_total, 0);
    
    // 2. Simulate recording a transaction
    let mut updated_badge = badge.clone();
    updated_badge.tx_total = 1;
    updated_badge.tx_positive = 1;
    updated_badge.volume_total = 100000;
    updated_badge.volume_sum_squares = 100000u128 * 100000u128;
    updated_badge.window_tx_count = 1;
    updated_badge.window_volume = 100000;
    updated_badge.last_nonce = B32::from([1u8; 32]);
    updated_badge.last_update = current_block + 100;
    
    // Recompute derived scores
    updated_badge.trust = compute_trust(&updated_badge, current_block + 100);
    updated_badge.flags = compute_flags(&updated_badge, 100000, current_block + 100);
    updated_badge.risk = compute_risk(&updated_badge.flags);
    
    // Verify the badge evolved correctly
    assert_eq!(updated_badge.tx_total, 1);
    assert!(updated_badge.trust > 0);
    
    // 3. Simulate more transactions to build reputation
    for i in 2..=20 {
        updated_badge.tx_total = i;
        updated_badge.tx_positive = i;
        updated_badge.volume_total = 100000 * i;
        updated_badge.volume_sum_squares = 100000u128 * 100000u128 * i as u128;
    }
    
    updated_badge.trust = compute_trust(&updated_badge, current_block + 10000);
    
    // With 20 positive transactions, trust should be high
    println!("Trust after 20 transactions: {}", updated_badge.trust);
    assert!(updated_badge.trust > 15);
}

#[test]
fn test_risk_detection_extraction() {
    let mut badge = make_minted_badge(1000);
    
    // Build up history with small transactions
    badge.tx_total = 50;
    badge.tx_positive = 50;
    badge.volume_total = 500000; // 50 tx averaging 10k sats
    badge.volume_sum_squares = 50 * 10000u128 * 10000u128;
    
    // Now try a large extraction
    let flags = compute_flags(&badge, 500000, 50000); // 500k vs 10k avg = 50x
    
    assert!(flags.extraction(), "Should detect extraction attempt");
}

#[test]
fn test_risk_detection_acceleration() {
    let mut badge = make_minted_badge(1000);
    
    // Build up history over 10000 blocks
    badge.tx_total = 100;
    badge.tx_positive = 100;
    badge.volume_total = 1000000;
    
    // Recent window has high velocity
    badge.window_start = 10000;
    badge.window_tx_count = 50; // 50 tx in recent window
    
    // 50 tx in ~1000 blocks vs 100 tx in 10000 blocks
    // Recent: 0.05 tx/block vs Historical: 0.01 tx/block = 5x
    let flags = compute_flags(&badge, 10000, 11000);
    
    assert!(flags.acceleration(), "Should detect acceleration");
}

#[test]
fn test_cascade_damage_calculation() {
    // Minor severity with 50% stake
    let damage = calculate_cascade_damage(&Severity::Minor, 50);
    assert_eq!(damage, 2); // 5 * 50 / 100 = 2.5 -> 2
    
    // Severe with 100% stake
    let damage = calculate_cascade_damage(&Severity::Severe, 100);
    assert_eq!(damage, 50);
    
    // Major with 10% stake
    let damage = calculate_cascade_damage(&Severity::Major, 10);
    assert_eq!(damage, 1); // 15 * 10 / 100 = 1.5 -> 1
}

// ============================================================================
// APP CONTRACT TESTS (SDK integration)
// ============================================================================

#[test]
fn app_contract_record_succeeds_with_witness() {
    let app = make_app();
    let current_block = 2_000;
    let value = 50_000;
    let outcome = Outcome::Positive;
    let backing_agg = BackingAggregates::default();

    // Generate valid pubkey for the badge owner
    let (_, badge_pubkey) = make_signature(&[0u8; 32]);

    let old_badge = VeilBadge {
        id: B32::from([9u8; 32]),
        created_at: 1_000,
        pubkey: badge_pubkey,
        tx_total: 1,
        tx_positive: 1,
        tx_negative: 0,
        volume_total: 10_000,
        volume_sum_squares: 10_000u128 * 10_000u128,
        window_tx_count: 1,
        window_volume: 10_000,
        window_start: 1_950,
        counterparty_count: 1,
        backing: backing_agg,
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        trust: 15,
        risk: 35,
        flags: RiskFlags::default(),
        last_nonce: B32::zero(),
        last_update: 1_950,
    };

    let nonce = B32::from([7u8; 32]);
    let record = TransactionRecord {
        nonce,
        party_a: old_badge.id,
        party_b: B32::from([8u8; 32]),
        value,
        tx_type: TxType::P2PSale,
        timestamp: 1_700_000_000,
        outcome: outcome.clone(),
    };

    // Hash the record and create valid signatures
    let record_hash = hash_record(&record);
    let (my_sig, _) = make_signature(record_hash.as_bytes());
    let (counterparty_sig, counterparty_pk) = make_counterparty_signature(record_hash.as_bytes());

    let witness = RecordWitness {
        record,
        my_signature: my_sig,
        counterparty_signature: counterparty_sig,
        counterparty_pubkey: counterparty_pk,
    };

    let mut new_badge = old_badge.clone();
    new_badge.tx_total += 1;
    new_badge.tx_positive += 1;
    new_badge.volume_total += value;
    new_badge.volume_sum_squares += (value as u128) * (value as u128);
    let (wcount, wvol, wstart) = update_window(&old_badge, value, current_block);
    new_badge.window_tx_count = wcount;
    new_badge.window_volume = wvol;
    new_badge.window_start = wstart;
    new_badge.last_nonce = nonce;
    new_badge.last_update = current_block;
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, value, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);

    let tx = Transaction {
        ins: vec![(make_utxo(5, 0), wrap_badge(&app, &old_badge))],
        refs: vec![],
        outs: vec![wrap_badge(&app, &new_badge)],
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: BTreeMap::new(),
    };

    // Sanity: data round-trips from charms map
    let _decoded_in: VeilBadge = tx
        .ins[0]
        .1
        .get(&app)
        .expect("app missing in ins")
        .value()
        .expect("decode VeilBadge in ins failed");
    let _decoded_out: VeilBadge = tx
        .outs[0]
        .get(&app)
        .expect("app missing in outs")
        .value()
        .expect("decode VeilBadge in outs failed");

    // Direct validator check
    assert!(validate_record(
        &old_badge,
        &new_badge,
        outcome.clone(),
        value,
        current_block,
        &witness,
    ));
}

#[test]
fn app_contract_vouch_requires_private_witness() {
    let app = make_app();
    let current_block = 50_000;
    let unlock_delay_blocks = MIN_VOUCH_LOCK_BLOCKS + 10;
    let stake_percent = 25u8;
    let target_badge_id = B32::from([3u8; 32]);
    let backing_agg = BackingAggregates::default();

    let old_badge = VeilBadge {
        id: B32::from([9u8; 32]),
        created_at: 1_000,
        pubkey: [3u8; 33],
        tx_total: 10,
        tx_positive: 9,
        tx_negative: 1,
        volume_total: 100_000,
        volume_sum_squares: 100_000u128 * 100_000u128,
        window_tx_count: 2,
        window_volume: 20_000,
        window_start: 49_000,
        counterparty_count: 5,
        backing: backing_agg,
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        trust: 65, // >= MIN_TRUST_TO_VOUCH
        risk: 15,
        flags: RiskFlags::default(),
        last_nonce: B32::zero(),
        last_update: 49_000,
    };

    let witness = VouchWitness {
        target_current_trust: 40, // >= MIN_TRUST_TO_RECEIVE_VOUCH
    };

    let mut new_badge = old_badge.clone();
    new_badge.vouches_out.push(Vouch {
        badge_id: target_badge_id,
        stake_percent,
        created_at: current_block,
        unlock_at: current_block + unlock_delay_blocks,
    });
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, 0, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);
    new_badge.last_update = current_block;

    let tx = Transaction {
        ins: vec![(make_utxo(6, 0), wrap_badge(&app, &old_badge))],
        refs: vec![],
        outs: vec![wrap_badge(&app, &new_badge)],
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: BTreeMap::new(),
    };

    // Sanity: data round-trips from charms map
    let _decoded_in: VeilBadge = tx
        .ins[0]
        .1
        .get(&app)
        .expect("app missing in ins")
        .value()
        .expect("decode VeilBadge in ins failed");
    let _decoded_out: VeilBadge = tx
        .outs[0]
        .get(&app)
        .expect("app missing in outs")
        .value()
        .expect("decode VeilBadge in outs failed");

    assert!(validate_vouch(
        &old_badge,
        &new_badge,
        target_badge_id,
        stake_percent,
        unlock_delay_blocks,
        current_block,
        &witness,
    ));
}

#[test]
fn test_multiple_cascades_accumulate() {
    let current_block = 100_000;
    let source1 = B32::from([1u8; 32]);
    let source2 = B32::from([2u8; 32]);
    
    // Badge vouching for two others
    let mut old_badge = make_established_badge(current_block);
    old_badge.vouches_out.push(Vouch {
        badge_id: source1,
        stake_percent: 30,
        created_at: current_block - 5000,
        unlock_at: current_block + 5000,
    });
    old_badge.vouches_out.push(Vouch {
        badge_id: source2,
        stake_percent: 20,
        created_at: current_block - 4000,
        unlock_at: current_block + 6000,
    });
    old_badge.trust = 80;
    old_badge.cascade_damage = 0;
    
    // First cascade from source1 (Minor: 5 * 30% = 1.5 → 1)
    let damage1 = calculate_cascade_damage(&Severity::Minor, 30);
    assert_eq!(damage1, 1); // Truncated
    
    let mut badge_after_cascade1 = old_badge.clone();
    badge_after_cascade1.cascade_damage = damage1;
    badge_after_cascade1.trust = compute_trust(&badge_after_cascade1, current_block);
    
    // Second cascade from source2 (Major: 15 * 20% = 3)
    let damage2 = calculate_cascade_damage(&Severity::Major, 20);
    assert_eq!(damage2, 3);
    
    let mut badge_after_cascade2 = badge_after_cascade1.clone();
    badge_after_cascade2.cascade_damage = badge_after_cascade1.cascade_damage + damage2;
    badge_after_cascade2.trust = compute_trust(&badge_after_cascade2, current_block);
    
    // Total cascade damage should be accumulated
    assert_eq!(badge_after_cascade2.cascade_damage, 4); // 1 + 3
    
    // Trust should decrease with each cascade
    assert!(badge_after_cascade1.trust < old_badge.trust);
    assert!(badge_after_cascade2.trust < badge_after_cascade1.trust);
}
