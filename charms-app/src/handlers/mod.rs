pub mod badge;
pub mod proposal;
pub mod transaction;
pub mod vouch;

pub use badge::*;
pub use proposal::*;
pub use transaction::*;
pub use vouch::*;

use charms_sdk::data::{App, Transaction};
use crate::types::VeilBadge;

pub fn extract_input_badge(app: &App, tx: &Transaction) -> Option<VeilBadge> {
    tx.ins.first()
        .and_then(|(_, charm_data)| charm_data.get(app))
        .and_then(|d| d.value().ok())
}

pub fn extract_output_badge(app: &App, tx: &Transaction) -> Option<VeilBadge> {
    tx.outs.first()
        .and_then(|charm_data| charm_data.get(app))
        .and_then(|d| d.value().ok())
}

pub fn extract_badge_transition(app: &App, tx: &Transaction) -> Option<(VeilBadge, VeilBadge)> {
    let old_badge = extract_input_badge(app, tx)?;
    let new_badge = extract_output_badge(app, tx)?;
    Some((old_badge, new_badge))
}

pub fn has_valid_io(tx: &Transaction) -> bool {
    !tx.ins.is_empty() && !tx.outs.is_empty()
}
