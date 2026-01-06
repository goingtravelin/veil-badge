/// Test that exactly simulates what the prover feeds to our WASM
/// The prover:
/// 1. Takes JSON request from user
/// 2. Converts JSON spell data to CBOR 
/// 3. Constructs (App, Transaction, Data, Data) tuple as CBOR
/// 4. Feeds it to WASM stdin
/// 
/// The WASM then:
/// 1. Deserializes (App, Transaction, Data, Data) using charms_data types
/// 2. Calls app_contract which does x.value::<Action>()

use charms_data::{App, Data, Transaction, B32 as CharmsB32};
use ciborium::Value as CborValue;
use serde::{Deserialize, Serialize};
use serde_json::json;
use veil::types::{B32, RiskFlags, VeilBadge};
use veil::types::proposal::{OutcomeAggregates, TxCategory};
use veil::types::backing::BackingAggregates;
use veil::types::Action;

/// Create a simple transfer action JSON
fn create_transfer_action_json() -> serde_json::Value {
    json!("Transfer")
}

/// Create an AcceptProposal action JSON (matches our spell)  
fn create_accept_proposal_json() -> serde_json::Value {
    json!({
        "AcceptProposal": {
            "proposal_id": "17174d5341f9c907ce6c91c5bf29b3a9a85c81748592393f1d5f6b0ba64a22f5",
            "proposer_badge_id": "27174d5341f9c907ce6c91c5bf29b3a9a85c81748592393f1d5f6b0ba64a22f5",  
            "value": 100000,
            "category": "Trade",
            "window_blocks": 144,
            "report_window_blocks": 288,
            "current_block": 1000
        }
    })
}

/// Test deserializing action from CBOR that came from JSON
#[test]
fn test_action_transfer_json_to_cbor() {
    // Step 1: Start with JSON (what user sends)
    let action_json = create_transfer_action_json();
    println!("Action JSON: {}", serde_json::to_string_pretty(&action_json).unwrap());
    
    // Step 2: Convert JSON to CBOR Value (what prover does)
    // In ciborium, we can't directly convert JSON to CBOR Value, 
    // so we serialize JSON -> bytes -> deserialize as CBOR Value
    let json_string = serde_json::to_string(&action_json).unwrap();
    
    // Parse JSON into ciborium Value via serde
    let cbor_value: CborValue = serde_json::from_str(&json_string).unwrap();
    println!("CBOR Value: {:?}", cbor_value);
    
    // Step 3: Wrap in Data (what prover does - Data is just a wrapper around Value)
    let data = Data::from(&action_json);
    
    // Step 4: Deserialize our Action from Data (what our app_contract does)
    let action: Action = data.value().expect("Should deserialize Transfer action");
    println!("Deserialized Action: {:?}", action);
    
    match action {
        Action::Transfer => println!("✅ Successfully got Transfer action"),
        _ => panic!("Expected Transfer action"),
    }
}

#[test]
fn test_action_accept_proposal_json_to_cbor() {
    // Step 1: Start with JSON (what user sends)
    let action_json = create_accept_proposal_json();
    println!("Action JSON: {}", serde_json::to_string_pretty(&action_json).unwrap());
    
    // Step 2: Wrap in Data (Data stores as ciborium Value internally)
    let data = Data::from(&action_json);
    
    // Step 3: Deserialize our Action from Data
    let action: Action = data.value().expect("Should deserialize AcceptProposal action");
    println!("Deserialized Action: {:?}", action);
    
    match action {
        Action::AcceptProposal { proposal_id, proposer_badge_id, value, category, .. } => {
            println!("✅ Successfully got AcceptProposal action");
            println!("  proposal_id: {}", hex::encode(proposal_id.0));
            println!("  proposer_badge_id: {}", hex::encode(proposer_badge_id.0));
            println!("  value: {}", value);
            assert_eq!(value, 100000);
        }
        _ => panic!("Expected AcceptProposal action"),
    }
}

/// Test the exact bytes that would be on the charm (VeilBadge as JSON then CBOR)
#[test] 
fn test_veilbadge_json_to_cbor() {
    // This is what the frontend sends as JSON for the badge charm data
    let badge_json = json!({
        "schema_version": 1,
        "id": "0000000000000000000000000000000000000000000000000000000000000000",
        "created_at": 1000,
        "pubkey": "020000000000000000000000000000000000000000000000000000000000000001",
        "tx_total": 0,
        "tx_positive": 0,
        "tx_negative": 0,
        "volume_total": 0,
        "volume_sum_squares": 0,
        "window_tx_count": 0,
        "window_volume": 0,
        "window_start": 0,
        "counterparty_count": 0,
        "backing": {
            "backed_count": 0,
            "unbacked_count": 0,
            "backed_volume": 0,
            "unbacked_volume": 0
        },
        "vouches_out": [],
        "vouches_in": [],
        "cascade_damage": 0,
        "active_transactions": [],
        "reporting_transactions": [],
        "outcomes": {
            "mutual_positive": 0,
            "mutual_negative": 0,
            "contested_i_positive": 0,
            "contested_i_negative": 0,
            "timeout": 0,
            "mutual_timeout": 0
        },
        "trust": 15,
        "risk": 15,
        "flags": 0,
        "last_nonce": "0000000000000000000000000000000000000000000000000000000000000000",
        "last_update": 0
    });
    
    println!("Badge JSON: {}", serde_json::to_string_pretty(&badge_json).unwrap());
    
    // Wrap in Data
    let data = Data::from(&badge_json);
    
    // Deserialize as VeilBadge
    let badge: VeilBadge = data.value().expect("Should deserialize VeilBadge");
    println!("Deserialized Badge: {:?}", badge);
    println!("✅ Successfully deserialized VeilBadge from JSON->CBOR");
}

/// Test what happens when we use proper CBOR encoding (not from JSON)
/// This tests the serialize_tuple path
#[test]
fn test_b32_native_cbor_roundtrip() {
    use veil::types::B32;
    
    let original = B32::new([0x17; 32]);
    
    // Serialize to CBOR bytes using ciborium
    let cbor_bytes = charms_data::util::write(&original).expect("serialize");
    println!("CBOR bytes ({} bytes): {:?}", cbor_bytes.len(), &cbor_bytes);
    
    // Deserialize back
    let decoded: B32 = charms_data::util::read(&cbor_bytes[..]).expect("deserialize");
    
    assert_eq!(original, decoded);
    println!("✅ Native CBOR roundtrip works");
}

/// Critical test: Simulate exactly what the prover does when it receives
/// our JSON ProveRequest and feeds CBOR to the WASM
#[test]
fn test_full_prover_simulation() {
    // The prover receives JSON like this (simplified):
    let json_input = json!({
        "spell": {
            "version": 8,
            "apps": {
                "veil": "n/0000000000000000000000000000000000000000000000000000000000000000/472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd"
            },
            "public_args": {
                "veil": {
                    "AcceptProposal": {
                        "proposal_id": "17174d5341f9c907ce6c91c5bf29b3a9a85c81748592393f1d5f6b0ba64a22f5",
                        "proposer_badge_id": "27174d5341f9c907ce6c91c5bf29b3a9a85c81748592393f1d5f6b0ba64a22f5",
                        "value": 100000,
                        "category": "Trade",
                        "window_blocks": 144,
                        "report_window_blocks": 288,
                        "current_block": 1000
                    }
                }
            }
        }
    });
    
    // Extract just the public_args.veil (the action)
    let action_json = &json_input["spell"]["public_args"]["veil"];
    println!("Action JSON: {}", serde_json::to_string_pretty(action_json).unwrap());
    
    // The prover wraps this in a Data
    let data = Data::from(action_json);
    
    // The WASM deserializes Action from Data
    let action: Action = data.value().expect("Should deserialize Action");
    println!("Deserialized Action: {:?}", action);
    
    match action {
        Action::AcceptProposal { proposal_id, .. } => {
            println!("✅ Successfully deserialized AcceptProposal");
            assert_eq!(
                hex::encode(proposal_id.0),
                "17174d5341f9c907ce6c91c5bf29b3a9a85c81748592393f1d5f6b0ba64a22f5"
            );
        }
        _ => panic!("Expected AcceptProposal"),
    }
}

/// Test deserializing the (App, Transaction, Data, Data) tuple
/// This is what charms_sdk::main! does
#[test]
fn test_main_tuple_deserialization() {
    use std::str::FromStr;
    
    // Create App (this is what charms-data expects)
    let app = App::from_str("n/0000000000000000000000000000000000000000000000000000000000000000/472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd")
        .expect("parse app");
    
    // Create a simple Transaction  
    let tx = Transaction {
        ins: vec![],
        refs: vec![],
        outs: vec![],
        coin_ins: None,
        coin_outs: None,
        prev_txs: std::collections::BTreeMap::new(),
        app_public_inputs: std::collections::BTreeMap::new(),
    };
    
    // Create Data for public input (x) - AcceptProposal action
    let action_json = create_accept_proposal_json();
    let x = Data::from(&action_json);
    
    // Create Data for witness (w) - empty
    let w = Data::from(&serde_json::Value::Null);
    
    // Serialize the tuple to CBOR
    let tuple = (&app, &tx, &x, &w);
    let cbor_bytes = charms_data::util::write(&tuple).expect("serialize tuple");
    println!("Tuple CBOR size: {} bytes", cbor_bytes.len());
    
    // Deserialize back (this is what main! does)
    let (app2, tx2, x2, w2): (App, Transaction, Data, Data) = 
        charms_data::util::read(&cbor_bytes[..]).expect("deserialize tuple");
    
    // Now deserialize Action from x2 (this is what our app_contract does)
    let action: Action = x2.value().expect("Should deserialize Action from Data");
    
    match action {
        Action::AcceptProposal { proposal_id, .. } => {
            println!("✅ Successfully deserialized Action from tuple->Data");
            println!("  proposal_id: {}", hex::encode(proposal_id.0));
        }
        _ => panic!("Expected AcceptProposal"),
    }
}
