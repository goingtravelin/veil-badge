

// validated by zkVM apps.
//
// This module contains:
// - Charm entity definition
// - App specification rules
// - Charm validation logic
// - Domain invariants

export type CharmTag = 'n' | 't';

export interface CharmApp {
  /** App type: 'n' for NFT, 't' for fungible token */
  tag: CharmTag;

  /** App identity (32 bytes hex) - unique identifier */
  identity: string;

  /** Verification key (32 bytes hex) - commitment to app code */
  vk: string;
}

export interface Charm {
  /** The app that validates this charm */
  app: CharmApp;

  /** The charm data (app-specific) */
  data: unknown;
}

export function appToString(app: CharmApp): string {
  return `${app.tag}/${app.identity}/${app.vk}`;
}

export function parseAppSpec(spec: string): CharmApp | null {
  const parts = spec.split('/');
  if (parts.length !== 3) {
    return null;
  }

  const [tag, identity, vk] = parts;

  if (tag !== 'n' && tag !== 't') {
    return null;
  }

  if (!/^[0-9a-fA-F]{64}$/.test(identity) || !/^[0-9a-fA-F]{64}$/.test(vk)) {
    return null;
  }

  return {
    tag: tag as CharmTag,
    identity,
    vk,
  };
}

export interface CharmValidationError {
  field: string;
  message: string;
}

export interface CharmValidationResult {
  valid: boolean;
  errors: CharmValidationError[];
}

export function validateCharmApp(app: CharmApp): CharmValidationResult {
  const errors: CharmValidationError[] = [];

  // Validate tag
  if (app.tag !== 'n' && app.tag !== 't') {
    errors.push({
      field: 'tag',
      message: `Invalid tag: "${app.tag}". Must be 'n' (NFT) or 't' (token).`,
    });
  }

  // Validate identity
  if (!/^[0-9a-fA-F]{64}$/.test(app.identity)) {
    errors.push({
      field: 'identity',
      message: `Invalid identity: must be 64 hex characters (32 bytes). Got: ${app.identity.length} chars.`,
    });
  }

  // Validate VK
  if (!/^[0-9a-fA-F]{64}$/.test(app.vk)) {
    errors.push({
      field: 'vk',
      message: `Invalid verification key: must be 64 hex characters (32 bytes). Got: ${app.vk.length} chars.`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidCharmApp(app: CharmApp): boolean {
  return validateCharmApp(app).valid;
}

export function isNFT(charm: Charm): boolean {
  return charm.app.tag === 'n';
}

export function isToken(charm: Charm): boolean {
  return charm.app.tag === 't';
}

export function getCharmTypeName(charm: Charm): string {
  return charm.app.tag === 'n' ? 'NFT' : 'Token';
}

export function createNFT(identity: string, vk: string, data: unknown): Charm {
  return {
    app: {
      tag: 'n',
      identity,
      vk,
    },
    data,
  };
}

export function createToken(identity: string, vk: string, amount: number): Charm {
  return {
    app: {
      tag: 't',
      identity,
      vk,
    },
    data: amount,
  };
}

// VEIL-SPECIFIC CHARM

export const VEIL_APP_IDENTITY = '0'.repeat(64); 

export const VEIL_APP_VK = '8106b8702451d5536e06d802aa343c4114df0376934df5494adb72fb2057329b';

// Previous VKs that are accepted for migration
// NOTE: Only add VKs here if you have the corresponding WASM binary archived
// in client/public/wasm/veil-{vk-prefix}.wasm
export const VEIL_PREVIOUS_VKS: string[] = [
  'c64ee9ff499b845c18ae0734fdb4b3fe6a5ae0d65eb3fb10adcbaa5e6d4bc4d3',
  '387be787323b18dee023608f81ee6ba263b3b5a63efb4953a4ca6541e95c48b6',
  'ce9c54337c77f295a8b6446ec1ba32d26a1b1171512a761362b5f4f437186342',
  '82ec6997e7174e3b298cc54b154150eebfdca3d504137cc6b8620d8c17e57da4',
  'bc4b45c7d3ad40d4ebccf6a6f7db1ba44aa6c82ef80b0eae42174eaaf1133713',
  '02e3736591af4cab8589ccba49cd4d796d708075ea19a840f5132681caaa80f6',
  '59df696e64b3ab02aa7255841031d1e0ebedfc3afae0b6a99bbe00a6e11a0140',
  '78cd7c1a0767d2ded75c5bf65795c68f44c97869c55c3e0a000a40cc384b6ee6',
];

// All known VKs (current + previous)
export const VEIL_ALL_KNOWN_VKS: string[] = [VEIL_APP_VK, ...VEIL_PREVIOUS_VKS];

export function isCurrentVk(vk: string): boolean {
  return vk === VEIL_APP_VK;
}

export function isKnownVk(vk: string): boolean {
  return VEIL_ALL_KNOWN_VKS.includes(vk);
}

export function badgeNeedsMigration(badgeVk: string): boolean {
  return isKnownVk(badgeVk) && !isCurrentVk(badgeVk);
}

export function isVeilBadge(charm: Charm): boolean {
  return (
    charm.app.tag === 'n' &&
    charm.app.identity === VEIL_APP_IDENTITY &&
    charm.app.vk === VEIL_APP_VK
  );
}

export function isVeilBadgeApp(app: CharmApp): boolean {
  return (
    app.tag === 'n' &&
    app.identity === VEIL_APP_IDENTITY &&
    app.vk === VEIL_APP_VK
  );
}

export function isVeilBadgeAppSpec(appSpec: string): boolean {
  const parsed = parseAppSpec(appSpec);
  return parsed !== null && isVeilBadgeApp(parsed);
}

export function getVeilBadgeAppSpec(): CharmApp {
  return {
    tag: 'n',
    identity: VEIL_APP_IDENTITY,
    vk: VEIL_APP_VK,
  };
}

export function serializeCharmData(data: unknown): Uint8Array {
  const json = JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
  return new TextEncoder().encode(json);
}

export function deserializeCharmData(bytes: Uint8Array): unknown {
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json, (_key, value) => {
    // Attempt to restore BigInt values if they look like stringified BigInts
    if (typeof value === 'string' && /^\d+$/.test(value) && value.length > 15) {
      try {
        return BigInt(value);
      } catch {
        return value;
      }
    }
    return value;
  });
}
