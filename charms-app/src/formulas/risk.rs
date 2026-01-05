use crate::types::*;
use fixed::types::I32F32;

pub fn compute_flags(
    badge: &VeilBadge,
    proposed_value: u64,
    current_block: u64,
) -> RiskFlags {
    let mut flags = RiskFlags::empty();

    let age_blocks = current_block.saturating_sub(badge.created_at);

    flags.set_new_badge(age_blocks < NEW_BADGE_THRESHOLD_BLOCKS);

    if badge.tx_total > 0 && age_blocks > 0 {
        let historical_velocity = I32F32::from_num(badge.tx_total) / I32F32::from_num(age_blocks);

        let window_age = current_block.saturating_sub(badge.window_start).max(1);
        let recent_velocity = I32F32::from_num(badge.window_tx_count) / I32F32::from_num(window_age);

        let threshold = I32F32::from_num(ACCELERATION_THRESHOLD);
        flags.set_acceleration(recent_velocity > historical_velocity * threshold);
    }

    if badge.tx_total > 0 {
        let avg_value = badge.volume_total / badge.tx_total;
        flags.set_extraction(proposed_value > avg_value.saturating_mul(EXTRACTION_MULTIPLIER));
    }

    let network_score: u64 = badge.vouches_in.iter()
        .map(|v| v.stake_percent as u64)
        .sum();
    flags.set_isolated(network_score < ISOLATION_THRESHOLD);

    flags.set_too_clean(badge.tx_total > TOO_CLEAN_TX_THRESHOLD && badge.tx_negative == 0);

    if badge.tx_total > 1 {
        let cv = compute_coefficient_of_variation(badge);
        let threshold = I32F32::from_num(ERRATIC_CV_THRESHOLD);
        flags.set_erratic(cv > threshold);
    }

    flags
}

fn compute_coefficient_of_variation(badge: &VeilBadge) -> I32F32 {
    if badge.tx_total == 0 {
        return I32F32::ZERO;
    }

    let n = badge.tx_total;

    let scale_factor = 1000u64;

    let volume_scaled = badge.volume_total / scale_factor;
    let mean_scaled = volume_scaled / n;

    if mean_scaled == 0 {
        return I32F32::ZERO;
    }

    let sum_squares_scaled = badge.volume_sum_squares / (scale_factor as u128 * scale_factor as u128);

    let sum_squares_u64 = if sum_squares_scaled > u64::MAX as u128 {
        u64::MAX
    } else {
        sum_squares_scaled as u64
    };

    let n_fixed = I32F32::from_num(n);
    let mean_fixed = I32F32::from_num(mean_scaled);
    let mean_of_squares = I32F32::from_num(sum_squares_u64) / n_fixed;

    let variance = mean_of_squares - (mean_fixed * mean_fixed);

    let variance_positive = if variance < I32F32::ZERO {
        I32F32::ZERO
    } else {
        variance
    };

    let std_dev = variance_positive.sqrt();

    std_dev / mean_fixed
}

pub fn compute_risk(flags: &RiskFlags) -> u8 {
    let mut score: u16 = 0;

    if flags.acceleration() { score += 25; }
    if flags.extraction() { score += 30; }
    if flags.isolated() { score += 20; }
    if flags.too_clean() { score += 10; }
    if flags.erratic() { score += 15; }
    if flags.new_badge() { score += 15; }

    score.min(100) as u8
}
