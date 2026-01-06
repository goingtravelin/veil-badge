
use charms_sdk::data::{App, Transaction};
use crate::types::*;
use crate::types::proposal::*;
use super::extract_badge_transition;

pub fn handle_accept_proposal(
    app: &App,
    tx: &Transaction,
    proposal_id: B32,
    proposer_badge_id: B32,
    value: u64,
    category: TxCategory,
    window_blocks: u32,
    report_window_blocks: u32,
    current_block: u64,
) -> bool {
    let (old_badge, new_badge) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    // Derive is_proposer from badge ID - no need to pass as parameter
    let is_proposer = old_badge.id == proposer_badge_id;

    validate_accept_proposal(
        &old_badge,
        &new_badge,
        proposal_id,
        proposer_badge_id,
        value,
        category,
        window_blocks,
        report_window_blocks,
        current_block,
        is_proposer,
    )
}

/// Validates that badge identity (id and pubkey) remains unchanged.
fn badge_identity_matches(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    old_badge.id == new_badge.id && old_badge.pubkey == new_badge.pubkey
}

fn validate_accept_proposal(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    proposal_id: B32,
    proposer_badge_id: B32,
    value: u64,
    category: TxCategory,
    window_blocks: u32,
    report_window_blocks: u32,
    current_block: u64,
    is_proposer: bool,
) -> bool {
    if !badge_identity_matches(old_badge, new_badge) {
        return false;
    }

    let window_ends_at = current_block.saturating_add(window_blocks as u64);
    let report_deadline = window_ends_at.saturating_add(report_window_blocks as u64);

    // For proposer: counterparty is the acceptor (we don't know their ID here, check from new_badge)
    // For acceptor: counterparty is the proposer
    let counterparty_badge_id = if is_proposer {
        // Get acceptor's badge ID from the active transaction in new_badge
        // The proposer's counterparty is whoever accepted (not themselves)
        match new_badge.active_transactions.iter().find(|tx| tx.id == proposal_id) {
            Some(tx) => tx.counterparty_badge_id,
            None => return false, // No active tx found
        }
    } else {
        proposer_badge_id
    };

    let expected_active_tx = ActiveTransaction {
        id: proposal_id,
        counterparty_badge_id,
        value,
        category,
        started_at: current_block as u32,
        window_ends_at: window_ends_at as u32,
        report_deadline: report_deadline as u32,
        i_am_proposer: is_proposer,
    };

    let has_active_tx = new_badge.active_transactions.iter()
        .any(|tx| tx.id == expected_active_tx.id);

    if !has_active_tx {
        return false;
    }

    let already_had_tx = old_badge.active_transactions.iter()
        .any(|tx| tx.id == proposal_id);

    if already_had_tx {
        return false;
    }

    if old_badge.tx_total != new_badge.tx_total ||
       old_badge.tx_positive != new_badge.tx_positive ||
       old_badge.tx_negative != new_badge.tx_negative ||
       old_badge.trust != new_badge.trust ||
       old_badge.cascade_damage != new_badge.cascade_damage {
        return false;
    }

    true
}

pub fn handle_report_outcome(
    app: &App,
    tx: &Transaction,
    transaction_id: B32,
    outcome: ReportedOutcome,
    current_block: u64,
) -> bool {
    let (old_badge, new_badge) = match extract_badge_transition(app, tx) {
        Some(badges) => badges,
        None => return false,
    };

    validate_report_outcome(
        &old_badge,
        &new_badge,
        transaction_id,
        outcome,
        current_block,
    )
}

fn validate_report_outcome(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    transaction_id: B32,
    outcome: ReportedOutcome,
    current_block: u64,
) -> bool {
    if !badge_identity_matches(old_badge, new_badge) {
        return false;
    }

    let reporting_tx = old_badge.reporting_transactions.iter()
        .find(|tx| tx.id == transaction_id);

    let active_tx = old_badge.active_transactions.iter()
        .find(|tx| tx.id == transaction_id);

    match (reporting_tx, active_tx) {
        (Some(rtx), _) => {

            if current_block as u32 >= rtx.report_deadline {
                return false;
            }

            if rtx.my_report.is_some() {
                return false;
            }

            let new_rtx = new_badge.reporting_transactions.iter()
                .find(|tx| tx.id == transaction_id);

            match new_rtx {
                Some(ntx) => ntx.my_report == Some(outcome),
                None => false,
            }
        }
        (None, Some(atx)) => {

            if (current_block as u32) < atx.window_ends_at {
                return false;
            }

            if current_block as u32 >= atx.report_deadline {
                return false;
            }

            let new_rtx = new_badge.reporting_transactions.iter()
                .find(|tx| tx.id == transaction_id);

            match new_rtx {
                Some(ntx) => ntx.my_report == Some(outcome),
                None => false,
            }
        }
        (None, None) => {

            false
        }
    }
}

pub fn compute_settlement(
    my_report: ReportedOutcome,
    their_report: Option<ReportedOutcome>,
    current_block: u32,
    report_deadline: u32,
) -> Option<SettledOutcome> {
    match their_report {
        Some(their) => {

            Some(match (my_report, their) {
                (ReportedOutcome::Positive, ReportedOutcome::Positive) => {
                    SettledOutcome::MutualPositive
                }
                (ReportedOutcome::Negative, ReportedOutcome::Negative) => {
                    SettledOutcome::MutualNegative
                }
                (ReportedOutcome::Positive, ReportedOutcome::Negative) => {
                    SettledOutcome::ContestedIPositive
                }
                (ReportedOutcome::Negative, ReportedOutcome::Positive) => {
                    SettledOutcome::ContestedINegative
                }
            })
        }
        None => {

            if current_block >= report_deadline {

                Some(SettledOutcome::Timeout {
                    reporter_outcome: my_report,
                    i_reported: true,
                })
            } else {

                None
            }
        }
    }
}
