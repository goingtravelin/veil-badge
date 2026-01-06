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
