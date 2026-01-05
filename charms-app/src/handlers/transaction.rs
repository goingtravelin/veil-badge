use charms_sdk::data::{App, Transaction};
use crate::types::*;
use crate::validation;
use super::extract_badge_transition;

pub fn handle_record(
    app: &App,
    tx: &Transaction,
    outcome: Outcome,
    value: u64,
    current_block: u64,
    witness: RecordWitness,
) -> bool {
    let (old_badge, new_badge) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    validation::validate_record(&old_badge, &new_badge, outcome, value, current_block, &witness)
}
