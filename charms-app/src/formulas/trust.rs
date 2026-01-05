use crate::types::*;
use crate::math::ln_f64;
use fixed::types::I32F32;

const WEIGHT_MUTUAL_POSITIVE: f64 = 1.0;

const WEIGHT_MUTUAL_NEGATIVE: f64 = -1.0;

const WEIGHT_CONTESTED: f64 = 0.0;

const WEIGHT_TIMEOUT_I_REPORTED: f64 = 0.3;

const WEIGHT_TIMEOUT_THEY_REPORTED: f64 = -0.2;

const WEIGHT_MUTUAL_TIMEOUT: f64 = 0.5;

pub fn compute_trust(badge: &VeilBadge, current_block: u64) -> u64 {
    let h = compute_history_component(badge);

    let age_blocks = current_block.saturating_sub(badge.created_at);
    let age_days = I32F32::from_num(age_blocks) / I32F32::from_num(144);

    let age_days_f64 = age_days.to_num::<f64>();
    let ln_result = ln_f64(1.0 + age_days_f64) / 7.0;
    let a = I32F32::from_num(ln_result.min(1.0));

    let hundred = I32F32::from_num(100);
    let ten = I32F32::from_num(10);
    let n: I32F32 = badge.vouches_in.iter()
        .map(|v| I32F32::from_num(v.stake_percent) / hundred * ten)
        .fold(I32F32::ZERO, |acc, x| acc + x);

    let d = I32F32::from_num(badge.cascade_damage);

    let trust = (h * a) + n - d;

    let clamped = if trust < I32F32::ZERO {
        I32F32::ZERO
    } else if trust > hundred {
        hundred
    } else {
        trust
    };

    clamped.to_num::<u64>()
}

fn compute_history_component(badge: &VeilBadge) -> I32F32 {
    let hundred = I32F32::from_num(100);

    let total_outcomes = badge.outcomes.total();

    if total_outcomes > 0 {
        let weighted_score = compute_weighted_outcome_score(&badge.outcomes);
        let total = I32F32::from_num(total_outcomes);

        let normalized = (I32F32::from_num(weighted_score) / total) * I32F32::from_num(50)
                       + I32F32::from_num(50);

        if normalized < I32F32::ZERO {
            I32F32::ZERO
        } else if normalized > hundred {
            hundred
        } else {
            normalized
        }
    } else if badge.tx_total > 0 {
        let positive = I32F32::from_num(badge.tx_positive);
        let negative = I32F32::from_num(badge.tx_negative);
        let total = I32F32::from_num(badge.tx_total);

        let penalty = I32F32::from_num(5);
        let raw = (positive - penalty * negative) / total * hundred;

        if raw < I32F32::ZERO {
            I32F32::ZERO
        } else if raw > hundred {
            hundred
        } else {
            raw
        }
    } else {
        I32F32::from_num(15)
    }
}

fn compute_weighted_outcome_score(outcomes: &proposal::OutcomeAggregates) -> f64 {
    let mutual_positive = outcomes.mutual_positive as f64 * WEIGHT_MUTUAL_POSITIVE;
    let mutual_negative = outcomes.mutual_negative as f64 * WEIGHT_MUTUAL_NEGATIVE;
    let contested = (outcomes.contested_i_positive + outcomes.contested_i_negative) as f64
                  * WEIGHT_CONTESTED;

    let timeout_score = outcomes.timeout as f64 *
        ((WEIGHT_TIMEOUT_I_REPORTED + WEIGHT_TIMEOUT_THEY_REPORTED) / 2.0);

    let mutual_timeout = outcomes.mutual_timeout as f64 * WEIGHT_MUTUAL_TIMEOUT;

    mutual_positive + mutual_negative + contested + timeout_score + mutual_timeout
}
