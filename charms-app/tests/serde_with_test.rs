//! Test that serde_with hex serialization works correctly

use veil::*;
use serde_json;

#[test]
fn test_badge_hex_serialization() {
    // Create a test badge with known values
    let mut badge = VeilBadge::default();
    badge.id = B32::from([1u8; 32]);
    badge.pubkey = [2u8; 33];
    badge.created_at = 100;
    badge.tx_total = 5;
    
    // Serialize to JSON
    let json = serde_json::to_string_pretty(&badge).unwrap();
    
    // Verify hex encoding
    assert!(json.contains("\"pubkey\":"), "pubkey field should exist");
    assert!(json.contains("02020202"), "pubkey should be hex encoded");
    assert!(json.contains("\"id\":"), "id field should exist");
    assert!(json.contains("01010101"), "id should be hex encoded");
    
    // Deserialize back and verify
    let restored: VeilBadge = serde_json::from_str(&json).unwrap();
    assert_eq!(badge.id, restored.id);
    assert_eq!(badge.pubkey, restored.pubkey);
    assert_eq!(badge.created_at, restored.created_at);
    assert_eq!(badge.tx_total, restored.tx_total);
}

#[test]
fn test_action_hex_serialization() {
    use Action::*;
    
    let action = Mint {
        pubkey: [3u8; 33],
        current_block: 1000,
    };
    
    let json = serde_json::to_string(&action).unwrap();
    
    // Verify pubkey is hex encoded
    assert!(json.contains("03030303"), "pubkey in action should be hex encoded");
    
    // Deserialize back
    let restored: Action = serde_json::from_str(&json).unwrap();
    match restored {
        Mint { pubkey, current_block } => {
            assert_eq!(pubkey, [3u8; 33]);
            assert_eq!(current_block, 1000);
        }
        _ => panic!("Wrong action variant"),
    }
}

#[test]
fn test_vouch_badge_id_serialization() {
    let vouch = Vouch {
        badge_id: B32::from([5u8; 32]),
        stake_percent: 50,
        created_at: 1000,
        unlock_at: 2000,
    };
    
    let json = serde_json::to_string(&vouch).unwrap();
    
    // B32 should serialize correctly
    assert!(json.contains("badge_id"), "badge_id field should exist");
    
    let restored: Vouch = serde_json::from_str(&json).unwrap();
    assert_eq!(vouch.badge_id, restored.badge_id);
    assert_eq!(vouch.stake_percent, restored.stake_percent);
}
