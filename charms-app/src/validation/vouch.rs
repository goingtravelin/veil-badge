use crate::formulas::*;
use crate::types::*;
use charms_sdk::data::check;

pub const MIN_TRUST_TO_VOUCH: u64 = 30;
pub const MIN_TRUST_TO_RECEIVE_VOUCH: u64 = 20;

fn badge_identity_unchanged(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    new_badge.id == old_badge.id
        && new_badge.created_at == old_badge.created_at
        && new_badge.pubkey == old_badge.pubkey
}

fn transaction_counters_unchanged(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    new_badge.tx_total == old_badge.tx_total
        && new_badge.tx_positive == old_badge.tx_positive
        && new_badge.tx_negative == old_badge.tx_negative
}

fn volume_fields_unchanged(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    new_badge.volume_total == old_badge.volume_total
        && new_badge.volume_sum_squares == old_badge.volume_sum_squares
}

fn window_fields_unchanged(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    new_badge.window_tx_count == old_badge.window_tx_count
        && new_badge.window_volume == old_badge.window_volume
        && new_badge.window_start == old_badge.window_start
}

fn vouches_in_unchanged(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    new_badge.vouches_in == old_badge.vouches_in
}

fn vouches_out_unchanged(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    new_badge.vouches_out == old_badge.vouches_out
}

fn cascade_damage_unchanged(old_badge: &VeilBadge, new_badge: &VeilBadge) -> bool {
    new_badge.cascade_damage == old_badge.cascade_damage
}

fn trust_correctly_computed(new_badge: &VeilBadge, current_block: u64) -> bool {
    let expected_trust = compute_trust(new_badge, current_block);
    new_badge.trust == expected_trust
}

fn flags_and_risk_correctly_computed(new_badge: &VeilBadge, current_block: u64) -> bool {
    let expected_flags = compute_flags(new_badge, 0, current_block);
    new_badge.flags == expected_flags && new_badge.risk == compute_risk(&expected_flags)
}

fn flags_correctly_computed(new_badge: &VeilBadge, current_block: u64) -> bool {
    let expected_flags = compute_flags(new_badge, 0, current_block);
    new_badge.flags == expected_flags
}

fn last_update_is_current(new_badge: &VeilBadge, current_block: u64) -> bool {
    new_badge.last_update == current_block
}

fn total_stake_committed(badge: &VeilBadge) -> u8 {
    badge.vouches_out.iter()
        .map(|v| v.stake_percent)
        .fold(0u8, |acc, s| acc.saturating_add(s))
}

fn has_outgoing_vouch_to(badge: &VeilBadge, target_id: B32) -> bool {
    badge.vouches_out.iter().any(|v| v.badge_id == target_id)
}

fn has_incoming_vouch_from(badge: &VeilBadge, source_id: B32) -> bool {
    badge.vouches_in.iter().any(|v| v.badge_id == source_id)
}

fn find_outgoing_vouch<'a>(badge: &'a VeilBadge, target_id: B32) -> Option<&'a Vouch> {
    badge.vouches_out.iter().find(|v| v.badge_id == target_id)
}

fn find_incoming_vouch<'a>(badge: &'a VeilBadge, source_id: B32) -> Option<&'a Vouch> {
    badge.vouches_in.iter().find(|v| v.badge_id == source_id)
}

fn vouch_list_has_addition<F>(old_list: &[Vouch], new_list: &[Vouch], expected_new: &Vouch, all_old_present: F) -> bool
where
    F: Fn(&Vouch) -> bool,
{
    new_list.len() == old_list.len() + 1
        && new_list.contains(expected_new)
        && old_list.iter().all(|v| all_old_present(v))
}

fn vouch_list_has_removal(old_list: &[Vouch], new_list: &[Vouch], removed_id: B32) -> bool {
    new_list.len() == old_list.len() - 1
        && !new_list.iter().any(|v| v.badge_id == removed_id)
        && old_list.iter()
            .filter(|v| v.badge_id != removed_id)
            .all(|v| new_list.contains(v))
}

// ============================================================================
// Validation Functions
// ============================================================================

pub fn validate_vouch(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    target_badge_id: B32,
    stake_percent: u8,
    unlock_delay_blocks: u64,
    current_block: u64,
    witness: &VouchWitness,
) -> bool {
    // Validate stake parameters
    check!(stake_percent >= 1 && stake_percent <= 100);
    check!(unlock_delay_blocks >= MIN_VOUCH_LOCK_BLOCKS);

    // Validate vouch preconditions
    check!(!has_outgoing_vouch_to(old_badge, target_badge_id));
    check!(target_badge_id != old_badge.id);
    check!(total_stake_committed(old_badge).saturating_add(stake_percent) <= 100);

    // Validate trust requirements
    check!(old_badge.trust >= MIN_TRUST_TO_VOUCH);
    check!(witness.target_current_trust >= MIN_TRUST_TO_RECEIVE_VOUCH);

    // Validate immutable fields
    check!(badge_identity_unchanged(old_badge, new_badge));
    check!(transaction_counters_unchanged(old_badge, new_badge));
    check!(volume_fields_unchanged(old_badge, new_badge));
    check!(window_fields_unchanged(old_badge, new_badge));
    check!(vouches_in_unchanged(old_badge, new_badge));
    check!(cascade_damage_unchanged(old_badge, new_badge));

    // Validate vouch addition
    let expected_vouch = Vouch {
        badge_id: target_badge_id,
        stake_percent,
        created_at: current_block,
        unlock_at: current_block + unlock_delay_blocks,
    };

    check!(new_badge.vouches_out.len() == old_badge.vouches_out.len() + 1);
    check!(new_badge.vouches_out.contains(&expected_vouch));
    for vouch in &old_badge.vouches_out {
        check!(new_badge.vouches_out.contains(vouch));
    }

    // Validate computed fields
    check!(trust_correctly_computed(new_badge, current_block));
    check!(last_update_is_current(new_badge, current_block));

    true
}

pub fn validate_receive_vouch(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    voucher_badge_id: B32,
    stake_percent: u8,
    vouch_created_at: u64,
    vouch_unlock_at: u64,
    current_block: u64,
) -> bool {
    // Validate immutable fields
    check!(badge_identity_unchanged(old_badge, new_badge));
    check!(transaction_counters_unchanged(old_badge, new_badge));
    check!(vouches_out_unchanged(old_badge, new_badge));

    // Validate vouch precondition
    check!(!has_incoming_vouch_from(old_badge, voucher_badge_id));

    // Validate vouch addition
    let expected_vouch = Vouch {
        badge_id: voucher_badge_id,
        stake_percent,
        created_at: vouch_created_at,
        unlock_at: vouch_unlock_at,
    };

    check!(new_badge.vouches_in.len() == old_badge.vouches_in.len() + 1);
    check!(new_badge.vouches_in.contains(&expected_vouch));

    // Validate computed fields
    check!(trust_correctly_computed(new_badge, current_block));
    check!(new_badge.trust >= old_badge.trust);
    check!(flags_and_risk_correctly_computed(new_badge, current_block));

    true
}

pub fn validate_unvouch(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    target_badge_id: B32,
    current_block: u64,
) -> bool {
    // Find and validate the vouch exists and is unlocked
    let vouch = find_outgoing_vouch(old_badge, target_badge_id);
    check!(vouch.is_some());
    let vouch = vouch.unwrap();
    check!(current_block >= vouch.unlock_at);

    // Validate immutable fields
    check!(badge_identity_unchanged(old_badge, new_badge));
    check!(transaction_counters_unchanged(old_badge, new_badge));
    check!(new_badge.volume_total == old_badge.volume_total);
    check!(vouches_in_unchanged(old_badge, new_badge));
    check!(cascade_damage_unchanged(old_badge, new_badge));

    // Validate vouch removal
    check!(vouch_list_has_removal(&old_badge.vouches_out, &new_badge.vouches_out, target_badge_id));

    // Validate computed fields
    check!(last_update_is_current(new_badge, current_block));

    true
}

pub fn validate_lose_vouch(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    voucher_badge_id: B32,
    current_block: u64,
) -> bool {
    // Validate the incoming vouch exists
    check!(find_incoming_vouch(old_badge, voucher_badge_id).is_some());

    // Validate immutable fields
    check!(badge_identity_unchanged(old_badge, new_badge));
    check!(vouches_out_unchanged(old_badge, new_badge));

    // Validate vouch removal
    check!(vouch_list_has_removal(&old_badge.vouches_in, &new_badge.vouches_in, voucher_badge_id));

    // Validate computed fields
    check!(trust_correctly_computed(new_badge, current_block));
    check!(flags_correctly_computed(new_badge, current_block));

    true
}

pub fn validate_cascade(
    old_badge: &VeilBadge,
    new_badge: &VeilBadge,
    source_badge_id: B32,
    damage: u64,
    witness: &CascadeWitness,
    current_block: u64,
) -> bool {
    // Find and validate the vouch exists
    let vouch = find_outgoing_vouch(old_badge, source_badge_id);
    check!(vouch.is_some());
    let vouch = vouch.unwrap();

    // Validate witness consistency
    check!(witness.vouch_record.badge_id == source_badge_id);
    check!(witness.vouch_record.stake_percent == vouch.stake_percent);
    check!(witness.source_negative_proof.new_tx_negative >
           witness.source_negative_proof.prev_tx_negative);

    // Validate damage calculation
    let expected_damage = calculate_cascade_damage(
        &witness.source_negative_proof.severity,
        vouch.stake_percent,
    );
    check!(damage == expected_damage);

    // Validate immutable fields
    check!(badge_identity_unchanged(old_badge, new_badge));
    check!(transaction_counters_unchanged(old_badge, new_badge));
    check!(new_badge.volume_total == old_badge.volume_total);
    check!(vouches_out_unchanged(old_badge, new_badge));
    check!(vouches_in_unchanged(old_badge, new_badge));

    // Validate cascade damage update
    check!(new_badge.cascade_damage == old_badge.cascade_damage + damage);

    // Validate computed fields
    check!(trust_correctly_computed(new_badge, current_block));
    check!(new_badge.trust <= old_badge.trust);
    check!(flags_and_risk_correctly_computed(new_badge, current_block));
    check!(last_update_is_current(new_badge, current_block));

    true
}

pub fn compute_network_score(badge: &VeilBadge) -> u64 {
    badge.vouches_in.iter()
        .map(|v| v.stake_percent as u64)
        .sum()
}

pub fn can_vouch(badge: &VeilBadge) -> bool {
    badge.trust >= MIN_TRUST_TO_VOUCH
}

pub fn can_receive_vouch(badge: &VeilBadge) -> bool {
    badge.trust >= MIN_TRUST_TO_RECEIVE_VOUCH
}

pub fn remaining_vouch_capacity(badge: &VeilBadge) -> u8 {
    100u8.saturating_sub(total_stake_committed(badge))
}
