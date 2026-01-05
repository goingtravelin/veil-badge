use serde::{Deserialize, Serialize};

pub const BACKED_WEIGHT: f64 = 1.0;
pub const UNBACKED_WEIGHT: f64 = 0.3;
pub const DEFAULT_BACKING_THRESHOLD: u64 = 30;
pub const MIN_VERIFIED_RATIO: u8 = 50;

#[inline]
pub fn calculate_verified_ratio(backed_count: u64, unbacked_count: u64) -> u8 {
    let total = backed_count + unbacked_count;
    if total == 0 {
        return 0;
    }
    ((backed_count * 100) / total) as u8
}

#[inline]
pub fn meets_min_verified_ratio(backed_count: u64, unbacked_count: u64) -> bool {
    calculate_verified_ratio(backed_count, unbacked_count) >= MIN_VERIFIED_RATIO
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum TransactionBacking {
    Backed {
        #[serde(skip_serializing_if = "Option::is_none")]
        backing_ref: Option<String>,
    },
    Unbacked,
}

impl Default for TransactionBacking {
    fn default() -> Self {
        TransactionBacking::Unbacked
    }
}

impl TransactionBacking {
    pub fn is_backed(&self) -> bool {
        matches!(self, TransactionBacking::Backed { .. })
    }

    pub fn weight(&self) -> f64 {
        match self {
            TransactionBacking::Backed { .. } => BACKED_WEIGHT,
            TransactionBacking::Unbacked => UNBACKED_WEIGHT,
        }
    }

    pub fn backed(backing_ref: Option<String>) -> Self {
        TransactionBacking::Backed { backing_ref }
    }

    pub fn unbacked() -> Self {
        TransactionBacking::Unbacked
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct BackingPolicy {
    pub min_trust_for_unbacked: u64,
    pub require_verified_ratio: bool,
}

impl Default for BackingPolicy {
    fn default() -> Self {
        BackingPolicy {
            min_trust_for_unbacked: DEFAULT_BACKING_THRESHOLD,
            require_verified_ratio: false,
        }
    }
}

impl BackingPolicy {
    pub fn threshold(min_trust: u64) -> Self {
        BackingPolicy {
            min_trust_for_unbacked: min_trust,
            require_verified_ratio: false,
        }
    }

    pub fn permissive() -> Self {
        BackingPolicy {
            min_trust_for_unbacked: 0,
            require_verified_ratio: false,
        }
    }

    pub fn strict() -> Self {
        BackingPolicy {
            min_trust_for_unbacked: 100,
            require_verified_ratio: false,
        }
    }

    pub fn allows_unbacked(&self, counterparty_trust: u64) -> bool {
        counterparty_trust >= self.min_trust_for_unbacked
    }

    pub fn allows_unbacked_full(
        &self,
        counterparty_trust: u64,
        counterparty_verified_ratio: u8,
    ) -> bool {
        let trust_ok = counterparty_trust >= self.min_trust_for_unbacked;
        let ratio_ok = !self.require_verified_ratio
            || counterparty_verified_ratio >= MIN_VERIFIED_RATIO;

        trust_ok && ratio_ok
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct BackingStats {
    pub tx_backed: u64,
    pub tx_unbacked: u64,
}

impl BackingStats {
    pub fn verified_ratio(&self) -> u8 {
        calculate_verified_ratio(self.tx_backed, self.tx_unbacked)
    }

    pub fn meets_verified_threshold(&self) -> bool {
        meets_min_verified_ratio(self.tx_backed, self.tx_unbacked)
    }
}

pub fn validate_backing(
    backing: &TransactionBacking,
    _escrow_proof: Option<&[u8]>,
) -> bool {
    match backing {
        TransactionBacking::Backed { backing_ref } => {
            backing_ref.is_some()
        }
        TransactionBacking::Unbacked => {
            true
        }
    }
}

pub fn requires_backing(my_trust: u64, counterparty_policy: &BackingPolicy) -> bool {
    !counterparty_policy.allows_unbacked(my_trust)
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum TransactionType {
    Backed,
    Unbacked,
}

impl Default for TransactionType {
    fn default() -> Self {
        TransactionType::Unbacked
    }
}

impl TransactionType {
    pub fn weight(&self) -> f64 {
        match self {
            TransactionType::Backed => BACKED_WEIGHT,
            TransactionType::Unbacked => UNBACKED_WEIGHT,
        }
    }

    pub fn requires_enforcement(&self) -> bool {
        matches!(self, TransactionType::Backed)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CounterpartyPolicy {
    pub require_backing_below_trust: u64,
    pub accept_unbacked: bool,
    pub require_backing_above_value: Option<u64>,
}

impl Default for CounterpartyPolicy {
    fn default() -> Self {
        Self {
            require_backing_below_trust: 30,
            accept_unbacked: true,
            require_backing_above_value: None,
        }
    }
}

impl CounterpartyPolicy {
    pub fn always_require_backing() -> Self {
        Self {
            require_backing_below_trust: 100,
            accept_unbacked: false,
            require_backing_above_value: None,
        }
    }

    pub fn never_require_backing() -> Self {
        Self {
            require_backing_below_trust: 0,
            accept_unbacked: true,
            require_backing_above_value: None,
        }
    }

    pub fn requires_backing(&self, counterparty_trust: u64, transaction_value: u64) -> bool {
        if counterparty_trust < self.require_backing_below_trust {
            return true;
        }

        if let Some(value_threshold) = self.require_backing_above_value {
            if transaction_value > value_threshold {
                return true;
            }
        }

        if !self.accept_unbacked {
            return true;
        }

        false
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct BackingAggregates {
    pub backed_count: u64,
    pub unbacked_count: u64,
    pub backed_volume: u64,
    pub unbacked_volume: u64,
}

impl BackingAggregates {
    pub fn total_count(&self) -> u64 {
        self.backed_count + self.unbacked_count
    }

    pub fn backed_ratio(&self) -> f64 {
        let total = self.total_count();
        if total == 0 {
            return 0.0;
        }
        self.backed_count as f64 / total as f64
    }

    pub fn meets_trusted_requirements(&self) -> bool {
        const MIN_BACKED_COUNT_FOR_TRUSTED: u64 = 10;
        const MIN_BACKED_RATIO_FOR_TRUSTED: f64 = 0.7;

        self.backed_count >= MIN_BACKED_COUNT_FOR_TRUSTED
            && self.backed_ratio() >= MIN_BACKED_RATIO_FOR_TRUSTED
    }

    pub fn record(&mut self, tx_type: TransactionType, value: u64) {
        match tx_type {
            TransactionType::Backed => {
                self.backed_count = self.backed_count.saturating_add(1);
                self.backed_volume = self.backed_volume.saturating_add(value);
            }
            TransactionType::Unbacked => {
                self.unbacked_count = self.unbacked_count.saturating_add(1);
                self.unbacked_volume = self.unbacked_volume.saturating_add(value);
            }
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BackedTransactionRecord {
    pub transaction_type: TransactionType,
    pub backing_reference: Option<String>,
    pub backing_proof: Option<Vec<u8>>,
}

impl Default for BackedTransactionRecord {
    fn default() -> Self {
        Self {
            transaction_type: TransactionType::Unbacked,
            backing_reference: None,
            backing_proof: None,
        }
    }
}
