use crate::types::*;
use charms_sdk::data::check;

/// Validates that a badge has all counters and tracking fields at zero (initial state).
fn is_zero_initialized(badge: &VeilBadge) -> bool {
    badge.tx_total == 0
        && badge.tx_positive == 0
        && badge.tx_negative == 0
        && badge.volume_total == 0
        && badge.volume_sum_squares == 0
        && badge.window_tx_count == 0
        && badge.window_volume == 0
        && badge.counterparty_count == 0
        && badge.cascade_damage == 0
}

/// Validates that backing stats are at initial zero state.
fn backing_is_zero_initialized(badge: &VeilBadge) -> bool {
    badge.backing.backed_count == 0
        && badge.backing.unbacked_count == 0
        && badge.backing.backed_volume == 0
        && badge.backing.unbacked_volume == 0
}

pub fn validate_mint(
    genesis_utxo: &[u8],
    pubkey: PubKey,
    new_badge: &VeilBadge,
    current_block: u64,
) -> bool {
    // Validate identity
    let expected_id = super::compute_badge_id(genesis_utxo);
    check!(new_badge.id == expected_id);
    check!(new_badge.pubkey == pubkey);
    check!(new_badge.created_at == current_block);

    // Validate all counters are zero
    check!(is_zero_initialized(new_badge));
    check!(backing_is_zero_initialized(new_badge));
    check!(new_badge.window_start == current_block);

    // Validate vouch state is empty
    check!(new_badge.vouches_out.is_empty());
    check!(new_badge.vouches_in.is_empty());

    // Validate initial trust/risk values
    check!(new_badge.trust == 15);
    let expected_flags = RiskFlags::NEW_BADGE | RiskFlags::ISOLATED;
    check!(new_badge.flags == expected_flags);
    check!(new_badge.risk == 35);

    // Validate metadata
    check!(new_badge.last_nonce == B32::zero());
    check!(new_badge.last_update == current_block);

    true
}

pub fn validate_transfer(
    input_badge: &VeilBadge,
    output_badge: &VeilBadge,
) -> bool {
    // Transfer requires exact equality - no state changes allowed
    check!(input_badge == output_badge);

    true
}
