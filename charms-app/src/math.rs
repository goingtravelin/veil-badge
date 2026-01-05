use fixed::types::I32F32;

#[inline]
pub fn ln_f64(x: f64) -> f64 {
    libm::log(x)
}

#[inline]
pub fn ln_u64(x: u64) -> f64 {
    if x == 0 {
        return 0.0;
    }
    libm::log(x as f64)
}

#[inline]
pub fn ln_fixed(x: I32F32) -> f64 {
    let val: f64 = x.to_num();
    if val <= 0.0 {
        return 0.0;
    }
    libm::log(val)
}

pub const MATURITY_BLOCKS: u64 = 52560;

pub fn compute_age_factor(age_blocks: u64) -> f64 {
    if age_blocks == 0 {
        return 0.0;
    }

    let ln_age = ln_u64(age_blocks.saturating_add(1));
    let ln_maturity = ln_u64(MATURITY_BLOCKS);

    let factor = ln_age / ln_maturity;

    if factor > 1.0 {
        1.0
    } else if factor < 0.0 {
        0.0
    } else {
        factor
    }
}

pub fn age_factor_percent(age_blocks: u64) -> u64 {
    let factor = compute_age_factor(age_blocks);
    (factor * 100.0) as u64
}

pub fn ln_approx_scaled(x: u64) -> u64 {
    if x == 0 {
        return 0;
    }

    let bit_pos = 63 - x.leading_zeros() as u64;

    let base = 693u64.saturating_mul(bit_pos);

    let mask = (1u64 << bit_pos).saturating_sub(1);
    let fraction = if bit_pos > 0 {
        ((x & mask).saturating_mul(693)) / (1u64 << bit_pos)
    } else {
        0
    };

    base.saturating_add(fraction)
}

pub fn age_factor_integer(age_blocks: u64) -> u64 {
    if age_blocks == 0 {
        return 0;
    }

    let ln_age_scaled = ln_approx_scaled(age_blocks.saturating_add(1));
    let ln_maturity_scaled = ln_approx_scaled(MATURITY_BLOCKS);

    if ln_maturity_scaled == 0 {
        return 100;
    }

    let factor = ln_age_scaled.saturating_mul(100) / ln_maturity_scaled;

    if factor > 100 {
        100
    } else {
        factor
    }
}
