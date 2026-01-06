// Test serde_with::Hex with CBOR
// Run with: cd charms-app && cargo test test_pubkey_cbor --release -- --nocapture

#[cfg(test)]
mod pubkey_cbor_test {
    use charms_data::Data;
    use serde::{Serialize, Deserialize};
    use serde_with::{serde_as, hex::Hex};

    // Replicate exactly what VeilBadge does with pubkey
    #[serde_as]
    #[derive(Debug, Serialize, Deserialize, PartialEq)]
    struct TestPubKey {
        #[serde_as(as = "Hex")]
        pubkey: [u8; 33],
    }

    #[test]
    fn test_pubkey_json_to_data_roundtrip() {
        // This is what the prover does: JSON -> our struct -> CBOR
        let json = r#"{"pubkey": "02c46a17827abc6e42b6df542ef3c30091630ae81b3115d29e037376287d086b33"}"#;
        
        // Parse JSON
        let test: TestPubKey = serde_json::from_str(json).expect("parse json");
        println!("Parsed from JSON: {:?}", test);
        println!("Pubkey bytes: {:?}", test.pubkey);
        
        // Convert to Data (CBOR)
        let data = Data::from(&test);
        println!("Converted to Data: OK");
        
        // Get bytes for debugging
        let bytes = data.bytes();
        println!("CBOR bytes length: {}", bytes.len());
        println!("CBOR bytes: {:?}", bytes);
        
        // Deserialize from Data
        let result: TestPubKey = data.value().expect("from Data");
        println!("Deserialized from Data: {:?}", result);
        
        assert_eq!(test, result);
        println!("✅ PubKey roundtrip successful!");
    }
}
