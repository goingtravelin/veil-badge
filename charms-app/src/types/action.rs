use serde::{Deserialize, Serialize};
use serde_with::{serde_as, hex::Hex};
use super::{B32, PubKey, Signature, Vouch};
use super::proposal::{TxCategory, ReportedOutcome};
#[serde_as]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum Action {
    Mint {
        #[serde_as(as = "Hex")]
        pubkey: PubKey,
        current_block: u64,
    },
    Transfer,
    Record {
        outcome: Outcome,
        value: u64,
        current_block: u64,
    },
    Vouch {
        target_badge_id: B32,
        stake_percent: u8,
        unlock_delay_blocks: u64,
        current_block: u64,
    },
    ReceiveVouch {
        voucher_badge_id: B32,
        stake_percent: u8,
        vouch_created_at: u64,
        vouch_unlock_at: u64,
        current_block: u64,
    },
    Unvouch {
        target_badge_id: B32,
        current_block: u64,
    },
    LoseVouch {
        voucher_badge_id: B32,
    },
    Cascade {
        source_badge_id: B32,
        damage: u64,
        current_block: u64,
    },
    AcceptProposal {
        proposal_id: B32,
        proposer_badge_id: B32,
        value: u64,
        category: TxCategory,
        window_blocks: u32,
        report_window_blocks: u32,
        current_block: u64,
    },
    ReportOutcome {
        transaction_id: B32,
        outcome: ReportedOutcome,
        current_block: u64,
    },
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum Outcome {
    Positive,
    Negative { severity: Severity },
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum Severity {
    Minor,
    Major,
    Severe,
}

impl Severity {
    pub fn damage(&self) -> u64 {
        match self {
            Severity::Minor => 5,
            Severity::Major => 15,
            Severity::Severe => 50,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum TxType {
    P2PSale,
    LoanOrigination,
    LoanRepayment,
    ServiceProvided,
    Other,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TransactionRecord {
    pub nonce: B32,
    pub party_a: B32,
    pub party_b: B32,
    pub value: u64,
    pub tx_type: TxType,
    pub timestamp: u64,
    pub outcome: Outcome,
}

impl TransactionRecord {
    pub fn has_party(&self, badge_id: &B32) -> bool {
        self.party_a == *badge_id || self.party_b == *badge_id
    }

    pub fn counterparty(&self, my_id: &B32) -> Option<B32> {
        if self.party_a == *my_id {
            Some(self.party_b)
        } else if self.party_b == *my_id {
            Some(self.party_a)
        } else {
            None
        }
    }
}

#[serde_as]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RecordWitness {
    pub record: TransactionRecord,
    #[serde_as(as = "Hex")]
    pub my_signature: Signature,
    #[serde_as(as = "Hex")]
    pub counterparty_signature: Signature,
    #[serde_as(as = "Hex")]
    pub counterparty_pubkey: PubKey,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct VouchWitness {
    pub target_current_trust: u64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CascadeWitness {
    pub source_negative_proof: NegativeOutcomeProof,
    pub vouch_record: Vouch,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NegativeOutcomeProof {
    pub prev_tx_negative: u64,
    pub new_tx_negative: u64,
    pub severity: Severity,
}
