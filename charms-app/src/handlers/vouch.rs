use charms_sdk::data::{App, Transaction};
use crate::types::*;
use crate::validation;
use super::extract_badge_transition;

pub fn handle_vouch(
    app: &App,
    tx: &Transaction,
    target_badge_id: B32,
    stake_percent: u8,
    unlock_delay_blocks: u64,
    current_block: u64,
    witness: VouchWitness,
) -> bool {
    let (old_voucher, new_voucher) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    validation::validate_vouch(
        &old_voucher,
        &new_voucher,
        target_badge_id,
        stake_percent,
        unlock_delay_blocks,
        current_block,
        &witness,
    )
}

pub fn handle_unvouch(
    app: &App,
    tx: &Transaction,
    target_badge_id: B32,
    current_block: u64,
) -> bool {
    let (old_voucher, new_voucher) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    validation::validate_unvouch(&old_voucher, &new_voucher, target_badge_id, current_block)
}

pub fn handle_receive_vouch(
    app: &App,
    tx: &Transaction,
    voucher_badge_id: B32,
    stake_percent: u8,
    vouch_created_at: u64,
    vouch_unlock_at: u64,
    current_block: u64,
) -> bool {
    let (old_target, new_target) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    validation::validate_receive_vouch(
        &old_target,
        &new_target,
        voucher_badge_id,
        stake_percent,
        vouch_created_at,
        vouch_unlock_at,
        current_block,
    )
}

pub fn handle_lose_vouch(
    app: &App,
    tx: &Transaction,
    voucher_badge_id: B32,
) -> bool {
    let (old_target, new_target) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    let current_block = 0;

    validation::validate_lose_vouch(&old_target, &new_target, voucher_badge_id, current_block)
}

pub fn handle_cascade(
    app: &App,
    tx: &Transaction,
    source_badge_id: B32,
    damage: u64,
    current_block: u64,
    witness: CascadeWitness,
) -> bool {
    let (old_target, new_target) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    validation::validate_cascade(&old_target, &new_target, source_badge_id, damage, &witness, current_block)
}
