use crate::types::backing::{
    BackingAggregates, TransactionType, MIN_VERIFIED_RATIO,
    calculate_verified_ratio, meets_min_verified_ratio,
};

#[derive(Clone, Debug, Default)]
pub struct BackingWeightedAggregates {
    pub tx_backed: u64,
    pub tx_unbacked: u64,
    pub weighted_positive: f64,
    pub weighted_negative: f64,
    pub weighted_volume: f64,
}

impl BackingWeightedAggregates {
    pub fn record(&mut self, tx_type: TransactionType, positive: bool, value: u64) {
        let weight = tx_type.weight();

        match tx_type {
            TransactionType::Backed => self.tx_backed = self.tx_backed.saturating_add(1),
            TransactionType::Unbacked => self.tx_unbacked = self.tx_unbacked.saturating_add(1),
        }

        if positive {
            self.weighted_positive += weight;
        } else {
            self.weighted_negative += weight;
        }

        self.weighted_volume += (value as f64) * weight;
    }

    pub fn verified_ratio(&self) -> u8 {
        calculate_verified_ratio(self.tx_backed, self.tx_unbacked)
    }

    pub fn meets_verified_threshold(&self) -> bool {
        meets_min_verified_ratio(self.tx_backed, self.tx_unbacked)
    }
}

pub fn compute_weighted_trust(
    aggregates: &BackingWeightedAggregates,
    age_blocks: u64,
    network_score: u64,
    cascade_damage: u64,
) -> u64 {
    const AGE_DECAY_BLOCKS: f64 = 12960.0;
    const NETWORK_BONUS_DIVISOR: f64 = 5.0;
    const BASE_TRUST: f64 = 50.0;

    let total_weighted = aggregates.weighted_positive + aggregates.weighted_negative + 1.0;
    let history = (aggregates.weighted_positive - aggregates.weighted_negative) / total_weighted;

    let age_factor = 1.0 - (-((age_blocks as f64) / AGE_DECAY_BLOCKS)).exp();

    let history_component = history * 30.0 * age_factor;

    let network_bonus = ((network_score as f64) / NETWORK_BONUS_DIVISOR).min(20.0);

    let damage = cascade_damage as f64;

    let trust = BASE_TRUST + history_component + network_bonus - damage;

    trust.max(0.0).min(100.0) as u64
}

pub fn check_low_verified_ratio(
    backing: &BackingAggregates,
    tx_total: u64,
) -> bool {
    if tx_total < 10 {
        return false;
    }

    let total = backing.backed_count + backing.unbacked_count;
    if total == 0 {
        return false;
    }

    let ratio = (backing.backed_count * 100) / total;
    ratio < MIN_VERIFIED_RATIO as u64
}

pub const LOW_VERIFIED_RISK_WEIGHT: u64 = 10;
