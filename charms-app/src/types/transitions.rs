
use crate::types::proposal::*;

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum TransitionError {

    ProposalExpired,
    ProposalInvalidSignature,
    ProposalWrongCounterparty,
    ProposalAlreadyAccepted,

    TransactionNotFound,
    TransactionNotInReportingPhase,
    TransactionAlreadySettled,

    AlreadyReported,
    ReportWindowClosed,

    InvalidBadgeId,
    SignatureVerificationFailed,
}

impl core::fmt::Display for TransitionError {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            Self::ProposalExpired => write!(f, "Proposal has expired"),
            Self::ProposalInvalidSignature => write!(f, "Invalid proposer signature"),
            Self::ProposalWrongCounterparty => write!(f, "You are not the intended counterparty"),
            Self::ProposalAlreadyAccepted => write!(f, "Proposal has already been accepted"),
            Self::TransactionNotFound => write!(f, "Transaction not found"),
            Self::TransactionNotInReportingPhase => write!(f, "Transaction is not in reporting phase"),
            Self::TransactionAlreadySettled => write!(f, "Transaction has already been settled"),
            Self::AlreadyReported => write!(f, "You have already submitted a report"),
            Self::ReportWindowClosed => write!(f, "Report window has closed"),
            Self::InvalidBadgeId => write!(f, "Invalid badge ID"),
            Self::SignatureVerificationFailed => write!(f, "Signature verification failed"),
        }
    }
}

#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct BadgeTransactionState {
    pub active: Vec<ActiveTransaction>,

    pub reporting: Vec<ReportingTransaction>,

    pub outcomes: OutcomeAggregates,
}

impl BadgeTransactionState {
    pub fn pending_count(&self) -> usize {
        self.active.len() + self.reporting.len()
    }

    pub fn find_active(&self, id: &B32) -> Option<&ActiveTransaction> {
        self.active.iter().find(|tx| &tx.id == id)
    }

    pub fn find_reporting(&self, id: &B32) -> Option<&ReportingTransaction> {
        self.reporting.iter().find(|tx| &tx.id == id)
    }

    pub fn find_reporting_mut(&mut self, id: &B32) -> Option<&mut ReportingTransaction> {
        self.reporting.iter_mut().find(|tx| &tx.id == id)
    }
}

pub struct AcceptProposalInput {
    pub proposal: Proposal,
    pub acceptor_badge_id: B32,
    pub acceptor_signature: Signature,
    pub current_block: u32,
}

#[derive(Debug, PartialEq)]
pub struct AcceptProposalResult {
    pub proposer_tx: ActiveTransaction,
    pub acceptor_tx: ActiveTransaction,
}

pub fn accept_proposal(
    input: AcceptProposalInput,

    _verify_proposer_sig: impl Fn(&B32, &Signature, &[u8]) -> bool,
    _verify_acceptor_sig: impl Fn(&B32, &Signature, &[u8]) -> bool,
) -> Result<AcceptProposalResult, TransitionError> {
    let AcceptProposalInput {
        proposal,
        acceptor_badge_id,
        acceptor_signature: _,
        current_block,
    } = input;

    proposal.validate_structure().map_err(|e| match e {
        ProposalError::ZeroValue | ProposalError::ZeroWindow |
        ProposalError::ZeroReportWindow | ProposalError::SelfTransaction |
        ProposalError::InvalidId => TransitionError::ProposalInvalidSignature,
        ProposalError::Expired => TransitionError::ProposalExpired,
        ProposalError::InvalidSignature => TransitionError::ProposalInvalidSignature,
        ProposalError::WrongCounterparty => TransitionError::ProposalWrongCounterparty,
    })?;

    if proposal.is_expired(current_block) {
        return Err(TransitionError::ProposalExpired);
    }

    if proposal.counterparty_badge_id != acceptor_badge_id {
        return Err(TransitionError::ProposalWrongCounterparty);
    }

    let proposer_tx = ActiveTransaction::from_proposal(&proposal, current_block, true);
    let acceptor_tx = ActiveTransaction::from_proposal(&proposal, current_block, false);

    Ok(AcceptProposalResult {
        proposer_tx,
        acceptor_tx,
    })
}

pub fn process_phase_transitions(
    state: &mut BadgeTransactionState,
    current_block: u32,

    get_counterparty_report: impl Fn(&B32) -> Option<ReportedOutcome>,
) -> Vec<(B32, SettledOutcome)> {
    let mut settled = Vec::new();

    let mut still_active = Vec::new();
    for tx in state.active.drain(..) {
        if current_block >= tx.window_ends_at {

            state.reporting.push(tx.to_reporting());
        } else {
            still_active.push(tx);
        }
    }
    state.active = still_active;

    let mut still_reporting = Vec::new();
    for tx in state.reporting.drain(..) {
        if current_block >= tx.report_deadline {

            let their_report = get_counterparty_report(&tx.counterparty_badge_id);
            let outcome = SettledOutcome::from_reports(tx.my_report, their_report);

            state.outcomes.record(&outcome);

            settled.push((tx.id, outcome));
        } else {
            still_reporting.push(tx);
        }
    }
    state.reporting = still_reporting;

    settled
}

pub struct SubmitReportInput {
    pub transaction_id: B32,
    pub reporter_badge_id: B32,
    pub outcome: ReportedOutcome,
    pub current_block: u32,
}

pub fn submit_report(
    state: &mut BadgeTransactionState,
    input: SubmitReportInput,
) -> Result<(), TransitionError> {
    let SubmitReportInput {
        transaction_id,
        reporter_badge_id: _,
        outcome,
        current_block,
    } = input;

    let tx = state.find_reporting_mut(&transaction_id)
        .ok_or(TransitionError::TransactionNotFound)?;

    if tx.my_report.is_some() {
        return Err(TransitionError::AlreadyReported);
    }

    if current_block >= tx.report_deadline {
        return Err(TransitionError::ReportWindowClosed);
    }

    tx.my_report = Some(outcome);

    Ok(())
}

pub fn try_settle_transaction(
    state: &mut BadgeTransactionState,
    transaction_id: &B32,
    counterparty_report: Option<ReportedOutcome>,
) -> Option<SettledOutcome> {

    let tx_idx = state.reporting.iter().position(|tx| &tx.id == transaction_id)?;
    let tx = &state.reporting[tx_idx];

    let my_report = tx.my_report?;
    let their_report = counterparty_report?;

    let outcome = SettledOutcome::from_reports(Some(my_report), Some(their_report));

    state.reporting.remove(tx_idx);
    state.outcomes.record(&outcome);

    Some(outcome)
}
