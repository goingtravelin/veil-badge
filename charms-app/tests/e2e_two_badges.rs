//! End-to-End Test: Two Badges Recording a Transaction
//!
//! This test simulates the full lifecycle:
//! 1. Alice mints a badge
//! 2. Bob mints a badge
//! 3. Alice and Bob record a P2P sale transaction
//! 4. Both badges are updated with the transaction outcome

mod common;

use veil::*;
use charms_sdk::data::{App, B32 as AppB32, Data, TxId, UtxoId};
use std::collections::BTreeMap;
use secp256k1::SecretKey;

// Re-use common test helpers
use common::{make_keypair, sign_message, make_app};

// ============================================================================
// TEST HELPERS (test-specific only)
// ============================================================================

#[allow(dead_code)]
fn make_utxo(id_byte: u8, index: u32) -> UtxoId {
    UtxoId(TxId([id_byte; 32]), index)
}

#[allow(dead_code)]
fn wrap_badge(app: &App, badge: &VeilBadge) -> BTreeMap<App, Data> {
    let mut map = BTreeMap::new();
    map.insert(app.clone(), Data::from(badge));
    map
}

/// Create a fresh badge for testing
fn mint_badge(genesis_byte: u8, pubkey: PubKey, current_block: u64) -> VeilBadge {
    let genesis_utxo = [genesis_byte; 32];
    let id = compute_badge_id(&genesis_utxo);
    
    VeilBadge {
        schema_version: veil::SCHEMA_VERSION,
        id,
        created_at: current_block,
        pubkey,
        tx_total: 0,
        tx_positive: 0,
        tx_negative: 0,
        volume_total: 0,
        volume_sum_squares: 0,
        window_tx_count: 0,
        window_volume: 0,
        window_start: current_block,
        counterparty_count: 0,
        backing: BackingAggregates::default(),
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: Default::default(),
        trust: 15,
        risk: 35, // new_badge (15) + isolated (20)
        flags: RiskFlags::NEW_BADGE | RiskFlags::ISOLATED,
        last_nonce: B32::zero(),
        last_update: current_block,
    }
}

/// Apply a record transaction to a badge and compute the new state
fn apply_record(
    old_badge: &VeilBadge,
    _counterparty_id: B32,
    outcome: Outcome,
    value: u64,
    nonce: B32,
    current_block: u64,
) -> VeilBadge {
    let mut new_badge = old_badge.clone();
    
    // Update transaction counts
    new_badge.tx_total += 1;
    match &outcome {
        Outcome::Positive => new_badge.tx_positive += 1,
        Outcome::Negative { .. } => new_badge.tx_negative += 1,
    }
    
    // Update volume aggregates
    new_badge.volume_total += value;
    new_badge.volume_sum_squares += (value as u128) * (value as u128);
    
    // Update rolling window
    let (wcount, wvol, wstart) = update_window(old_badge, value, current_block);
    new_badge.window_tx_count = wcount;
    new_badge.window_volume = wvol;
    new_badge.window_start = wstart;
    
    // Update counterparty count (simplified - just increment for new counterparty)
    new_badge.counterparty_count += 1;
    
    // Update replay protection
    new_badge.last_nonce = nonce;
    new_badge.last_update = current_block;
    
    // Recompute derived scores
    new_badge.trust = compute_trust(&new_badge, current_block);
    new_badge.flags = compute_flags(&new_badge, value, current_block);
    new_badge.risk = compute_risk(&new_badge.flags);
    
    new_badge
}

// ============================================================================
// END-TO-END TEST
// ============================================================================

#[test]
fn test_e2e_two_badges_record_transaction() {
    println!("\n============================================================");
    println!("  END-TO-END TEST: Two Badges Recording a Transaction");
    println!("============================================================\n");
    
    let _app = make_app();
    let genesis_block = 100_000;
    let tx_block = 100_100; // 100 blocks later

    // Generate keypairs for Alice and Bob
    let (alice_sk, alice_pk) = make_keypair(0x11);
    let (bob_sk, bob_pk) = make_keypair(0x22);

    // ========================================================================
    // STEP 1: Alice mints her badge
    // ========================================================================
    println!("STEP 1: Alice mints her badge");

    let alice_badge = mint_badge(0xAA, alice_pk, genesis_block);

    println!("  Badge ID: {:?}...", &alice_badge.id.as_bytes()[..4]);
    println!("  Trust: {}", alice_badge.trust);
    println!("  Risk: {}", alice_badge.risk);
    println!("  Flags: new_badge={}, isolated={}",
             alice_badge.flags.new_badge(), alice_badge.flags.isolated());

    assert_eq!(alice_badge.trust, 15);
    assert_eq!(alice_badge.tx_total, 0);

    // Validate the mint
    let genesis_utxo = [0xAA; 32];
    assert!(validate_mint(
        &genesis_utxo,
        alice_badge.pubkey,
        &alice_badge,
        genesis_block,
    ));
    println!("  ✓ Mint validated\n");

    // ========================================================================
    // STEP 2: Bob mints his badge
    // ========================================================================
    println!("STEP 2: Bob mints his badge");

    let bob_badge = mint_badge(0xBB, bob_pk, genesis_block);
    
    println!("  Badge ID: {:?}...", &bob_badge.id.as_bytes()[..4]);
    println!("  Trust: {}", bob_badge.trust);
    println!("  Risk: {}", bob_badge.risk);
    
    assert_eq!(bob_badge.trust, 15);
    assert_eq!(bob_badge.tx_total, 0);
    
    // Validate the mint
    let bob_genesis = [0xBB; 32];
    assert!(validate_mint(
        &bob_genesis,
        bob_badge.pubkey,
        &bob_badge,
        genesis_block,
    ));
    println!("  ✓ Mint validated\n");
    
    // ========================================================================
    // STEP 3: Alice and Bob record a P2P sale (positive outcome)
    // ========================================================================
    println!("STEP 3: Recording P2P sale between Alice and Bob");
    println!("  Value: 100,000 sats");
    println!("  Outcome: Positive");
    
    let tx_value = 100_000u64;
    let nonce = B32::from([0x11; 32]);
    
    // Create the transaction record (private - both parties sign this)
    let record = TransactionRecord {
        nonce,
        party_a: alice_badge.id,
        party_b: bob_badge.id,
        value: tx_value,
        tx_type: TxType::P2PSale,
        timestamp: 1703001600, // Example timestamp
        outcome: Outcome::Positive,
    };

    // Hash the record and create valid signatures
    let record_hash = hash_record(&record);
    let alice_sig = sign_message(record_hash.as_bytes(), &alice_sk);
    let bob_sig = sign_message(record_hash.as_bytes(), &bob_sk);

    // Create witnesses with valid signatures
    let alice_witness = RecordWitness {
        record: record.clone(),
        my_signature: alice_sig,
        counterparty_signature: bob_sig,
        counterparty_pubkey: bob_badge.pubkey,
    };

    let bob_witness = RecordWitness {
        record: record.clone(),
        my_signature: bob_sig,
        counterparty_signature: alice_sig,
        counterparty_pubkey: alice_badge.pubkey,
    };
    
    // ========================================================================
    // STEP 4: Update Alice's badge
    // ========================================================================
    println!("\nSTEP 4: Updating Alice's badge");
    
    let alice_new = apply_record(
        &alice_badge,
        bob_badge.id,
        Outcome::Positive,
        tx_value,
        nonce,
        tx_block,
    );
    
    println!("  tx_total: {} -> {}", alice_badge.tx_total, alice_new.tx_total);
    println!("  tx_positive: {} -> {}", alice_badge.tx_positive, alice_new.tx_positive);
    println!("  volume_total: {} -> {}", alice_badge.volume_total, alice_new.volume_total);
    println!("  trust: {} -> {}", alice_badge.trust, alice_new.trust);
    println!("  risk: {} -> {}", alice_badge.risk, alice_new.risk);
    
    // Validate Alice's state transition
    assert!(validate_record(
        &alice_badge,
        &alice_new,
        Outcome::Positive,
        tx_value,
        tx_block,
        &alice_witness,
    ));
    println!("  ✓ Alice's record validated");
    
    // ========================================================================
    // STEP 5: Update Bob's badge
    // ========================================================================
    println!("\nSTEP 5: Updating Bob's badge");
    
    let bob_new = apply_record(
        &bob_badge,
        alice_badge.id,
        Outcome::Positive,
        tx_value,
        nonce,
        tx_block,
    );
    
    println!("  tx_total: {} -> {}", bob_badge.tx_total, bob_new.tx_total);
    println!("  tx_positive: {} -> {}", bob_badge.tx_positive, bob_new.tx_positive);
    println!("  volume_total: {} -> {}", bob_badge.volume_total, bob_new.volume_total);
    println!("  trust: {} -> {}", bob_badge.trust, bob_new.trust);
    println!("  risk: {} -> {}", bob_badge.risk, bob_new.risk);
    
    // Validate Bob's state transition
    assert!(validate_record(
        &bob_badge,
        &bob_new,
        Outcome::Positive,
        tx_value,
        tx_block,
        &bob_witness,
    ));
    println!("  ✓ Bob's record validated");
    
    // ========================================================================
    // STEP 6: Verify final state
    // ========================================================================
    println!("\n============================================================");
    println!("  FINAL STATE");
    println!("============================================================");
    
    println!("\nAlice's Badge:");
    println!("  Transactions: {} total, {} positive", alice_new.tx_total, alice_new.tx_positive);
    println!("  Volume: {} sats", alice_new.volume_total);
    println!("  Trust: {}", alice_new.trust);
    println!("  Risk: {}", alice_new.risk);
    
    println!("\nBob's Badge:");
    println!("  Transactions: {} total, {} positive", bob_new.tx_total, bob_new.tx_positive);
    println!("  Volume: {} sats", bob_new.volume_total);
    println!("  Trust: {}", bob_new.trust);
    println!("  Risk: {}", bob_new.risk);
    
    // Assertions
    assert_eq!(alice_new.tx_total, 1);
    assert_eq!(alice_new.tx_positive, 1);
    assert_eq!(alice_new.volume_total, tx_value);
    
    assert_eq!(bob_new.tx_total, 1);
    assert_eq!(bob_new.tx_positive, 1);
    assert_eq!(bob_new.volume_total, tx_value);
    
    println!("\n✓ End-to-end test passed!");
}

#[test]
fn test_e2e_negative_outcome_and_cascade() {
    println!("\n============================================================");
    println!("  E2E TEST: Negative Outcome with Cascade");
    println!("============================================================\n");

    let genesis_block = 100_000;
    let tx_block = 100_200;

    // Create three badges: Alice, Bob, and Charlie
    // Charlie vouches for Bob
    // Bob has a negative outcome with Alice
    // Charlie should receive cascade damage

    let (_, alice_pk) = make_keypair(0x11);
    let (_, bob_pk) = make_keypair(0x22);
    let (_, charlie_pk) = make_keypair(0x33);

    let mut alice = mint_badge(0xAA, alice_pk, genesis_block);
    let mut bob = mint_badge(0xBB, bob_pk, genesis_block);
    let mut charlie = mint_badge(0xCC, charlie_pk, genesis_block);
    
    // Give them some history to be eligible for vouching
    // (trust >= 30 required to vouch)
    alice.trust = 60;
    bob.trust = 60;
    charlie.trust = 60;
    charlie.tx_total = 20;
    charlie.tx_positive = 20;
    
    println!("Initial state:");
    println!("  Alice trust: {}", alice.trust);
    println!("  Bob trust: {}", bob.trust);
    println!("  Charlie trust: {}", charlie.trust);
    
    // Charlie vouches for Bob (25% stake)
    let stake_percent = 25u8;
    let vouch = Vouch {
        badge_id: bob.id,
        stake_percent,
        created_at: genesis_block + 100,
        unlock_at: genesis_block + 100 + MIN_VOUCH_LOCK_BLOCKS,
    };
    charlie.vouches_out.push(vouch.clone());
    
    let incoming_vouch = Vouch {
        badge_id: charlie.id,
        stake_percent,
        created_at: genesis_block + 100,
        unlock_at: genesis_block + 100 + MIN_VOUCH_LOCK_BLOCKS,
    };
    bob.vouches_in.push(incoming_vouch);
    
    println!("\nCharlie vouches for Bob with {}% stake", stake_percent);
    
    // Bob has a SEVERE negative outcome with Alice
    let tx_value = 50_000u64;
    let nonce = B32::from([0x22; 32]);
    let _outcome = Outcome::Negative { severity: Severity::Severe };
    
    println!("\nBob has SEVERE negative outcome with Alice");
    println!("  Value: {} sats", tx_value);
    println!("  Severity: Severe (50 damage)");
    
    // Update Bob's badge with negative outcome
    let mut bob_after = bob.clone();
    bob_after.tx_total += 1;
    bob_after.tx_negative += 1;
    bob_after.volume_total += tx_value;
    bob_after.volume_sum_squares += (tx_value as u128) * (tx_value as u128);
    bob_after.last_nonce = nonce;
    bob_after.last_update = tx_block;
    bob_after.trust = compute_trust(&bob_after, tx_block);
    bob_after.flags = compute_flags(&bob_after, tx_value, tx_block);
    bob_after.risk = compute_risk(&bob_after.flags);
    
    println!("\nBob's badge after negative:");
    println!("  Trust: {} -> {}", bob.trust, bob_after.trust);
    println!("  tx_negative: {} -> {}", bob.tx_negative, bob_after.tx_negative);
    
    // Calculate cascade damage to Charlie
    let cascade_damage = calculate_cascade_damage(&Severity::Severe, stake_percent);
    println!("\nCascade damage to Charlie:");
    println!("  Formula: severity_damage * stake_percent / 100");
    println!("  = 50 * {} / 100 = {}", stake_percent, cascade_damage);
    
    // Apply cascade to Charlie
    let mut charlie_after = charlie.clone();
    charlie_after.cascade_damage += cascade_damage;
    charlie_after.trust = compute_trust(&charlie_after, tx_block);
    
    println!("\nCharlie's badge after cascade:");
    println!("  Cascade damage: {} -> {}", charlie.cascade_damage, charlie_after.cascade_damage);
    println!("  Trust: {} -> {}", charlie.trust, charlie_after.trust);
    
    // Verify cascade damage is applied correctly
    assert_eq!(cascade_damage, 12); // 50 * 25 / 100 = 12
    assert_eq!(charlie_after.cascade_damage, 12);
    assert!(charlie_after.trust < charlie.trust, "Charlie's trust should decrease");
    
    println!("\n✓ Negative outcome and cascade test passed!");
}

#[test]
fn test_e2e_multiple_transactions_build_reputation() {
    println!("\n============================================================");
    println!("  E2E TEST: Building Reputation Over Time");
    println!("============================================================\n");

    let genesis_block = 100_000;

    let (_, alice_pk) = make_keypair(0x11);
    let (_, bob_pk) = make_keypair(0x22);

    let mut alice = mint_badge(0xAA, alice_pk, genesis_block);
    let bob = mint_badge(0xBB, bob_pk, genesis_block);
    
    println!("Alice starts with:");
    println!("  Trust: {}", alice.trust);
    println!("  Transactions: {}", alice.tx_total);
    println!("  Flags: new_badge={}, isolated={}", 
             alice.flags.new_badge(), alice.flags.isolated());
    
    // Simulate 20 positive transactions over ~100 days
    for i in 1..=20 {
        let tx_block = genesis_block + (i * 144 * 5); // Every 5 days
        let tx_value = 50_000 + (i as u64 * 10_000); // Increasing values
        let nonce = B32::from([i as u8; 32]);
        
        alice = apply_record(
            &alice,
            bob.id,
            Outcome::Positive,
            tx_value,
            nonce,
            tx_block,
        );
        
        if i % 5 == 0 {
            println!("\nAfter {} transactions:", i);
            println!("  Trust: {}", alice.trust);
            println!("  Volume: {} sats", alice.volume_total);
            println!("  Risk: {}", alice.risk);
            println!("  Flags: new_badge={}", alice.flags.new_badge());
        }
    }
    
    println!("\n========================================");
    println!("FINAL STATE after 20 transactions:");
    println!("========================================");
    println!("  Trust: {}", alice.trust);
    println!("  Transactions: {} total, {} positive", alice.tx_total, alice.tx_positive);
    println!("  Volume: {} sats", alice.volume_total);
    println!("  Risk: {}", alice.risk);
    println!("  Flags:");
    println!("    new_badge: {}", alice.flags.new_badge());
    println!("    isolated: {}", alice.flags.isolated());
    println!("    too_clean: {}", alice.flags.too_clean());
    
    assert_eq!(alice.tx_total, 20);
    assert_eq!(alice.tx_positive, 20);
    assert!(alice.trust > 15, "Trust should increase with positive transactions");
    
    println!("\n✓ Reputation building test passed!");
}
