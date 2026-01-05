use crate::types::*;

pub fn calculate_cascade_damage(severity: &Severity, stake_percent: u8) -> u64 {
    let base = severity.damage();
    base * stake_percent as u64 / 100
}

pub fn window_expired(badge: &VeilBadge, current_block: u64) -> bool {
    current_block > badge.window_start.saturating_add(WINDOW_SIZE_BLOCKS)
}

pub fn update_window(
    badge: &VeilBadge,
    value: u64,
    current_block: u64,
) -> (u64, u64, u64) {
    if window_expired(badge, current_block) {
        (1, value, current_block)
    } else {
        (
            badge.window_tx_count.saturating_add(1),
            badge.window_volume.saturating_add(value),
            badge.window_start,
        )
    }
}
