use crate::types::backing::{BackedTransactionRecord, CounterpartyPolicy, TransactionType};

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum BackingValidationError {
    BackingRequired {
        counterparty_trust: u64,
        policy_threshold: u64,
    },
    MissingBackingProof,
    InvalidBackingProof(String),
    InvalidBackingReference(String),
}

impl core::fmt::Display for BackingValidationError {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            Self::BackingRequired { counterparty_trust, policy_threshold } => {
                write!(
                    f,
                    "Backing required: counterparty trust {} is below policy threshold {}",
                    counterparty_trust, policy_threshold
                )
            }
            Self::MissingBackingProof => write!(f, "Backed transaction missing proof"),
            Self::InvalidBackingProof(msg) => write!(f, "Invalid backing proof: {}", msg),
            Self::InvalidBackingReference(msg) => write!(f, "Invalid backing reference: {}", msg),
        }
    }
}

pub fn validate_backing_proof(
    record: &BackedTransactionRecord,
) -> Result<(), BackingValidationError> {
    match record.transaction_type {
        TransactionType::Unbacked => {
            Ok(())
        }
        TransactionType::Backed => {
            let backing_ref = record.backing_reference.as_ref()
                .ok_or(BackingValidationError::MissingBackingProof)?;

            let backing_proof = record.backing_proof.as_ref()
                .ok_or(BackingValidationError::MissingBackingProof)?;

            validate_backing_reference(backing_ref)?;

            if backing_proof.is_empty() {
                return Err(BackingValidationError::InvalidBackingProof(
                    "Backing proof cannot be empty".to_string()
                ));
            }

            let parts: Vec<&str> = backing_ref.split(':').collect();
            if parts.len() != 2 {
                return Err(BackingValidationError::InvalidBackingReference(
                    format!("Expected format 'type:nonce', got: {}", backing_ref)
                ));
            }

            let backing_type = parts[0];
            let nonce = parts[1];

            match backing_type {
                "scrolls" => validate_scrolls_proof(nonce, backing_proof),
                "htlc" => validate_htlc_proof(nonce, backing_proof),
                "multisig" => validate_multisig_proof(nonce, backing_proof),
                _ => Err(BackingValidationError::InvalidBackingReference(
                    format!("Unknown backing type: {}", backing_type)
                )),
            }
        }
    }
}

fn validate_backing_reference(reference: &str) -> Result<(), BackingValidationError> {
    if reference.is_empty() {
        return Err(BackingValidationError::InvalidBackingReference(
            "Backing reference cannot be empty".to_string()
        ));
    }

    let parts: Vec<&str> = reference.split(':').collect();
    if parts.len() != 2 {
        return Err(BackingValidationError::InvalidBackingReference(
            format!("Expected format 'type:nonce', got: {}", reference)
        ));
    }

    let (backing_type, nonce) = (parts[0], parts[1]);

    if backing_type.is_empty() {
        return Err(BackingValidationError::InvalidBackingReference(
            "Backing type cannot be empty".to_string()
        ));
    }

    if nonce.is_empty() {
        return Err(BackingValidationError::InvalidBackingReference(
            "Backing nonce cannot be empty".to_string()
        ));
    }

    if nonce.parse::<u64>().is_err() {
        return Err(BackingValidationError::InvalidBackingReference(
            format!("Backing nonce must be numeric, got: {}", nonce)
        ));
    }

    Ok(())
}

fn validate_scrolls_proof(nonce: &str, proof: &[u8]) -> Result<(), BackingValidationError> {
    if nonce.parse::<u64>().is_err() {
        return Err(BackingValidationError::InvalidBackingProof(
            format!("Scrolls nonce must be numeric, got: {}", nonce)
        ));
    }

    if proof.len() < 20 {
        return Err(BackingValidationError::InvalidBackingProof(
            format!("Scrolls proof too short: {} bytes (expected at least 20)", proof.len())
        ));
    }

    Ok(())
}

fn validate_htlc_proof(_nonce: &str, _proof: &[u8]) -> Result<(), BackingValidationError> {
    Err(BackingValidationError::InvalidBackingProof(
        "HTLC backing validation not yet implemented".to_string()
    ))
}

fn validate_multisig_proof(_nonce: &str, _proof: &[u8]) -> Result<(), BackingValidationError> {
    Err(BackingValidationError::InvalidBackingProof(
        "Multisig backing validation not yet implemented".to_string()
    ))
}

pub fn validate_against_policy(
    tx_type: TransactionType,
    policy: &CounterpartyPolicy,
    counterparty_trust: u64,
    transaction_value: u64,
) -> Result<(), BackingValidationError> {
    if policy.requires_backing(counterparty_trust, transaction_value) {
        if tx_type == TransactionType::Unbacked {
            return Err(BackingValidationError::BackingRequired {
                counterparty_trust,
                policy_threshold: policy.require_backing_below_trust,
            });
        }
    }
    Ok(())
}
