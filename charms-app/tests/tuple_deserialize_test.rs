// Test deserialization of the (App, Transaction, Data, Data) tuple that the prover sends
// Run with: cd charms-app && cargo test tuple_deserialize --release -- --nocapture

#[cfg(test)]
mod tuple_deserialize_test {
    use charms_data::{App, Transaction, Data, UtxoId, Charms, TxId, B32 as AppB32};
    use std::collections::BTreeMap;
    
    /// Test that we can deserialize the tuple format that the prover sends
    #[test]
    fn test_tuple_serialization_roundtrip() {
        println!("=== Testing (App, Transaction, Data, Data) tuple ===\n");
        
        // Create a simple App
        let app = App {
            tag: 'n',
            identity: AppB32::from_str("17174d5381653821041b8baa6f908de2d091c3154ba073f1b94053d84baf2d08").unwrap(),
            vk: AppB32::from_str("472bdc9a8ace709bdfe34c33a0446a84efbbb5020b83ae686f664815725d38cd").unwrap(),
        };
        println!("Created App: {:?}", app);
        
        // Create badge state as Data (simulating what prover sends)
        let badge_json = serde_json::json!({
            "id": "17174d5381653821041b8baa6f908de2d091c3154ba073f1b94053d84baf2d08",
            "created_at": 117197,
            "pubkey": "02c46a17827abc6e42b6df542ef3c30091630ae81b3115d29e037376287d086b33",
            "tx_total": 0,
            "tx_positive": 0,
            "tx_negative": 0,
            "volume_total": 0,
            "volume_sum_squares": 0,
            "window_tx_count": 0,
            "window_volume": 0,
            "window_start": 117197,
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
            "risk": 35,
            "flags": 36,
            "last_nonce": "0000000000000000000000000000000000000000000000000000000000000000",
            "last_update": 117197
        });
        
        // Convert JSON to CBOR Value (simulating prover conversion)
        let cbor_value = json_to_cbor(&badge_json);
        let badge_data = Data::from(&cbor_value);
        println!("Created badge Data: {} bytes", badge_data.bytes().len());
        
        // Create Transaction with badge in ins and outs
        let utxo_id = UtxoId::from_str("0bcbf9014bea549e3d73d732d82cf564184e8462f4cd660c11f6500b6d37b365:0").unwrap();
        
        let mut in_charms: Charms = BTreeMap::new();
        in_charms.insert(app.clone(), badge_data.clone());
        
        let mut out_charms: Charms = BTreeMap::new();
        out_charms.insert(app.clone(), badge_data.clone());
        
        let tx = Transaction {
            ins: vec![(utxo_id, in_charms)],
            refs: vec![],
            outs: vec![out_charms],
            coin_ins: None,
            coin_outs: None,
            prev_txs: BTreeMap::new(),
            app_public_inputs: BTreeMap::new(),
        };
        println!("Created Transaction");
        
        // Create public args (x) - the Action
        let action_json = serde_json::json!({
            "Transfer": null
        });
        let action_cbor = json_to_cbor(&action_json);
        let x = Data::from(&action_cbor);
        println!("Created public args (x): {} bytes", x.bytes().len());
        
        // Create private args (w) - empty for Transfer
        let w = Data::empty();
        
        // Create the tuple
        let tuple = (app.clone(), tx, x, w);
        
        // Serialize to CBOR
        let mut cbor_bytes = Vec::new();
        ciborium::into_writer(&tuple, &mut cbor_bytes).expect("serialize tuple");
        println!("\nSerialized tuple to {} bytes", cbor_bytes.len());
        
        // Deserialize back (this is what the WASM main! does)
        println!("\nDeserializing tuple...");
        let (app2, tx2, x2, w2): (App, Transaction, Data, Data) = 
            ciborium::from_reader(&cbor_bytes[..]).expect("deserialize tuple");
        
        println!("✅ Successfully deserialized tuple!");
        println!("  App tag: {}", app2.tag as char);
        println!("  Transaction ins: {}", tx2.ins.len());
        println!("  Transaction outs: {}", tx2.outs.len());
        println!("  x (public args): {} bytes", x2.bytes().len());
        println!("  w (private args): {} bytes", w2.bytes().len());
        
        // Now try to deserialize the Action from x
        use veil::types::Action;
        let action: Action = x2.value().expect("deserialize Action from x");
        println!("\nDeserialized Action: {:?}", action);
    }
    
    fn json_to_cbor(json: &serde_json::Value) -> ciborium::Value {
        match json {
            serde_json::Value::Null => ciborium::Value::Null,
            serde_json::Value::Bool(b) => ciborium::Value::Bool(*b),
            serde_json::Value::Number(n) => {
                if let Some(i) = n.as_i64() {
                    ciborium::Value::Integer(i.into())
                } else if let Some(u) = n.as_u64() {
                    ciborium::Value::Integer(u.into())
                } else if let Some(f) = n.as_f64() {
                    ciborium::Value::Float(f)
                } else {
                    panic!("unsupported number")
                }
            },
            serde_json::Value::String(s) => ciborium::Value::Text(s.clone()),
            serde_json::Value::Array(arr) => {
                ciborium::Value::Array(arr.iter().map(json_to_cbor).collect())
            },
            serde_json::Value::Object(obj) => {
                ciborium::Value::Map(
                    obj.iter()
                        .map(|(k, v)| (ciborium::Value::Text(k.clone()), json_to_cbor(v)))
                        .collect()
                )
            },
        }
    }
    
    use std::str::FromStr;
}
