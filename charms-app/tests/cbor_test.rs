// Test CBOR serialization of VeilBadge
// Run with: cd charms-app && cargo test test_full_badge --release -- --nocapture

#[cfg(test)]
mod cbor_test {
    use charms_data::Data;
    use serde::{Serialize, Deserialize};

    #[derive(Debug, Serialize, Deserialize, PartialEq)]
    struct TestU128 {
        value: u128,
    }

    #[test]
    fn test_u128_charms_data_roundtrip() {
        let test = TestU128 { value: 0 };
        
        // Serialize to Data (which uses CBOR internally)
        let data = Data::from(&test);
        println!("Data created: OK");
        
        // Deserialize back
        let result: TestU128 = data.value().expect("deserialize");
        println!("Result: {:?}", result);
        
        assert_eq!(test, result);
    }

    #[test]
    fn test_badge_charms_data_roundtrip() {
        use veil::types::*;
        
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

        // Parse JSON
        let badge: VeilBadge = serde_json::from_str(badge_json).expect("parse json");
        println!("Parsed badge from JSON: OK");
        println!("  volume_sum_squares: {}", badge.volume_sum_squares);
        
        // Convert to Data (CBOR)
        let data = Data::from(&badge);
        println!("Converted to Data (CBOR): OK");
        
        // Get the bytes to see what's being serialized
        let bytes = data.bytes();
        println!("CBOR bytes length: {}", bytes.len());
        println!("First 50 bytes: {:?}", &bytes[..bytes.len().min(50)]);
        
        // Deserialize from Data
        let result: VeilBadge = data.value().expect("from Data");
        println!("Deserialized from Data: OK");
        println!("  volume_sum_squares: {}", result.volume_sum_squares);
        
        assert_eq!(badge, result);
        println!("✅ Badge Data roundtrip successful!");
    }
}
