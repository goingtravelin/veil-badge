// Test that simulates the exact conversion path the prover uses:
// 1. Parse JSON spell into serde_json::Value
// 2. Convert serde_json::Value to ciborium::Value (strings stay as strings!)
// 3. Deserialize into our types
//
// Run with: cd charms-app && cargo test json_to_cbor_direct --release -- --nocapture

#[cfg(test)]
mod json_to_cbor_direct_test {
    use charms_data::Data;
    use veil::types::*;
    use veil::types::proposal::*;
    
    /// This test simulates what the prover does:
    /// 1. Receives JSON from client
    /// 2. Parses JSON into serde_json::Value  
    /// 3. Converts serde_json::Value → ciborium::Value (JSON-to-CBOR value conversion)
    /// 4. Wraps in Data and passes to WASM
    /// 5. WASM deserializes from Data
    ///
    /// The key insight is that when JSON is converted to CBOR Value,
    /// string values remain as strings (text), not converted to byte arrays.
    /// So "17174d5381..." becomes a CBOR text string, not a 32-byte array.
    #[test]
    fn test_json_to_cbor_direct_conversion() {
        // Badge JSON as the client sends it
        let badge_json = r#"{
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
        }"#;
        
        println!("=== Simulating Prover's JSON→CBOR Conversion ===\n");
        
        // Step 1: Parse JSON to serde_json::Value (this is what the prover does)
        let json_value: serde_json::Value = serde_json::from_str(badge_json)
            .expect("parse JSON");
        println!("Step 1: Parsed JSON to serde_json::Value");
        println!("  id type: {:?}", json_value.get("id").map(|v| v.is_string()));
        
        // Step 2: Convert serde_json::Value to ciborium::Value
        // This converts JSON structures to CBOR structures, but strings stay as strings
        let cbor_value: ciborium::Value = json_value_to_cbor_value(&json_value);
        println!("\nStep 2: Converted to ciborium::Value");
        
        // Step 3: Serialize ciborium::Value to CBOR bytes
        let mut cbor_bytes = Vec::new();
        ciborium::into_writer(&cbor_value, &mut cbor_bytes).expect("serialize to CBOR");
        println!("\nStep 3: Serialized to CBOR bytes");
        println!("  Length: {} bytes", cbor_bytes.len());
        println!("  First 50 bytes: {:?}", &cbor_bytes[..50.min(cbor_bytes.len())]);
        
        // Step 4: Deserialize from CBOR bytes into our VeilBadge type
        // This is what the WASM app does
        println!("\nStep 4: Deserializing into VeilBadge (what WASM does)...");
        let badge: VeilBadge = ciborium::from_reader(&cbor_bytes[..])
            .expect("deserialize VeilBadge from CBOR");
        
        println!("  ✅ Successfully deserialized!");
        println!("  id: {:?}", badge.id);
        println!("  pubkey: {:?}", &badge.pubkey[..4]);
        println!("  flags: {:?}", badge.flags);
    }
    
    /// Same test for Action (public_args)
    #[test]
    fn test_action_json_to_cbor_direct() {
        let action_json = r#"{
            "AcceptProposal": {
                "proposal_id": "17174d5381653821041b8baa6f908de2d091c3154ba073f1b94053d84baf2d08",
                "proposer_badge_id": "deadbeef00000000000000000000000000000000000000000000000000000001",
                "value": 100000,
                "category": "Trade",
                "window_blocks": 144,
                "report_window_blocks": 72,
                "current_block": 117200
            }
        }"#;
        
        println!("=== Testing Action JSON→CBOR direct conversion ===\n");
        
        // Step 1: Parse to serde_json::Value
        let json_value: serde_json::Value = serde_json::from_str(action_json)
            .expect("parse JSON");
        println!("Step 1: Parsed JSON");
        
        // Step 2: Convert to ciborium::Value  
        let cbor_value = json_value_to_cbor_value(&json_value);
        println!("Step 2: Converted to CBOR Value");
        
        // Step 3: Serialize to bytes
        let mut cbor_bytes = Vec::new();
        ciborium::into_writer(&cbor_value, &mut cbor_bytes).expect("serialize");
        println!("Step 3: CBOR bytes length: {}", cbor_bytes.len());
        
        // Step 4: Deserialize into Action
        println!("Step 4: Deserializing into Action...");
        let action: Action = ciborium::from_reader(&cbor_bytes[..])
            .expect("deserialize Action from CBOR");
        
        match action {
            Action::AcceptProposal { proposal_id, value, .. } => {
                println!("  ✅ Successfully deserialized AcceptProposal!");
                println!("  proposal_id: {:?}", proposal_id);
                println!("  value: {}", value);
            },
            _ => panic!("Wrong variant"),
        }
    }
    
    /// Test badge with active transactions (the actual AcceptProposal output)
    #[test]
    fn test_badge_with_active_tx_json_to_cbor_direct() {
        let badge_json = r#"{
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
            "active_transactions": [
                {
                    "id": "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
                    "counterparty_badge_id": "deadbeef00000000000000000000000000000000000000000000000000000001",
                    "value": 100000,
                    "category": "Trade",
                    "started_at": 117200,
                    "window_ends_at": 117344,
                    "report_deadline": 117416,
                    "i_am_proposer": false
                }
            ],
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
            "last_update": 117200
        }"#;
        
        println!("=== Testing Badge with ActiveTransaction JSON→CBOR ===\n");
        
        let json_value: serde_json::Value = serde_json::from_str(badge_json).expect("parse");
        let cbor_value = json_value_to_cbor_value(&json_value);
        
        let mut cbor_bytes = Vec::new();
        ciborium::into_writer(&cbor_value, &mut cbor_bytes).expect("serialize");
        println!("CBOR bytes: {} bytes", cbor_bytes.len());
        
        let badge: VeilBadge = ciborium::from_reader(&cbor_bytes[..])
            .expect("deserialize badge");
        
        println!("✅ Successfully deserialized badge with {} active transactions", 
            badge.active_transactions.len());
        
        if let Some(tx) = badge.active_transactions.first() {
            println!("  First tx id: {:?}", tx.id);
            println!("  First tx value: {}", tx.value);
        }
    }
    
    /// Helper function to convert serde_json::Value to ciborium::Value
    /// This mimics what the prover does when converting JSON to CBOR
    fn json_value_to_cbor_value(json: &serde_json::Value) -> ciborium::Value {
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
                    panic!("unsupported number type")
                }
            },
            serde_json::Value::String(s) => {
                // CRITICAL: Strings stay as text strings in CBOR!
                // They are NOT converted to byte arrays even if they look like hex
                ciborium::Value::Text(s.clone())
            },
            serde_json::Value::Array(arr) => {
                ciborium::Value::Array(arr.iter().map(json_value_to_cbor_value).collect())
            },
            serde_json::Value::Object(obj) => {
                ciborium::Value::Map(
                    obj.iter()
                        .map(|(k, v)| (ciborium::Value::Text(k.clone()), json_value_to_cbor_value(v)))
                        .collect()
                )
            },
        }
    }
}
