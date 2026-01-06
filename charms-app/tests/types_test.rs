//! Unit tests for Veil Protocol types
//!
//! Tests for core data structures and serialization.

mod common;

use veil::*;

#[test]
fn test_default_badge() {
    let badge = VeilBadge::default();
    assert_eq!(badge.trust, 15);
    assert_eq!(badge.risk, 15);
    assert_eq!(badge.tx_total, 0);
}

#[test]
fn test_severity_damage() {
    assert_eq!(Severity::Minor.damage(), 5);
    assert_eq!(Severity::Major.damage(), 15);
    assert_eq!(Severity::Severe.damage(), 50);
}

#[test]
fn test_transaction_record_parties() {
    let n1 = B32::from([1u8; 32]);
    let a = B32::from([2u8; 32]);
    let b = B32::from([3u8; 32]);
    let c = B32::from([4u8; 32]);

    let record = TransactionRecord {
        nonce: n1,
        party_a: a,
        party_b: b,
        value: 100000,
        tx_type: TxType::P2PSale,
        timestamp: 1700000000,
        outcome: Outcome::Positive,
    };
    
    assert!(record.has_party(&a));
    assert!(record.has_party(&b));
    assert!(!record.has_party(&c));
    
    assert_eq!(record.counterparty(&a), Some(b));
    assert_eq!(record.counterparty(&b), Some(a));
    assert_eq!(record.counterparty(&c), None);
}

#[test]
fn test_badge_cbor_roundtrip() {
    let badge = VeilBadge::default();

    // Encode/decode with serde_cbor first to capture any failing path
    let bytes = serde_cbor::to_vec(&badge).expect("serialize badge with serde_cbor");
    let mut deserializer = serde_cbor::Deserializer::from_slice(&bytes);
    let decoded: VeilBadge = serde_path_to_error::deserialize(&mut deserializer)
        .map_err(|e| format!("cbor decode failed at {}: {e}", e.path()))
        .expect("decode badge from cbor bytes");

    // Ensure Data wrapper still round-trips
    let d = charms_sdk::data::Data::from(&badge);
    let decoded_data: VeilBadge = d
        .value()
        .expect("decode badge from Data");

    assert_eq!(badge, decoded);
    assert_eq!(badge, decoded_data);
}

#[test]
fn test_b32_equality() {
    let a = B32::from([1u8; 32]);
    let b = B32::from([1u8; 32]);
    let c = B32::from([2u8; 32]);
    
    assert_eq!(a, b);
    assert_ne!(a, c);
    assert_eq!(a, [1u8; 32]);
}

#[test]
fn test_b32_zero() {
    let zero = B32::zero();
    assert_eq!(zero, [0u8; 32]);
}

#[test]
fn test_accept_proposal_action_serde() {
    let action = Action::AcceptProposal {
        proposal_id: B32::from([1u8; 32]),
        proposer_badge_id: B32::from([2u8; 32]),
        value: 100000,
        category: TxCategory::Trade,
        window_blocks: 144,
        report_window_blocks: 432,
        current_block: 117204,
    };
    
    // Test JSON serialization
    let json = serde_json::to_string_pretty(&action).unwrap();
    println!("AcceptProposal JSON:\n{}", json);
    
    // Test JSON deserialization from the format the client produces
    let yaml_like = r#"{
        "AcceptProposal": {
            "proposal_id": "7bd2c0b19fa8609b72e2cb1ec151b6b8418e2ef3541d1232d1235c9b63ce66d1",
            "proposer_badge_id": "7fc4ef288574feb2895d4999176a4f1816308b9d6bb44dba457df3c59e1133e3",
            "value": 100000,
            "category": "Trade",
            "window_blocks": 144,
            "report_window_blocks": 432,
            "current_block": 117204
        }
    }"#;
    
    let deserialized: Action = serde_json::from_str(yaml_like).expect("Should deserialize AcceptProposal");
    
    match deserialized {
        Action::AcceptProposal { proposal_id, proposer_badge_id, value, category, window_blocks, report_window_blocks, current_block } => {
            assert_eq!(value, 100000);
            assert_eq!(category, TxCategory::Trade);
            assert_eq!(window_blocks, 144);
            assert_eq!(report_window_blocks, 432);
            assert_eq!(current_block, 117204);
            println!("proposal_id: {:?}", proposal_id);
            println!("proposer_badge_id: {:?}", proposer_badge_id);
        }
        _ => panic!("Wrong action variant"),
    }
}

#[test]
fn test_active_transaction_serde() {
    // Test the ActiveTransaction struct serialization
    let tx = ActiveTransaction {
        id: B32::from([1u8; 32]),
        counterparty_badge_id: B32::from([2u8; 32]),
        value: 100000,
        category: TxCategory::Trade,
        started_at: 117204,
        window_ends_at: 117348,
        report_deadline: 117780,
        i_am_proposer: false,
    };
    
    let json = serde_json::to_string_pretty(&tx).unwrap();
    println!("ActiveTransaction JSON:\n{}", json);
    
    // Test inline format like the spell generator produces
    let inline = r#"{ "id": "0101010101010101010101010101010101010101010101010101010101010101", "counterparty_badge_id": "0202020202020202020202020202020202020202020202020202020202020202", "value": 100000, "category": "Trade", "started_at": 117204, "window_ends_at": 117348, "report_deadline": 117780, "i_am_proposer": false }"#;
    
    let restored: ActiveTransaction = serde_json::from_str(inline).expect("Should deserialize ActiveTransaction");
    assert_eq!(restored.value, 100000);
    assert_eq!(restored.category, TxCategory::Trade);
    assert_eq!(restored.started_at, 117204);
    assert!(!restored.i_am_proposer);
}

#[test]
fn test_active_transaction_yaml_inline() {
    // Test the exact format the spell generator produces (without quotes on category)
    let inline_yaml = r#"{ id: "0101010101010101010101010101010101010101010101010101010101010101", counterparty_badge_id: "0202020202020202020202020202020202020202020202020202020202020202", value: 100000, category: Trade, started_at: 117204, window_ends_at: 117348, report_deadline: 117780, i_am_proposer: false }"#;
    
    let restored: ActiveTransaction = serde_yaml::from_str(inline_yaml).expect("Should deserialize ActiveTransaction from YAML");
    assert_eq!(restored.value, 100000);
    assert_eq!(restored.category, TxCategory::Trade);
    assert_eq!(restored.started_at, 117204);
    assert!(!restored.i_am_proposer);
    println!("YAML inline deserialization OK: {:?}", restored);
}

#[test]
fn test_full_badge_yaml() {
    // Test the full badge serialization format that the spell generator produces
    let badge_yaml = r#"
id: "17174d5381653821041b8baa6f908de2d091c3154ba073f1b94053d84baf2d08"
created_at: 117197
pubkey: "02c46a17827abc6e42b6df542ef3c30091630ae81b3115d29e037376287d086b33"
tx_total: 0
tx_positive: 0
tx_negative: 0
volume_total: 0
volume_sum_squares: 0
window_tx_count: 0
window_volume: 0
window_start: 117197
counterparty_count: 0
backing:
  backed_count: 0
  unbacked_count: 0
  backed_volume: 0
  unbacked_volume: 0
vouches_out: []
vouches_in: []
cascade_damage: 0
active_transactions: []
reporting_transactions: []
outcomes:
  mutual_positive: 0
  mutual_negative: 0
  contested_i_positive: 0
  contested_i_negative: 0
  timeout: 0
  mutual_timeout: 0
trust: 15
risk: 35
flags: 36
last_nonce: "0000000000000000000000000000000000000000000000000000000000000000"
last_update: 117197
"#;
    
    let badge: VeilBadge = serde_yaml::from_str(badge_yaml).expect("Should deserialize VeilBadge from YAML");
    assert_eq!(badge.tx_total, 0);
    assert_eq!(badge.trust, 15);
    assert_eq!(badge.risk, 35);
    println!("VeilBadge from YAML OK: id={:?}", badge.id);
}

#[test]
fn test_risk_flags_serialization() {
    let flags = RiskFlags::ACCELERATION | RiskFlags::NEW_BADGE;
    
    println!("JSON: {}", serde_json::to_string(&flags).unwrap());
    println!("YAML: {}", serde_yaml::to_string(&flags).unwrap());
    
    // The actual value
    let bits = flags.bits();
    println!("Bits value: {}", bits);
    
    // Try deserializing from integer
    let from_int_json: Result<RiskFlags, _> = serde_json::from_str(&bits.to_string());
    println!("From int JSON: {:?}", from_int_json);
    
    let from_int_yaml: Result<RiskFlags, _> = serde_yaml::from_str(&bits.to_string());
    println!("From int YAML: {:?}", from_int_yaml);
}

#[test]
fn test_accept_proposal_exact_yaml_format() {
    // Test the EXACT format that the TypeScript client generates
    // This is copied from the browser console logs
    // NOTE: The prover receives badge state as YAML but action as JSON/CBOR
    let badge_in_yaml = r#"
        id: "17174d5381653821041b8baa6f908de2d091c3154ba073f1b94053d84baf2d08"
        created_at: 117197
        pubkey: "02c46a17827abc6e42b6df542ef3c30091630ae81b3115d29e037376287d086b33"
        tx_total: 0
        tx_positive: 0
        tx_negative: 0
        volume_total: 0
        volume_sum_squares: 0
        window_tx_count: 0
        window_volume: 0
        window_start: 117197
        counterparty_count: 0
        backing:
          backed_count: 0
          unbacked_count: 0
          backed_volume: 0
          unbacked_volume: 0
        vouches_out: []
        vouches_in: []
        cascade_damage: 0
        active_transactions: []
        reporting_transactions: []
        outcomes:
          mutual_positive: 0
          mutual_negative: 0
          contested_i_positive: 0
          contested_i_negative: 0
          timeout: 0
          mutual_timeout: 0
        trust: 15
        risk: 35
        flags: 36
        last_nonce: "0000000000000000000000000000000000000000000000000000000000000000"
        last_update: 117197
    "#;

    let badge_out_yaml = r#"
        id: "17174d5381653821041b8baa6f908de2d091c3154ba073f1b94053d84baf2d08"
        created_at: 117197
        pubkey: "02c46a17827abc6e42b6df542ef3c30091630ae81b3115d29e037376287d086b33"
        tx_total: 0
        tx_positive: 0
        tx_negative: 0
        volume_total: 0
        volume_sum_squares: 0
        window_tx_count: 0
        window_volume: 0
        window_start: 117197
        counterparty_count: 0
        backing:
          backed_count: 0
          unbacked_count: 0
          backed_volume: 0
          unbacked_volume: 0
        vouches_out: []
        vouches_in: []
        cascade_damage: 0
        active_transactions: [{ id: "7bd2c0b19fa8609b72e2cb1ec151b6b8418e2ef3541d1232d1235c9b63ce66d1", counterparty_badge_id: "7fc4ef288574feb2895d4999176a4f1816308b9d6bb44dba457df3c59e1133e3", value: 100000, category: Trade, started_at: 117204, window_ends_at: 117348, report_deadline: 117780, i_am_proposer: false }]
        reporting_transactions: []
        outcomes:
          mutual_positive: 0
          mutual_negative: 0
          contested_i_positive: 0
          contested_i_negative: 0
          timeout: 0
          mutual_timeout: 0
        trust: 15
        risk: 35
        flags: 36
        last_nonce: "0000000000000000000000000000000000000000000000000000000000000000"
        last_update: 117204
    "#;

    // Action is received as JSON/CBOR by the prover, not YAML
    let action_json = r#"{
        "AcceptProposal": {
            "proposal_id": "7bd2c0b19fa8609b72e2cb1ec151b6b8418e2ef3541d1232d1235c9b63ce66d1",
            "proposer_badge_id": "7fc4ef288574feb2895d4999176a4f1816308b9d6bb44dba457df3c59e1133e3",
            "value": 100000,
            "category": "Trade",
            "window_blocks": 144,
            "report_window_blocks": 432,
            "current_block": 117204
        }
    }"#;

    // Deserialize input badge
    let old_badge: VeilBadge = serde_yaml::from_str(badge_in_yaml)
        .expect("Failed to deserialize input badge");
    println!("Input badge: id={:?}, flags={}", old_badge.id, old_badge.flags.bits());
    
    // Deserialize output badge  
    let new_badge: VeilBadge = serde_yaml::from_str(badge_out_yaml)
        .expect("Failed to deserialize output badge");
    println!("Output badge: id={:?}, active_txs={}", new_badge.id, new_badge.active_transactions.len());
    
    // Deserialize action from JSON (as prover receives it)
    let action: Action = serde_json::from_str(action_json)
        .expect("Failed to deserialize action");
    println!("Action: {:?}", action);
    
    // Verify the action matches what we expect
    match action {
        Action::AcceptProposal { proposal_id: _, proposer_badge_id: _, value, category, window_blocks, report_window_blocks, current_block } => {
            assert_eq!(value, 100000);
            assert_eq!(window_blocks, 144);
            assert_eq!(report_window_blocks, 432);
            assert_eq!(current_block, 117204);
            assert_eq!(category, TxCategory::Trade);
        }
        _ => panic!("Wrong action variant"),
    }
    
    // Verify the new badge has the expected active transaction
    assert_eq!(new_badge.active_transactions.len(), 1);
    let active_tx = &new_badge.active_transactions[0];
    assert_eq!(active_tx.value, 100000);
    assert_eq!(active_tx.started_at, 117204);
    assert_eq!(active_tx.window_ends_at, 117348);
    assert_eq!(active_tx.report_deadline, 117780);
    assert!(!active_tx.i_am_proposer);
    
    println!("✅ All exact format tests passed!");
}

#[test]
fn test_accept_proposal_json_format() {
    // Test the JSON format that the prover actually receives (converted from YAML)
    let action_json = r#"{
        "AcceptProposal": {
            "proposal_id": "7bd2c0b19fa8609b72e2cb1ec151b6b8418e2ef3541d1232d1235c9b63ce66d1",
            "proposer_badge_id": "7fc4ef288574feb2895d4999176a4f1816308b9d6bb44dba457df3c59e1133e3",
            "value": 100000,
            "category": "Trade",
            "window_blocks": 144,
            "report_window_blocks": 432,
            "current_block": 117204
        }
    }"#;

    let action: Action = serde_json::from_str(action_json)
        .expect("Failed to deserialize action from JSON");
    println!("Action from JSON: {:?}", action);
    
    match action {
        Action::AcceptProposal { proposal_id, proposer_badge_id, value, category, window_blocks, report_window_blocks, current_block } => {
            assert_eq!(value, 100000);
            assert_eq!(window_blocks, 144);
            assert_eq!(category, TxCategory::Trade);
            println!("✅ JSON format works!");
        }
        _ => panic!("Wrong action variant"),
    }
}
