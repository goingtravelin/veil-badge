use charms_sdk::data::{App, Transaction};
use crate::types::*;
use crate::validation;
use super::{extract_output_badge, extract_badge_transition, has_valid_io};

pub fn handle_mint(app: &App, tx: &Transaction, pubkey: PubKey, current_block: u64) -> bool {
    if !has_valid_io(tx) {
        return false;
    }

    let genesis_utxo_id = &tx.ins[0].0;
    let genesis_string = genesis_utxo_id.to_string();
    let genesis_bytes = genesis_string.as_bytes();

    let new_badge: VeilBadge = match extract_output_badge(app, tx) {
        Some(b) => b,
        None => return false,
    };

    validation::validate_mint(genesis_bytes, pubkey, &new_badge, current_block)
}

pub fn handle_transfer(app: &App, tx: &Transaction) -> bool {
    let (input_badge, output_badge) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    validation::validate_transfer(&input_badge, &output_badge)
}
