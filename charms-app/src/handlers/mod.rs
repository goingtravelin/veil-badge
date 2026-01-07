pub mod badge;
pub mod migration;
pub mod proposal;
pub mod transaction;
pub mod vouch;

pub use badge::*;
pub use migration::*;
pub use proposal::*;
pub use transaction::*;
pub use vouch::*;

use charms_sdk::data::{App, Transaction};
use crate::types::VeilBadge;

pub fn extract_input_badge(app: &App, tx: &Transaction) -> Option<VeilBadge> {
    // Iterate through ALL inputs to find the one containing this app's data
    // This is necessary for multi-app atomic transactions where different apps
    // have their data in different input indices
    for (_, charm_data) in &tx.ins {
        if let Some(badge) = charm_data.get(app).and_then(|d| d.value().ok()) {
            return Some(badge);
        }
    }
    None
}

pub fn extract_output_badge(app: &App, tx: &Transaction) -> Option<VeilBadge> {
    // Iterate through ALL outputs to find the one containing this app's data
    // This is necessary for multi-app atomic transactions where different apps
    // have their data in different output indices
    for charm_data in &tx.outs {
        if let Some(badge) = charm_data.get(app).and_then(|d| d.value().ok()) {
            return Some(badge);
        }
    }
    None
}

pub fn extract_badge_transition(app: &App, tx: &Transaction) -> Option<(VeilBadge, VeilBadge)> {
    let old_badge = extract_input_badge(app, tx)?;
    let new_badge = extract_output_badge(app, tx)?;
    Some((old_badge, new_badge))
}

pub fn has_valid_io(tx: &Transaction) -> bool {
    !tx.ins.is_empty() && !tx.outs.is_empty()
}
