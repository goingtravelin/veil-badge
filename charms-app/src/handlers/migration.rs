use charms_sdk::data::{App, Transaction, B32 as AppB32};
use crate::types::*;
use super::{extract_input_badge, extract_output_badge};

// NOTE: No compile-time VK whitelist needed!
// 
// Security is guaranteed by the Charms prover:
// - The prover requires the WASM binary for each VK in a spell
// - If you can produce a valid proof, you have the matching binary
// - Having the binary proves the VK is legitimate
//
// Benefits of removing whitelist:
// - Builds are reproducible (no whitelist changes = no VK changes)
// - Can archive WASMs freely without affecting the binary
// - Simpler codebase

pub fn handle_migrate_out(app: &App, tx: &Transaction) -> bool {
    let badge_exists_in_input = extract_input_badge(app, tx).is_some();
    let badge_exists_in_output = extract_output_badge(app, tx).is_some();
    
    badge_exists_in_input && !badge_exists_in_output
}

fn extract_badge_from_old_app(tx: &Transaction, current_app: &App, old_vk: &[u8; 32]) -> Option<VeilBadge> {
    let old_app = App {
        tag: current_app.tag.clone(),
        identity: current_app.identity.clone(),
        vk: AppB32(*old_vk),
    };
    extract_input_badge(&old_app, tx)
}

pub fn handle_migrate_in(app: &App, tx: &Transaction, from_vk: B32) -> bool {
    // No whitelist check needed - prover validates the old WASM binary exists
    
    if extract_input_badge(app, tx).is_some() {
        return false;
    }
    
    let old_badge = match extract_badge_from_old_app(tx, app, &from_vk) {
        Some(badge) => badge,
        None => return false,
    };
    
    let new_badge = match extract_output_badge(app, tx) {
        Some(badge) => badge,
        None => return false,
    };
    
    if new_badge.schema_version != SCHEMA_VERSION {
        return false;
    }
    
    match old_badge.schema_version {
        0 => migrate_v0_to_current(&old_badge, &new_badge),
        1 => migrate_v1_to_current(&old_badge, &new_badge),
        _ => false,
    }
}

fn migrate_v0_to_current(old: &VeilBadge, new: &VeilBadge) -> bool {
    // v0 badges (minted before schema_version existed) default to 0
    // All core data must match exactly
    core_data_preserved(old, new)
}

fn migrate_v1_to_current(old: &VeilBadge, new: &VeilBadge) -> bool {
    // v1 -> v1 is just a VK upgrade, all data must match
    core_data_preserved(old, new)
}

fn core_data_preserved(old: &VeilBadge, new: &VeilBadge) -> bool {
    // IDENTITY - prevents spoofing/hijacking
    old.id == new.id
        && old.pubkey == new.pubkey
        && old.created_at == new.created_at
    
    // AGGREGATES - prevents inflation
        && old.tx_total == new.tx_total
        && old.tx_positive == new.tx_positive
        && old.tx_negative == new.tx_negative
        && old.volume_total == new.volume_total
        && old.volume_sum_squares == new.volume_sum_squares
        && old.window_tx_count == new.window_tx_count
        && old.window_volume == new.window_volume
        && old.window_start == new.window_start
        && old.counterparty_count == new.counterparty_count
        && old.cascade_damage == new.cascade_damage
    
    // COMPLEX STATE - preserves relationships
        && old.backing == new.backing
        && old.vouches_out == new.vouches_out
        && old.vouches_in == new.vouches_in
        && old.active_transactions == new.active_transactions
        && old.reporting_transactions == new.reporting_transactions
        && old.outcomes == new.outcomes
        && old.last_nonce == new.last_nonce
        && old.last_update == new.last_update
    
    // RECOMPUTABLE - allowed to differ
    // trust, risk, flags are recalculated with new formulas
}

