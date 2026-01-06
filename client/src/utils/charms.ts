
// CHARMS UTILITIES - Pure Helpers

// Pure functions for Charms protocol operations.

//

// use CharmsService from services/CharmsService.ts

import type { VeilBadge, RiskFlags } from '../domain/types';

export interface CharmsApp {
  tag: 'n' | 't';
  identity: string; // hex-encoded 32 bytes
  vk: string; // hex-encoded 32 bytes
}

export interface ParsedSpell {
  version: number;
  tx: {
    ins: string[]; // UTXO IDs: "txid:vout"
    outs: Map<number, unknown>[]; // Output index -> charm data
  };
  app_public_inputs: Map<string, unknown>; // App spec string -> public inputs
}

export interface CharmOutput {
  appSpec: string; // "tag/identity/vk"
  data: VeilBadge | number | unknown; // NFT data, token amount, or raw data
}

export interface CharmScanResult {
  hasCharms: boolean;
  charms: CharmOutput[];
  rawSpell?: ParsedSpell;
}

export const VEIL_APP_TAG = 'n';

/**
 * Decode risk flags from a bitfield number to a RiskFlags object.
 * Bit positions match the Rust enum order:
 * - bit 0 (0b00000001): acceleration
 * - bit 1 (0b00000010): extraction
 * - bit 2 (0b00000100): isolated
 * - bit 3 (0b00001000): too_clean
 * - bit 4 (0b00010000): erratic
 * - bit 5 (0b00100000): new_badge
 */
export function decodeRiskFlags(flags: number): RiskFlags {
  return {
    acceleration: (flags & 0b00000001) !== 0,
    extraction: (flags & 0b00000010) !== 0,
    isolated: (flags & 0b00000100) !== 0,
    too_clean: (flags & 0b00001000) !== 0,
    erratic: (flags & 0b00010000) !== 0,
    new_badge: (flags & 0b00100000) !== 0,
  };
}

export function parseAppSpec(appSpec: string): CharmsApp | null {
  const parts = appSpec.split('/');
  if (parts.length !== 3) return null;

  const [tag, identity, vk] = parts;
  if (tag !== 'n' && tag !== 't') return null;
  if (identity.length !== 64) return null; // 32 bytes hex
  if (vk.length !== 64) return null; // 32 bytes hex

  return { tag, identity, vk };
}

export function buildAppSpec(app: CharmsApp): string {
  return `${app.tag}/${app.identity}/${app.vk}`;
}

/**
 * Find the first NFT app spec in the spell (any VK)
 * Used when we need to extract a badge but don't know/care which VK it uses
 */
export function findFirstNftAppSpec(spell: ParsedSpell): string | null {
  if (!spell?.app_public_inputs) return null;

  for (const [appSpec] of spell.app_public_inputs) {
    const parts = appSpec.split('/');
    // Must be NFT (tag 'n') with valid 64-char identity and vk
    if (parts.length === 3 && parts[0] === 'n' && parts[1].length === 64 && parts[2].length === 64) {
      return appSpec;
    }
  }
  return null;
}

export function hasVeilBadge(spell: ParsedSpell, veilAppId: string): boolean {
  if (!spell?.app_public_inputs) return false;

  const parts = veilAppId.split('/');
  if (parts.length !== 3 || parts[0] !== 'n') {
    // Fallback to exact match for invalid format
    return spell.app_public_inputs.has(veilAppId);
  }

  const targetVk = parts[2];

  for (const [appSpec] of spell.app_public_inputs) {
    const appParts = appSpec.split('/');
    if (appParts.length === 3 && appParts[0] === 'n' && appParts[2] === targetVk) {
      return true;
    }
  }

  return false;
}

export function hasVeilBadgeByVk(spell: ParsedSpell, veilVk: string): boolean {
  if (!spell?.app_public_inputs) return false;

  for (const [appSpec] of spell.app_public_inputs) {
    const parts = appSpec.split('/');
    if (parts.length === 3 && parts[0] === 'n' && parts[2] === veilVk) {
      return true;
    }
  }

  return false;
}

export function extractVeilBadge(
  spell: ParsedSpell,
  veilAppId: string,
  outputIndex: number
): VeilBadge | null {
  if (!spell?.tx?.outs) return null;
  if (outputIndex < 0 || outputIndex >= spell.tx.outs.length) return null;

  const outputMap = spell.tx.outs[outputIndex];
  if (!(outputMap instanceof Map)) return null;

  const parts = veilAppId.split('/');
  if (parts.length !== 3 || parts[0] !== 'n') return null;
  const targetVk = parts[2];

  let appIndex = 0;
  let found = false;
  for (const [appSpec] of spell.app_public_inputs) {
    const appParts = appSpec.split('/');

    if (appParts.length === 3 && appParts[0] === 'n' && appParts[2] === targetVk) {
      found = true;
      break;
    }
    appIndex++;
  }

  if (!found) return null;

  const charmData = outputMap.get(appIndex);
  if (!charmData || typeof charmData !== 'object') return null;

  // WASM may return badge data as a Map - convert to plain object
  let badge: Record<string, unknown>;
  if (charmData instanceof Map) {
    badge = Object.fromEntries(charmData);
  } else {
    badge = charmData as Record<string, unknown>;
  }

  // Validate that the object has required VeilBadge properties
  if (typeof badge.id !== 'string' || !badge.id) {
    console.warn('[extractVeilBadge] Invalid badge: missing or invalid id', badge);
    return null;
  }

  // Ensure volume_sum_squares is a BigInt (WASM may return number or BigInt)
  if (badge.volume_sum_squares !== undefined) {
    badge.volume_sum_squares = BigInt(badge.volume_sum_squares as number | bigint);
  }

  // Convert flags from bitfield number to RiskFlags object if needed
  if (typeof badge.flags === 'number') {
    badge.flags = decodeRiskFlags(badge.flags);
  }

  return badge as unknown as VeilBadge;
}
