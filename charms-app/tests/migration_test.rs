//! Migration Handler Tests
//!
//! Tests for badge migration between VK versions:
//! - MigrateOut: validates badge is being transferred out
//! - MigrateIn: validates badge data preserved during migration
//!
//! Note: VK whitelist checking was removed - security is enforced by the
//! Charms prover which requires the actual WASM binary for each VK.

mod common;

use veil::*;
use veil::handlers::migration::{handle_migrate_out, handle_migrate_in};
use charms_sdk::data::{App, B32 as AppB32, Charms, Transaction, UtxoId};
use std::collections::BTreeMap;
use common::*;

// Whitelisted VK for tests (must match one in migration.rs)
const TEST_OLD_VK: [u8; 32] = [
    0xa1, 0xde, 0x11, 0x74, 0x1b, 0x88, 0x7c, 0x47,
    0xd8, 0x42, 0x61, 0x11, 0x37, 0xdd, 0xb9, 0x22,
    0x18, 0x82, 0x38, 0xc1, 0x88, 0xb5, 0xd1, 0xfb,
    0x43, 0x3a, 0xf9, 0xa0, 0x58, 0x49, 0xc7, 0x82,
];

const TEST_NEW_VK: [u8; 32] = [0x99; 32]; // Current VK (arbitrary for tests)

fn make_old_app(badge_id: &B32) -> App {
    App {
        tag: 'n',
        identity: AppB32(badge_id.0),
        vk: AppB32(TEST_OLD_VK),
    }
}

fn make_new_app(badge_id: &B32) -> App {
    App {
        tag: 'n',
        identity: AppB32(badge_id.0),
        vk: AppB32(TEST_NEW_VK),
    }
}

/// Helper to build a Transaction for migration tests
fn make_tx(ins: Vec<(UtxoId, Charms)>, outs: Vec<Charms>) -> Transaction {
    Transaction {
        ins,
        refs: vec![],
        outs,
        coin_ins: None,
        coin_outs: None,
        prev_txs: BTreeMap::new(),
        app_public_inputs: BTreeMap::new(),
    }
}

// ============================================================================
// MIGRATE OUT TESTS
// ============================================================================

#[test]
fn test_migrate_out_success() {
    let badge = make_minted_badge(100_000);
    let old_app = make_old_app(&badge.id);
    
    // Input has badge, output is empty (badge transferred out)
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &badge))],
        vec![BTreeMap::new()],
    );
    
    assert!(handle_migrate_out(&old_app, &tx));
}

#[test]
fn test_migrate_out_fails_no_input_badge() {
    let badge = make_minted_badge(100_000);
    let old_app = make_old_app(&badge.id);
    
    // No badge in input
    let tx = make_tx(
        vec![(make_utxo(1, 0), BTreeMap::new())],
        vec![BTreeMap::new()],
    );
    
    assert!(!handle_migrate_out(&old_app, &tx));
}

#[test]
fn test_migrate_out_fails_badge_still_in_output() {
    let badge = make_minted_badge(100_000);
    let old_app = make_old_app(&badge.id);
    
    // Badge exists in both input and output (not a transfer out)
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &badge))],
        vec![wrap_badge(&old_app, &badge)],
    );
    
    assert!(!handle_migrate_out(&old_app, &tx));
}

// ============================================================================
// MIGRATE IN TESTS - Success Cases
// ============================================================================

#[test]
fn test_migrate_in_success_v1_badge() {
    let mut badge = make_minted_badge(100_000);
    badge.schema_version = 1; // v1 badge
    
    let old_app = make_old_app(&badge.id);
    let new_app = make_new_app(&badge.id);
    
    // Old badge in input (under old VK), same badge in output (under new VK)
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &badge))],
        vec![wrap_badge(&new_app, &badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_success_v0_legacy_badge() {
    let mut old_badge = make_minted_badge(100_000);
    old_badge.schema_version = 0; // Legacy v0 badge (no schema_version field)
    
    // Output badge MUST have current schema version
    let mut new_badge = old_badge.clone();
    new_badge.schema_version = SCHEMA_VERSION; // Upgraded to v1
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_allows_trust_change() {
    let mut old_badge = make_minted_badge(100_000);
    old_badge.schema_version = 1;
    old_badge.trust = 50;
    old_badge.risk = 25;
    old_badge.flags = RiskFlags::empty();
    
    let mut new_badge = old_badge.clone();
    new_badge.trust = 65; // Different trust (recalculated)
    new_badge.risk = 15;  // Different risk
    new_badge.flags = RiskFlags::ISOLATED; // Different flags
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(handle_migrate_in(&new_app, &tx, from_vk));
}

// ============================================================================
// MIGRATE IN TESTS - Security Rejections (Data Integrity)
// ============================================================================
// Note: VK whitelist tests removed - prover enforces binary existence

#[test]
fn test_migrate_in_rejects_inflated_tx_total() {
    let mut old_badge = make_minted_badge(100_000);
    old_badge.schema_version = 1;
    old_badge.tx_total = 10;
    
    let mut new_badge = old_badge.clone();
    new_badge.tx_total = 100; // INFLATED!
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_rejects_inflated_volume() {
    let mut old_badge = make_minted_badge(100_000);
    old_badge.schema_version = 1;
    old_badge.volume_total = 1_000_000;
    
    let mut new_badge = old_badge.clone();
    new_badge.volume_total = 999_999_999; // INFLATED!
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_rejects_changed_id() {
    let mut old_badge = make_minted_badge(100_000);
    old_badge.schema_version = 1;
    
    let mut new_badge = old_badge.clone();
    new_badge.id = B32([0xaa; 32]); // Different ID!
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_rejects_changed_pubkey() {
    let mut old_badge = make_minted_badge(100_000);
    old_badge.schema_version = 1;
    
    let mut new_badge = old_badge.clone();
    new_badge.pubkey = [0xbb; 33]; // Different pubkey!
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_rejects_removed_vouch() {
    let mut old_badge = make_established_badge(100_000);
    old_badge.schema_version = 1;
    old_badge.vouches_out = vec![Vouch {
        badge_id: B32([0x11; 32]),
        stake_percent: 25,
        created_at: 50_000,
        unlock_at: 150_000,
    }];
    
    let mut new_badge = old_badge.clone();
    new_badge.vouches_out = vec![]; // Vouch removed!
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_rejects_no_old_badge_in_input() {
    let mut badge = make_minted_badge(100_000);
    badge.schema_version = 1;
    
    let new_app = make_new_app(&badge.id);
    
    // No badge in input (trying to create badge from nothing)
    let tx = make_tx(
        vec![(make_utxo(1, 0), BTreeMap::new())],
        vec![wrap_badge(&new_app, &badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_rejects_badge_already_in_new_app_input() {
    let mut badge = make_minted_badge(100_000);
    badge.schema_version = 1;
    
    let old_app = make_old_app(&badge.id);
    let new_app = make_new_app(&badge.id);
    
    // Badge exists in new app's input slot (not a migration)
    let mut input_charms = wrap_badge(&old_app, &badge);
    input_charms.extend(wrap_badge(&new_app, &badge));
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), input_charms)],
        vec![wrap_badge(&new_app, &badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_migrate_in_rejects_unknown_schema_version() {
    let mut old_badge = make_minted_badge(100_000);
    old_badge.schema_version = 99; // Unknown version
    
    let new_badge = old_badge.clone();
    
    let old_app = make_old_app(&old_badge.id);
    let new_app = make_new_app(&old_badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &old_badge))],
        vec![wrap_badge(&new_app, &new_badge)],
    );
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(!handle_migrate_in(&new_app, &tx, from_vk));
}

// ============================================================================
// ATOMIC MIGRATION TESTS (Both MigrateOut + MigrateIn in same tx)
// ============================================================================

#[test]
fn test_atomic_migration_both_handlers_succeed() {
    let mut badge = make_established_badge(100_000);
    badge.schema_version = 1;
    
    let old_app = make_old_app(&badge.id);
    let new_app = make_new_app(&badge.id);
    
    // Old badge in input (old VK), same badge in output (new VK)
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &badge))],
        vec![wrap_badge(&new_app, &badge)],
    );
    
    // MigrateOut sees: badge exists in input, not in output (for old app)
    assert!(handle_migrate_out(&old_app, &tx));
    
    // MigrateIn sees: no badge in new app input, badge from old VK matches output
    let from_vk = B32(TEST_OLD_VK);
    assert!(handle_migrate_in(&new_app, &tx, from_vk));
}

#[test]
fn test_atomic_migration_preserves_complex_state() {
    let mut badge = make_established_badge(100_000);
    badge.schema_version = 1;
    badge.vouches_out = vec![
        Vouch {
            badge_id: B32([0x11; 32]),
            stake_percent: 25,
            created_at: 50_000,
            unlock_at: 150_000,
        },
        Vouch {
            badge_id: B32([0x22; 32]),
            stake_percent: 10,
            created_at: 60_000,
            unlock_at: 160_000,
        },
    ];
    badge.vouches_in = vec![
        Vouch {
            badge_id: B32([0x33; 32]),
            stake_percent: 15,
            created_at: 70_000,
            unlock_at: 170_000,
        },
    ];
    
    let old_app = make_old_app(&badge.id);
    let new_app = make_new_app(&badge.id);
    
    let tx = make_tx(
        vec![(make_utxo(1, 0), wrap_badge(&old_app, &badge))],
        vec![wrap_badge(&new_app, &badge)],
    );
    
    assert!(handle_migrate_out(&old_app, &tx));
    
    let from_vk = B32(TEST_OLD_VK);
    assert!(handle_migrate_in(&new_app, &tx, from_vk));
}
