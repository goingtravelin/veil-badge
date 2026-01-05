use crate::types::B32;

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum VeilError {
    BadgeIdMismatch { expected: B32 },
    PubkeyMismatch,
    CreationBlockMismatch { expected: u64, actual: u64 },
    SignatureInvalid,
    SignatureVerificationFailed,
    InvalidPublicKey,
    InvalidMessageLength(usize),
    NonceReplay,
    NotPartyToTransaction,
    OutcomeMismatch,
    ValueMismatch { expected: u64, actual: u64 },
    TxCountMismatch { expected: u64, actual: u64 },
    VolumeMismatch { expected: u64, actual: u64 },
    WindowStateMismatch,
    TrustMismatch { expected: u64, actual: u64 },
    RiskMismatch { expected: u8, actual: u8 },
    FlagsMismatch,
    InsufficientTrustToVouch { minimum: u64, actual: u64 },
    InsufficientTrustToReceiveVouch { minimum: u64, actual: u64 },
    VouchStakeExceeds100 { total: u8 },
    VouchNotFound { badge_id: B32 },
    VouchTimelocked { unlock_at: u64, current: u64 },
    DuplicateVouch,
    CascadeDamageMismatch { expected: u64, actual: u64 },
    InvalidNegativeProof,
    FieldNotZero { field: &'static str },
    VouchesNotEmpty,
    BadgeModifiedDuringTransfer,
}

pub type VeilResult<T> = Result<T, VeilError>;
