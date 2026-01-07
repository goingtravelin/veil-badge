pub mod error;
pub mod formulas;
pub mod handlers;
pub mod math;
pub mod types;
pub mod validation;

pub use error::*;
pub use formulas::*;
pub use handlers::*;
pub use math::*;
pub use types::*;
pub use validation::*;

#[macro_export]
macro_rules! require {
    ($condition:expr) => {
        if !$condition {
            return false;
        }
    };
    ($condition:expr, $msg:expr) => {
        if !$condition {
            #[cfg(debug_assertions)]
            let _ = $msg;
            return false;
        }
    };
}

use charms_data::{Transaction, App, Data};

#[no_mangle]
pub fn app_contract(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    eprintln!("DEBUG: app_contract called");
    eprintln!("DEBUG: app = {:?}", app);
    eprintln!("DEBUG: tx.ins.len() = {}", tx.ins.len());
    eprintln!("DEBUG: tx.outs.len() = {}", tx.outs.len());
    
    let action: Action = match x.value() {
        Ok(a) => {
            eprintln!("DEBUG: action = {:?}", a);
            a
        },
        Err(e) => {
            eprintln!("DEBUG: failed to deserialize action: {:?}", e);
            return false;
        }
    };

    match action {
        Action::Mint { pubkey, current_block } => {
            handlers::handle_mint(app, tx, pubkey, current_block)
        }

        Action::Transfer => {
            eprintln!("DEBUG: handling Transfer");
            let result = handlers::handle_transfer(app, tx);
            eprintln!("DEBUG: handle_transfer returned {}", result);
            result
        }

        Action::Record { outcome, value, current_block } => {
            let witness: RecordWitness = match w.value() {
                Ok(witness) => witness,
                Err(_) => return false,
            };
            handlers::handle_record(app, tx, outcome, value, current_block, witness)
        }

        Action::Vouch { target_badge_id, stake_percent, unlock_delay_blocks, current_block } => {
            let witness: VouchWitness = match w.value() {
                Ok(witness) => witness,
                Err(_) => return false,
            };
            handlers::handle_vouch(app, tx, target_badge_id, stake_percent, unlock_delay_blocks, current_block, witness)
        }

        Action::Unvouch { target_badge_id, current_block } => {
            handlers::handle_unvouch(app, tx, target_badge_id, current_block)
        }

        Action::ReceiveVouch { voucher_badge_id, stake_percent, vouch_created_at, vouch_unlock_at, current_block } => {
            handlers::handle_receive_vouch(app, tx, voucher_badge_id, stake_percent, vouch_created_at, vouch_unlock_at, current_block)
        }

        Action::LoseVouch { voucher_badge_id } => {
            handlers::handle_lose_vouch(app, tx, voucher_badge_id)
        }

        Action::Cascade { source_badge_id, damage, current_block } => {
            let witness: CascadeWitness = match w.value() {
                Ok(witness) => witness,
                Err(_) => return false,
            };
            handlers::handle_cascade(app, tx, source_badge_id, damage, current_block, witness)
        }

        Action::AcceptProposal {
            proposal_id,
            proposer_badge_id,
            value,
            category,
            window_blocks,
            report_window_blocks,
            current_block,
        } => {
            handlers::handle_accept_proposal(
                app, tx, proposal_id, proposer_badge_id, value, category,
                window_blocks, report_window_blocks, current_block
            )
        }

        Action::ReportOutcome { transaction_id, outcome, current_block } => {
            handlers::handle_report_outcome(app, tx, transaction_id, outcome, current_block)
        }

        Action::MigrateOut => {
            handlers::handle_migrate_out(app, tx)
        }

        Action::MigrateIn { from_vk } => {
            handlers::handle_migrate_in(app, tx, from_vk)
        }
    }
}
