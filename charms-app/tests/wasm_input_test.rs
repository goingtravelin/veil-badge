/// Test that simulates what the charms-app-runner does
/// It loads our WASM and feeds it serialized (App, Transaction, Data, Data)

use charms_data::{App, Data, Transaction, util, Charms, UtxoId, TxId};
use veil::types::{Action, VeilBadge, RiskFlags};
use veil::types::proposal::{OutcomeAggregates, TxCategory};
use veil::types::backing::BackingAggregates;
use std::str::FromStr;
use std::collections::BTreeMap;

fn create_test_badge() -> VeilBadge {
    VeilBadge {
        schema_version: veil::SCHEMA_VERSION,
        id: veil::types::B32::new([0x01; 32]),
        created_at: 1000,
        pubkey: [0x02; 33],
        tx_total: 0,
        tx_positive: 0,
        tx_negative: 0,
        volume_total: 0,
        volume_sum_squares: 0,
        window_tx_count: 0,
        window_volume: 0,
        window_start: 0,
        counterparty_count: 0,
        backing: BackingAggregates::default(),
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: OutcomeAggregates::default(),
        trust: 15,
        risk: 15,
        flags: RiskFlags::default(),
        last_nonce: veil::types::B32::zero(),
        last_update: 0,
    }
}

/// Test that we can serialize the exact input the WASM expects
#[test]
fn test_serialize_wasm_input() {
    // Create the App (from charms-data)
    let app = App::from_str("n/0000000000000000000000000000000000000000000000000000000000000001/472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd")
        .expect("parse app");
    
    // Create a badge
    let badge = create_test_badge();
    
    // Create the charms for the input
    let mut in_charms: Charms = BTreeMap::new();
    in_charms.insert(app.clone(), Data::from(&badge));
    
    // Create the Transaction
    let tx = Transaction {
        ins: vec![
            (
                UtxoId::from_str("1111111111111111111111111111111111111111111111111111111111111111:0").unwrap(),
                in_charms.clone()
            )
        ],
        refs: vec![],
        outs: vec![in_charms.clone()],
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: {
            let mut map = BTreeMap::new();
            map.insert(app.clone(), Data::from(&Action::Transfer));
            map
        },
    };
    
    // Create the public input (x) - Transfer action
    let x = Data::from(&Action::Transfer);
    
    // Create the witness (w) - empty
    let w = Data::from(&serde_json::Value::Null);
    
    // Serialize the tuple (this is what gets fed to WASM stdin)
    let input_tuple = (&app, &tx, &x, &w);
    let cbor_bytes = util::write(&input_tuple).expect("serialize tuple");
    
    println!("CBOR input size: {} bytes", cbor_bytes.len());
    println!("First 100 bytes: {:02x?}", &cbor_bytes[..100.min(cbor_bytes.len())]);
    
    // Deserialize it back (this is what main! macro does)
    let (app2, tx2, x2, w2): (App, Transaction, Data, Data) = 
        util::read(&cbor_bytes[..]).expect("deserialize tuple");
    
    assert_eq!(app, app2);
    println!("✅ App deserialized correctly");
    
    // Now check if we can deserialize the Action from x2
    let action: Action = x2.value().expect("deserialize Action");
    match action {
        Action::Transfer => println!("✅ Action::Transfer deserialized correctly"),
        _ => panic!("Expected Action::Transfer"),
    }
    
    // Check if we can deserialize the badge from the transaction outputs
    let out_charms = &tx2.outs[0];
    let badge_data = out_charms.get(&app2).expect("get badge data");
    let badge2: VeilBadge = badge_data.value().expect("deserialize VeilBadge");
    
    assert_eq!(badge.created_at, badge2.created_at);
    println!("✅ VeilBadge deserialized correctly from transaction output");
}

/// Test what happens when we call our app_contract function
#[test]
fn test_app_contract_transfer() {
    // Create the App
    let app = App::from_str("n/0000000000000000000000000000000000000000000000000000000000000001/472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd")
        .expect("parse app");
    
    // Create a badge
    let badge = create_test_badge();
    
    // Create the charms for the input
    let mut in_charms: Charms = BTreeMap::new();
    in_charms.insert(app.clone(), Data::from(&badge));
    
    // Create the Transaction for a simple transfer (same badge in, same badge out)
    let tx = Transaction {
        ins: vec![
            (
                UtxoId::from_str("1111111111111111111111111111111111111111111111111111111111111111:0").unwrap(),
                in_charms.clone()
            )
        ],
        refs: vec![],
        outs: vec![in_charms.clone()],
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: {
            let mut map = BTreeMap::new();
            map.insert(app.clone(), Data::from(&Action::Transfer));
            map
        },
    };
    
    // Create the public input (x) - Transfer action
    let x = Data::from(&Action::Transfer);
    
    // Create the witness (w) - empty
    let w = Data::empty();
    
    // Call our app_contract function directly
    let result = veil::app_contract(&app, &tx, &x, &w);
    
    if result {
        println!("✅ app_contract returned true for Transfer");
    } else {
        panic!("❌ app_contract returned false for Transfer");
    }
}

/// Test AcceptProposal action serialization
#[test]
fn test_accept_proposal_serialization() {
    use serde_json::json;
    
    // Create the action JSON (as the frontend would send)
    let action_json = json!({
        "AcceptProposal": {
            "proposal_id": "17174d5341f9c907ce6c91c5bf29b3a9a85c81748592393f1d5f6b0ba64a22f5",
            "proposer_badge_id": "27174d5341f9c907ce6c91c5bf29b3a9a85c81748592393f1d5f6b0ba64a22f5",
            "value": 100000,
            "category": "Trade",
            "window_blocks": 144,
            "report_window_blocks": 288,
            "current_block": 1000
        }
    });
    
    // Convert to Data
    let data = Data::from(&action_json);
    
    // Deserialize as Action
    let action: Action = data.value().expect("deserialize Action");
    
    match action {
        Action::AcceptProposal { proposal_id, value, category, .. } => {
            println!("✅ AcceptProposal deserialized correctly");
            println!("  proposal_id: {}", hex::encode(proposal_id.0));
            println!("  value: {}", value);
            assert_eq!(value, 100000);
            assert_eq!(category, TxCategory::Trade);
        }
        _ => panic!("Expected AcceptProposal"),
    }
}

/// Test the full AcceptProposal flow through app_contract
/// This is the most comprehensive test - it simulates exactly what the prover does
#[test]
fn test_app_contract_accept_proposal() {
    use serde_json::json;
    use veil::types::proposal::ActiveTransaction;
    
    // Create two badges: proposer and acceptor
    let proposer_badge_id = [0x01u8; 32];
    let acceptor_badge_id = [0x02u8; 32];
    let proposal_id = [0xAAu8; 32];
    
    let current_block: u64 = 117520;
    let window_blocks: u32 = 144;
    let report_window_blocks: u32 = 288;
    let value: u64 = 100000;
    
    // Create App for proposer
    let proposer_app = App::from_str(&format!(
        "n/{}/472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd",
        hex::encode(proposer_badge_id)
    )).expect("parse proposer app");
    
    // Create App for acceptor
    let acceptor_app = App::from_str(&format!(
        "n/{}/472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd",
        hex::encode(acceptor_badge_id)
    )).expect("parse acceptor app");
    
    // Create OLD proposer badge (no active transactions)
    let proposer_old_badge = VeilBadge {
        schema_version: veil::SCHEMA_VERSION,
        id: veil::types::B32::new(proposer_badge_id),
        created_at: 117000,
        pubkey: [0x02; 33],
        tx_total: 0,
        tx_positive: 0,
        tx_negative: 0,
        volume_total: 0,
        volume_sum_squares: 0,
        window_tx_count: 0,
        window_volume: 0,
        window_start: 117000,
        counterparty_count: 0,
        backing: BackingAggregates::default(),
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: OutcomeAggregates::default(),
        trust: 15,
        risk: 35,
        flags: RiskFlags::NEW_BADGE,
        last_nonce: veil::types::B32::zero(),
        last_update: 117000,
    };
    
    // Create NEW proposer badge (with active transaction added)
    let proposer_active_tx = ActiveTransaction {
        id: veil::types::B32::new(proposal_id),
        counterparty_badge_id: veil::types::B32::new(acceptor_badge_id),
        value,
        category: TxCategory::Trade,
        started_at: current_block as u32,
        window_ends_at: (current_block + window_blocks as u64) as u32,
        report_deadline: (current_block + window_blocks as u64 + report_window_blocks as u64) as u32,
        i_am_proposer: true,
    };
    
    let mut proposer_new_badge = proposer_old_badge.clone();
    proposer_new_badge.active_transactions = vec![proposer_active_tx];
    proposer_new_badge.last_update = current_block;
    
    // Create OLD acceptor badge (no active transactions)
    let acceptor_old_badge = VeilBadge {
        schema_version: veil::SCHEMA_VERSION,
        id: veil::types::B32::new(acceptor_badge_id),
        created_at: 117100,
        pubkey: [0x03; 33],
        tx_total: 0,
        tx_positive: 0,
        tx_negative: 0,
        volume_total: 0,
        volume_sum_squares: 0,
        window_tx_count: 0,
        window_volume: 0,
        window_start: 117100,
        counterparty_count: 0,
        backing: BackingAggregates::default(),
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: OutcomeAggregates::default(),
        trust: 15,
        risk: 35,
        flags: RiskFlags::NEW_BADGE,
        last_nonce: veil::types::B32::zero(),
        last_update: 117100,
    };
    
    // Create NEW acceptor badge (with active transaction added)
    let acceptor_active_tx = ActiveTransaction {
        id: veil::types::B32::new(proposal_id),
        counterparty_badge_id: veil::types::B32::new(proposer_badge_id),
        value,
        category: TxCategory::Trade,
        started_at: current_block as u32,
        window_ends_at: (current_block + window_blocks as u64) as u32,
        report_deadline: (current_block + window_blocks as u64 + report_window_blocks as u64) as u32,
        i_am_proposer: false,
    };
    
    let mut acceptor_new_badge = acceptor_old_badge.clone();
    acceptor_new_badge.active_transactions = vec![acceptor_active_tx];
    acceptor_new_badge.last_update = current_block;
    
    // Create input charms for proposer
    let mut proposer_in_charms: Charms = BTreeMap::new();
    proposer_in_charms.insert(proposer_app.clone(), Data::from(&proposer_old_badge));
    
    // Create output charms for proposer
    let mut proposer_out_charms: Charms = BTreeMap::new();
    proposer_out_charms.insert(proposer_app.clone(), Data::from(&proposer_new_badge));
    
    // Create input charms for acceptor
    let mut acceptor_in_charms: Charms = BTreeMap::new();
    acceptor_in_charms.insert(acceptor_app.clone(), Data::from(&acceptor_old_badge));
    
    // Create output charms for acceptor
    let mut acceptor_out_charms: Charms = BTreeMap::new();
    acceptor_out_charms.insert(acceptor_app.clone(), Data::from(&acceptor_new_badge));
    
    // Create the AcceptProposal action
    let action = Action::AcceptProposal {
        proposal_id: veil::types::B32::new(proposal_id),
        proposer_badge_id: veil::types::B32::new(proposer_badge_id),
        value,
        category: TxCategory::Trade,
        window_blocks,
        report_window_blocks,
        current_block,
    };
    
    // === TEST PROPOSER BADGE ===
    println!("\n=== Testing PROPOSER badge app_contract ===");
    
    let proposer_tx = Transaction {
        ins: vec![
            (
                UtxoId::from_str("1111111111111111111111111111111111111111111111111111111111111111:0").unwrap(),
                proposer_in_charms.clone()
            )
        ],
        refs: vec![],
        outs: vec![proposer_out_charms.clone()],
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: {
            let mut map = BTreeMap::new();
            map.insert(proposer_app.clone(), Data::from(&action));
            map
        },
    };
    
    let proposer_x = Data::from(&action);
    let proposer_w = Data::empty();
    
    let proposer_result = veil::app_contract(&proposer_app, &proposer_tx, &proposer_x, &proposer_w);
    
    if proposer_result {
        println!("✅ PROPOSER app_contract returned true for AcceptProposal");
    } else {
        println!("❌ PROPOSER app_contract returned false for AcceptProposal");
        panic!("Proposer app_contract failed!");
    }
    
    // === TEST ACCEPTOR BADGE ===
    println!("\n=== Testing ACCEPTOR badge app_contract ===");
    
    let acceptor_tx = Transaction {
        ins: vec![
            (
                UtxoId::from_str("2222222222222222222222222222222222222222222222222222222222222222:0").unwrap(),
                acceptor_in_charms.clone()
            )
        ],
        refs: vec![],
        outs: vec![acceptor_out_charms.clone()],
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: {
            let mut map = BTreeMap::new();
            map.insert(acceptor_app.clone(), Data::from(&action));
            map
        },
    };
    
    let acceptor_x = Data::from(&action);
    let acceptor_w = Data::empty();
    
    let acceptor_result = veil::app_contract(&acceptor_app, &acceptor_tx, &acceptor_x, &acceptor_w);
    
    if acceptor_result {
        println!("✅ ACCEPTOR app_contract returned true for AcceptProposal");
    } else {
        println!("❌ ACCEPTOR app_contract returned false for AcceptProposal");
        panic!("Acceptor app_contract failed!");
    }
    
    println!("\n✅ Both PROPOSER and ACCEPTOR badges validated successfully!");
}

/// Test that app_contract fails when badge identity changes
/// This ensures our validation logic actually catches errors
#[test]
fn test_app_contract_accept_proposal_validation_failure() {
    use veil::types::proposal::ActiveTransaction;
    
    let proposer_badge_id = [0x01u8; 32];
    let acceptor_badge_id = [0x02u8; 32];
    let proposal_id = [0xAAu8; 32];
    
    let current_block: u64 = 117520;
    let window_blocks: u32 = 144;
    let report_window_blocks: u32 = 288;
    let value: u64 = 100000;
    
    let proposer_app = App::from_str(&format!(
        "n/{}/472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd",
        hex::encode(proposer_badge_id)
    )).expect("parse proposer app");
    
    // Create OLD badge (no active transactions)
    let old_badge = VeilBadge {
        schema_version: veil::SCHEMA_VERSION,
        id: veil::types::B32::new(proposer_badge_id),
        created_at: 117000,
        pubkey: [0x02; 33],
        tx_total: 0,
        tx_positive: 0,
        tx_negative: 0,
        volume_total: 0,
        volume_sum_squares: 0,
        window_tx_count: 0,
        window_volume: 0,
        window_start: 117000,
        counterparty_count: 0,
        backing: BackingAggregates::default(),
        vouches_out: vec![],
        vouches_in: vec![],
        cascade_damage: 0,
        active_transactions: vec![],
        reporting_transactions: vec![],
        outcomes: OutcomeAggregates::default(),
        trust: 15,
        risk: 35,
        flags: RiskFlags::NEW_BADGE,
        last_nonce: veil::types::B32::zero(),
        last_update: 117000,
    };
    
    // Create NEW badge with WRONG ID (badge identity changed - should fail)
    let active_tx = ActiveTransaction {
        id: veil::types::B32::new(proposal_id),
        counterparty_badge_id: veil::types::B32::new(acceptor_badge_id),
        value,
        category: TxCategory::Trade,
        started_at: current_block as u32,
        window_ends_at: (current_block + window_blocks as u64) as u32,
        report_deadline: (current_block + window_blocks as u64 + report_window_blocks as u64) as u32,
        i_am_proposer: true,
    };
    
    let mut new_badge = old_badge.clone();
    new_badge.id = veil::types::B32::new([0xFF; 32]); // WRONG ID! Should match old badge
    new_badge.active_transactions = vec![active_tx];
    new_badge.last_update = current_block;
    
    let mut in_charms: Charms = BTreeMap::new();
    in_charms.insert(proposer_app.clone(), Data::from(&old_badge));
    
    let mut out_charms: Charms = BTreeMap::new();
    out_charms.insert(proposer_app.clone(), Data::from(&new_badge));
    
    let action = Action::AcceptProposal {
        proposal_id: veil::types::B32::new(proposal_id),
        proposer_badge_id: veil::types::B32::new(proposer_badge_id),
        value,
        category: TxCategory::Trade,
        window_blocks,
        report_window_blocks,
        current_block,
    };
    
    let tx = Transaction {
        ins: vec![
            (
                UtxoId::from_str("1111111111111111111111111111111111111111111111111111111111111111:0").unwrap(),
                in_charms.clone()
            )
        ],
        refs: vec![],
        outs: vec![out_charms.clone()],
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: {
            let mut map = BTreeMap::new();
            map.insert(proposer_app.clone(), Data::from(&action));
            map
        },
    };
    
    let x = Data::from(&action);
    let w = Data::empty();
    
    let result = veil::app_contract(&proposer_app, &tx, &x, &w);
    
    if result {
        panic!("❌ app_contract should have FAILED for changed badge ID!");
    } else {
        println!("✅ app_contract correctly REJECTED changed badge ID in AcceptProposal");
    }
}
