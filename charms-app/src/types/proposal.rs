
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, hex::Hex};
use sha2::{Digest, Sha256};

pub use super::B32;
pub use super::PubKey;
pub use super::Signature;

pub const DEFAULT_WINDOW_BLOCKS: u32 = 1008;

pub const DEFAULT_REPORT_WINDOW_BLOCKS: u32 = 432;

pub const DEFAULT_PROPOSAL_EXPIRY_BLOCKS: u32 = 144;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum TxCategory {
    Trade,
    Loan,
    Service,
    Other,
}

impl Default for TxCategory {
    fn default() -> Self {
        TxCategory::Trade
    }
}

impl TxCategory {
    pub fn as_str(&self) -> &'static str {
        match self {
            TxCategory::Trade => "Trade",
            TxCategory::Loan => "Loan",
            TxCategory::Service => "Service",
            TxCategory::Other => "Other",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "Trade" => Some(TxCategory::Trade),
            "Loan" => Some(TxCategory::Loan),
            "Service" => Some(TxCategory::Service),
            "Other" => Some(TxCategory::Other),
            _ => None,
        }
    }
}

#[serde_as]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Proposal {
    pub id: B32,

    pub proposer_badge_id: B32,

    pub counterparty_badge_id: B32,

    pub value: u64,

    pub category: TxCategory,

    pub window_blocks: u32,

    pub report_window_blocks: u32,

    pub created_at: u32,

    pub expires_at: u32,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub memo: Option<String>,

    #[serde_as(as = "Hex")]
    pub proposer_signature: Signature,
}

impl Proposal {
    pub fn new(
        proposer_badge_id: B32,
        counterparty_badge_id: B32,
        value: u64,
        category: TxCategory,
        window_blocks: u32,
        report_window_blocks: u32,
        current_block: u32,
        memo: Option<String>,
    ) -> Self {
        let expires_at = current_block.saturating_add(DEFAULT_PROPOSAL_EXPIRY_BLOCKS);

        let mut proposal = Self {
            id: B32::zero(),
            proposer_badge_id,
            counterparty_badge_id,
            value,
            category,
            window_blocks,
            report_window_blocks,
            created_at: current_block,
            expires_at,
            memo,
            proposer_signature: [0u8; 64],
        };

        proposal.id = proposal.compute_id();
        proposal
    }

    pub fn canonical_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.extend_from_slice(self.proposer_badge_id.as_bytes());
        bytes.extend_from_slice(self.counterparty_badge_id.as_bytes());
        bytes.extend_from_slice(&self.value.to_le_bytes());
        bytes.push(self.category as u8);
        bytes.extend_from_slice(&self.window_blocks.to_le_bytes());
        bytes.extend_from_slice(&self.report_window_blocks.to_le_bytes());
        bytes.extend_from_slice(&self.created_at.to_le_bytes());
        bytes.extend_from_slice(&self.expires_at.to_le_bytes());
        if let Some(ref memo) = self.memo {
            bytes.extend_from_slice(memo.as_bytes());
        }
        bytes
    }

    pub fn compute_id(&self) -> B32 {
        let mut hasher = Sha256::new();
        hasher.update(&self.canonical_bytes());
        let result = hasher.finalize();
        let mut id = [0u8; 32];
        id.copy_from_slice(&result);
        B32(id)
    }

    pub fn signing_hash(&self) -> B32 {
        self.compute_id()
    }

    pub fn is_expired(&self, current_block: u32) -> bool {
        current_block > self.expires_at
    }

    pub fn validate_structure(&self) -> Result<(), ProposalError> {
        if self.value == 0 {
            return Err(ProposalError::ZeroValue);
        }
        if self.window_blocks == 0 {
            return Err(ProposalError::ZeroWindow);
        }
        if self.report_window_blocks == 0 {
            return Err(ProposalError::ZeroReportWindow);
        }
        if self.proposer_badge_id == self.counterparty_badge_id {
            return Err(ProposalError::SelfTransaction);
        }
        if self.id != self.compute_id() {
            return Err(ProposalError::InvalidId);
        }
        Ok(())
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ProposalError {
    ZeroValue,
    ZeroWindow,
    ZeroReportWindow,
    SelfTransaction,
    InvalidId,
    Expired,
    InvalidSignature,
    WrongCounterparty,
}

impl core::fmt::Display for ProposalError {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            Self::ZeroValue => write!(f, "Transaction value cannot be zero"),
            Self::ZeroWindow => write!(f, "Settlement window cannot be zero"),
            Self::ZeroReportWindow => write!(f, "Report window cannot be zero"),
            Self::SelfTransaction => write!(f, "Cannot transact with yourself"),
            Self::InvalidId => write!(f, "Proposal ID does not match computed hash"),
            Self::Expired => write!(f, "Proposal has expired"),
            Self::InvalidSignature => write!(f, "Invalid proposer signature"),
            Self::WrongCounterparty => write!(f, "You are not the intended counterparty"),
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ActiveTransaction {
    pub id: B32,

    pub counterparty_badge_id: B32,

    pub value: u64,

    pub category: TxCategory,

    pub started_at: u32,

    pub window_ends_at: u32,

    pub report_deadline: u32,
}

impl ActiveTransaction {
    pub fn from_proposal(proposal: &Proposal, current_block: u32, i_am_proposer: bool) -> Self {
        let window_ends_at = current_block + proposal.window_blocks;
        let report_deadline = window_ends_at + proposal.report_window_blocks;

        Self {
            id: proposal.id,
            counterparty_badge_id: if i_am_proposer {
                proposal.counterparty_badge_id
            } else {
                proposal.proposer_badge_id
            },
            value: proposal.value,
            category: proposal.category,
            started_at: current_block,
            window_ends_at,
            report_deadline,
        }
    }

    pub fn is_in_settlement_window(&self, current_block: u32) -> bool {
        current_block < self.window_ends_at
    }

    pub fn is_in_reporting_phase(&self, current_block: u32) -> bool {
        current_block >= self.window_ends_at && current_block < self.report_deadline
    }

    pub fn is_past_deadline(&self, current_block: u32) -> bool {
        current_block >= self.report_deadline
    }

    pub fn to_reporting(&self) -> ReportingTransaction {
        ReportingTransaction {
            id: self.id,
            counterparty_badge_id: self.counterparty_badge_id,
            value: self.value,
            category: self.category,
            report_deadline: self.report_deadline,
            my_report: None,
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ReportingTransaction {
    pub id: B32,

    pub counterparty_badge_id: B32,

    pub value: u64,

    pub category: TxCategory,

    pub report_deadline: u32,

    pub my_report: Option<ReportedOutcome>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum ReportedOutcome {
    Positive,
    Negative,
}

impl ReportingTransaction {
    pub fn has_reported(&self) -> bool {
        self.my_report.is_some()
    }

    pub fn is_past_deadline(&self, current_block: u32) -> bool {
        current_block >= self.report_deadline
    }

    pub fn submit_report(&mut self, outcome: ReportedOutcome) -> Result<(), &'static str> {
        if self.my_report.is_some() {
            return Err("Already reported");
        }
        self.my_report = Some(outcome);
        Ok(())
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum SettledOutcome {
    MutualPositive,

    MutualNegative,

    ContestedIPositive,

    ContestedINegative,

    Timeout {
        reporter_outcome: ReportedOutcome,
        i_reported: bool,
    },

    MutualTimeout,
}

impl SettledOutcome {
    pub fn from_reports(
        my_report: Option<ReportedOutcome>,
        their_report: Option<ReportedOutcome>,
    ) -> Self {
        match (my_report, their_report) {

            (Some(ReportedOutcome::Positive), Some(ReportedOutcome::Positive)) => {
                SettledOutcome::MutualPositive
            }
            (Some(ReportedOutcome::Negative), Some(ReportedOutcome::Negative)) => {
                SettledOutcome::MutualNegative
            }
            (Some(ReportedOutcome::Positive), Some(ReportedOutcome::Negative)) => {
                SettledOutcome::ContestedIPositive
            }
            (Some(ReportedOutcome::Negative), Some(ReportedOutcome::Positive)) => {
                SettledOutcome::ContestedINegative
            }

            (Some(outcome), None) => SettledOutcome::Timeout {
                reporter_outcome: outcome,
                i_reported: true,
            },
            (None, Some(outcome)) => SettledOutcome::Timeout {
                reporter_outcome: outcome,
                i_reported: false,
            },

            (None, None) => SettledOutcome::MutualTimeout,
        }
    }

    pub fn is_positive_for_me(&self) -> bool {
        match self {
            SettledOutcome::MutualPositive => true,
            SettledOutcome::MutualTimeout => true,
            SettledOutcome::Timeout { reporter_outcome: ReportedOutcome::Positive, .. } => true,
            _ => false,
        }
    }

    pub fn trust_weight(&self) -> f64 {
        match self {
            SettledOutcome::MutualPositive => 1.0,
            SettledOutcome::MutualNegative => -1.0,
            SettledOutcome::ContestedIPositive => 0.0,
            SettledOutcome::ContestedINegative => 0.0,
            SettledOutcome::MutualTimeout => 0.8,
            SettledOutcome::Timeout { reporter_outcome, .. } => {
                match reporter_outcome {
                    ReportedOutcome::Positive => 0.9,
                    ReportedOutcome::Negative => -0.5,
                }
            }
        }
    }
}

#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct OutcomeAggregates {
    pub mutual_positive: u32,

    pub mutual_negative: u32,

    pub contested_i_positive: u32,

    pub contested_i_negative: u32,

    pub timeout: u32,

    pub mutual_timeout: u32,
}

impl OutcomeAggregates {
    pub fn total(&self) -> u32 {
        self.mutual_positive
            + self.mutual_negative
            + self.contested_i_positive
            + self.contested_i_negative
            + self.timeout
            + self.mutual_timeout
    }

    pub fn total_contested(&self) -> u32 {
        self.contested_i_positive + self.contested_i_negative
    }

    pub fn complaint_ratio(&self) -> Option<f64> {
        let total = self.total_contested();
        if total == 0 {
            return None;
        }
        Some(self.contested_i_negative as f64 / total as f64)
    }

    pub fn record(&mut self, outcome: &SettledOutcome) {
        match outcome {
            SettledOutcome::MutualPositive => self.mutual_positive += 1,
            SettledOutcome::MutualNegative => self.mutual_negative += 1,
            SettledOutcome::ContestedIPositive => self.contested_i_positive += 1,
            SettledOutcome::ContestedINegative => self.contested_i_negative += 1,
            SettledOutcome::Timeout { .. } => self.timeout += 1,
            SettledOutcome::MutualTimeout => self.mutual_timeout += 1,
        }
    }
}
