// Test AcceptProposal validation
// Run with: cd charms-app && cargo test accept_proposal_debug --release -- --nocapture

#[cfg(test)]
mod accept_proposal_debug {
    use veil::types::*;
    use veil::types::proposal::*;
    use veil::handlers::handle_accept_proposal;
    use charms_data::{App, Transaction, Data, UtxoId, Charms};
    use std::collections::BTreeMap;

    fn create_test_badge(id_byte: u8, created_at: u64) -> VeilBadge {
        let mut id_bytes = [0u8; 32];
        id_bytes[0] = id_byte;
        
        VeilBadge {
            schema_version: SCHEMA_VERSION,
            id: B32(id_bytes),
            created_at,
            pubkey: [2u8; 33], // Compressed pubkey starting with 02
            tx_total: 0,
            tx_positive: 0,
            tx_negative: 0,
            volume_total: 0,
            volume_sum_squares: 0,
            window_tx_count: 0,
            window_volume: 0,
            window_start: created_at,
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
            last_nonce: B32::zero(),
            last_update: created_at,
        }
    }

    fn hex_to_b32(hex: &str) -> B32 {
        let bytes = hex::decode(hex).expect("valid hex");
        let arr: [u8; 32] = bytes.try_into().expect("32 bytes");
        B32(arr)
    }

    #[test]
    fn test_accept_proposal_with_real_data() {
        // Using the actual data from the browser logs
        let proposal_id = hex_to_b32("1ff16a48590d815f79e2c01226db95bf9a8c357d35b00829cd4ab00087193d23");
        let proposer_badge_id = hex_to_b32("7fc4ef288574feb2895d4999176a4f1816308b9d6bb44dba457df3c59e1133e3");
        let my_badge_id = hex_to_b32("17174d5381653821041b8baa6f908de2d091c3154ba073f1b94053d84baf2d08");
        
        let value: u64 = 100000;
        let category = TxCategory::Trade;
        let window_blocks: u32 = 144;
        let report_window_blocks: u32 = 432;
        let current_block: u64 = 117211;
        let created_at: u64 = 117197;

        // Create input badge (old state)
        let mut old_badge = VeilBadge {
            schema_version: SCHEMA_VERSION,
            id: my_badge_id,
            created_at,
            pubkey: hex::decode("02c46a17827abc6e42b6df542ef3c30091630ae81b3115d29e037376287d086b33")
                .unwrap()
                .try_into()
                .unwrap(),
            tx_total: 0,
            tx_positive: 0,
            tx_negative: 0,
            volume_total: 0,
            volume_sum_squares: 0,
            window_tx_count: 0,
            window_volume: 0,
            window_start: created_at,
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
            flags: RiskFlags::from_bits(36).unwrap_or_default(),
            last_nonce: B32::zero(),
            last_update: created_at,
        };

        // Create output badge (new state) - should have the active transaction
        let window_ends_at = current_block + window_blocks as u64;
        let report_deadline = window_ends_at + report_window_blocks as u64;
        
        let active_tx = ActiveTransaction {
            id: proposal_id,
            counterparty_badge_id: proposer_badge_id,
            value,
            category,
            started_at: current_block as u32,
            window_ends_at: window_ends_at as u32,
            report_deadline: report_deadline as u32,
            i_am_proposer: false,
        };

        let mut new_badge = old_badge.clone();
        new_badge.active_transactions.push(active_tx);
        new_badge.last_update = current_block;

        println!("Old badge: {:?}", old_badge);
        println!("New badge: {:?}", new_badge);
        println!("Proposal ID: {:?}", proposal_id);
        println!("Proposer badge ID: {:?}", proposer_badge_id);

        // Test the validation directly
        // Note: We can't easily create App/Transaction without the charms_data internals,
        // so let's test the components
        
        // Check identity
        assert_eq!(old_badge.id, new_badge.id, "Badge ID should match");
        assert_eq!(old_badge.pubkey, new_badge.pubkey, "Pubkey should match");

        // Check transaction was added
        assert!(new_badge.active_transactions.iter().any(|tx| tx.id == proposal_id), 
            "Should have active transaction");

        // Check old badge didn't have it
        assert!(!old_badge.active_transactions.iter().any(|tx| tx.id == proposal_id),
            "Old badge shouldn't have transaction");

        println!("✅ All local validations pass!");
    }

    #[test]
    fn test_serialization_roundtrip() {
        // Test that the Action enum deserializes correctly
        let action_json = r#"{
            "AcceptProposal": {
                "proposal_id": "1ff16a48590d815f79e2c01226db95bf9a8c357d35b00829cd4ab00087193d23",
                "proposer_badge_id": "7fc4ef288574feb2895d4999176a4f1816308b9d6bb44dba457df3c59e1133e3",
                "value": 100000,
                "category": "Trade",
                "window_blocks": 144,
                "report_window_blocks": 432,
                "current_block": 117211
            }
        }"#;

        println!("Deserializing action JSON...");
        let action: Result<Action, _> = serde_json::from_str(action_json);
        
        match action {
            Ok(a) => {
                println!("✅ Action deserialized successfully: {:?}", a);
                match a {
                    Action::AcceptProposal { proposal_id, proposer_badge_id, value, category, window_blocks, report_window_blocks, current_block } => {
                        println!("  proposal_id: {:?}", proposal_id);
                        println!("  proposer_badge_id: {:?}", proposer_badge_id);
                        println!("  value: {}", value);
                        println!("  category: {:?}", category);
                        println!("  window_blocks: {}", window_blocks);
                        println!("  report_window_blocks: {}", report_window_blocks);
                        println!("  current_block: {}", current_block);
                    }
                    _ => panic!("Wrong action variant"),
                }
            }
            Err(e) => {
                println!("❌ Action deserialization FAILED: {}", e);
                panic!("Deserialization failed");
            }
        }
    }

    #[test]
    fn test_badge_serialization() {
        // Test VeilBadge serialization
        let badge_json = r#"{
            "schema_version": 1,
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

        println!("Deserializing badge JSON...");
        let badge: Result<VeilBadge, _> = serde_json::from_str(badge_json);
        
        match badge {
            Ok(b) => {
                println!("✅ Badge deserialized successfully");
                println!("  id: {:?}", b.id);
                println!("  created_at: {}", b.created_at);
                println!("  trust: {}", b.trust);
                println!("  risk: {}", b.risk);
                println!("  flags: {:?}", b.flags);
            }
            Err(e) => {
                println!("❌ Badge deserialization FAILED: {}", e);
                panic!("Deserialization failed: {}", e);
            }
        }
    }

    #[test]
    fn test_active_transaction_serialization() {
        let tx_json = r#"{
            "id": "1ff16a48590d815f79e2c01226db95bf9a8c357d35b00829cd4ab00087193d23",
            "counterparty_badge_id": "7fc4ef288574feb2895d4999176a4f1816308b9d6bb44dba457df3c59e1133e3",
            "value": 100000,
            "category": "Trade",
            "started_at": 117211,
            "window_ends_at": 117355,
            "report_deadline": 117787,
            "i_am_proposer": false
        }"#;

        println!("Deserializing ActiveTransaction JSON...");
        let tx: Result<ActiveTransaction, _> = serde_json::from_str(tx_json);
        
        match tx {
            Ok(t) => {
                println!("✅ ActiveTransaction deserialized successfully: {:?}", t);
            }
            Err(e) => {
                println!("❌ ActiveTransaction deserialization FAILED: {}", e);
                panic!("Deserialization failed: {}", e);
            }
        }
    }
}
