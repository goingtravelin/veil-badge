// Charms Utilities Tests
// ============================================================================
// Tests for badge extraction, validation, and spell parsing

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  extractVeilBadge,
  hasVeilBadge,
  parseAppSpec,
  buildAppSpec,
  type ParsedSpell,
} from '../../src/utils/charms';
import { VEIL_APP_VK, VEIL_APP_IDENTITY } from '../../src/domain';

// Helper to create a mock ParsedSpell
function createMockSpell(overrides: Partial<ParsedSpell> = {}): ParsedSpell {
  const defaultAppSpec = `n/${VEIL_APP_IDENTITY}/${VEIL_APP_VK}`;
  
  return {
    version: 8,
    tx: {
      ins: ['abc123:0'],
      outs: [new Map([[0, createValidBadgeData()]])],
    },
    app_public_inputs: new Map([[defaultAppSpec, { Transfer: null }]]),
    ...overrides,
  };
}

// Helper to create valid badge data as returned by WASM
function createValidBadgeData(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'a'.repeat(64),
    created_at: 100000,
    pubkey: '02' + 'b'.repeat(64),
    tx_total: 0,
    tx_positive: 0,
    tx_negative: 0,
    volume_total: 0,
    volume_sum_squares: 0, // WASM returns number, not BigInt
    window_tx_count: 0,
    window_volume: 0,
    window_start: 100000,
    counterparty_count: 0,
    backing: {
      backed_count: 0,
      unbacked_count: 0,
      backed_volume: 0,
      unbacked_volume: 0,
    },
    vouches_out: [],
    vouches_in: [],
    cascade_damage: 0,
    trust: 15,
    risk: 35,
    flags: 0,
    active_transactions: [],
    reporting_transactions: [],
    outcomes: {
      mutual_positive: 0,
      mutual_negative: 0,
      contested_i_positive: 0,
      contested_i_negative: 0,
      timeout: 0,
      mutual_timeout: 0,
    },
    last_nonce: '0'.repeat(64),
    last_update: 100000,
    ...overrides,
  };
}

describe('extractVeilBadge', () => {
  const veilAppId = `n/${VEIL_APP_IDENTITY}/${VEIL_APP_VK}`;

  describe('valid badge extraction', () => {
    it('should extract a valid badge from spell', () => {
      const spell = createMockSpell();
      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).not.toBeNull();
      expect(badge?.id).toBe('a'.repeat(64));
    });

    it('should extract badge when charm data is a Map (WASM output format)', () => {
      // WASM returns badge data as Map(24) not a plain object
      const spell = createMockSpell();
      const badgeData = createValidBadgeData();
      
      // Create a Map from the badge data entries (simulating WASM output)
      const badgeAsMap = new Map(Object.entries(badgeData));
      (spell.tx.outs[0] as Map<number, unknown>).set(0, badgeAsMap);

      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).not.toBeNull();
      expect(badge?.id).toBe('a'.repeat(64));
      expect(badge?.volume).toBe(100);
    });

    it('should convert volume_sum_squares number to BigInt', () => {
      const spell = createMockSpell();
      // WASM returns number
      (spell.tx.outs[0] as Map<number, unknown>).set(0, createValidBadgeData({
        volume_sum_squares: 1000000,
      }));

      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).not.toBeNull();
      expect(typeof badge?.volume_sum_squares).toBe('bigint');
      expect(badge?.volume_sum_squares).toBe(BigInt(1000000));
    });

    it('should handle volume_sum_squares already as BigInt', () => {
      const spell = createMockSpell();
      (spell.tx.outs[0] as Map<number, unknown>).set(0, createValidBadgeData({
        volume_sum_squares: BigInt('999999999999'),
      }));

      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).not.toBeNull();
      expect(badge?.volume_sum_squares).toBe(BigInt('999999999999'));
    });
  });

  describe('invalid badge handling', () => {
    it('should return null for badge with missing id', () => {
      const spell = createMockSpell();
      const invalidBadgeData = createValidBadgeData();
      delete (invalidBadgeData as Record<string, unknown>).id;
      (spell.tx.outs[0] as Map<number, unknown>).set(0, invalidBadgeData);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[extractVeilBadge] Invalid badge: missing or invalid id',
        expect.any(Object)
      );
      consoleSpy.mockRestore();
    });

    it('should return null for badge with undefined id', () => {
      const spell = createMockSpell();
      (spell.tx.outs[0] as Map<number, unknown>).set(0, createValidBadgeData({
        id: undefined,
      }));

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should return null for badge with empty string id', () => {
      const spell = createMockSpell();
      (spell.tx.outs[0] as Map<number, unknown>).set(0, createValidBadgeData({
        id: '',
      }));

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should return null for badge with non-string id', () => {
      const spell = createMockSpell();
      (spell.tx.outs[0] as Map<number, unknown>).set(0, createValidBadgeData({
        id: 12345,
      }));

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const badge = extractVeilBadge(spell, veilAppId, 0);

      expect(badge).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should return null for null spell', () => {
      const badge = extractVeilBadge(null as unknown as ParsedSpell, veilAppId, 0);
      expect(badge).toBeNull();
    });

    it('should return null for spell without tx', () => {
      const spell = { version: 8 } as ParsedSpell;
      const badge = extractVeilBadge(spell, veilAppId, 0);
      expect(badge).toBeNull();
    });

    it('should return null for spell without outs', () => {
      const spell = {
        version: 8,
        tx: { ins: ['abc:0'] },
      } as ParsedSpell;
      const badge = extractVeilBadge(spell, veilAppId, 0);
      expect(badge).toBeNull();
    });

    it('should return null for output index out of bounds', () => {
      const spell = createMockSpell();
      const badge = extractVeilBadge(spell, veilAppId, 5);
      expect(badge).toBeNull();
    });

    it('should return null for negative output index', () => {
      const spell = createMockSpell();
      const badge = extractVeilBadge(spell, veilAppId, -1);
      expect(badge).toBeNull();
    });

    it('should return null when output is not a Map', () => {
      const spell = createMockSpell();
      spell.tx.outs[0] = {} as unknown as Map<number, unknown>;
      const badge = extractVeilBadge(spell, veilAppId, 0);
      expect(badge).toBeNull();
    });

    it('should return null when charm data is null', () => {
      const spell = createMockSpell();
      (spell.tx.outs[0] as Map<number, unknown>).set(0, null);
      const badge = extractVeilBadge(spell, veilAppId, 0);
      expect(badge).toBeNull();
    });

    it('should return null when charm data is not an object', () => {
      const spell = createMockSpell();
      (spell.tx.outs[0] as Map<number, unknown>).set(0, 'not an object');
      const badge = extractVeilBadge(spell, veilAppId, 0);
      expect(badge).toBeNull();
    });

    it('should return null when app not found in spell', () => {
      const spell = createMockSpell();
      spell.app_public_inputs = new Map([['n/different/vk', {}]]);
      const badge = extractVeilBadge(spell, veilAppId, 0);
      expect(badge).toBeNull();
    });
  });
});

describe('hasVeilBadge', () => {
  const veilAppId = `n/${VEIL_APP_IDENTITY}/${VEIL_APP_VK}`;

  it('should return true when VK matches', () => {
    const spell = createMockSpell();
    expect(hasVeilBadge(spell, veilAppId)).toBe(true);
  });

  it('should return false when VK does not match', () => {
    const spell = createMockSpell();
    spell.app_public_inputs = new Map([['n/someid/differentvk', {}]]);
    expect(hasVeilBadge(spell, veilAppId)).toBe(false);
  });

  it('should return false for null spell', () => {
    expect(hasVeilBadge(null as unknown as ParsedSpell, veilAppId)).toBe(false);
  });

  it('should return false for spell without app_public_inputs', () => {
    const spell = { version: 8 } as ParsedSpell;
    expect(hasVeilBadge(spell, veilAppId)).toBe(false);
  });

  it('should match VK regardless of identity', () => {
    const spell = createMockSpell();
    // Different identity, same VK
    spell.app_public_inputs = new Map([[`n/differentidentity/${VEIL_APP_VK}`, {}]]);
    expect(hasVeilBadge(spell, veilAppId)).toBe(true);
  });
});

describe('parseAppSpec', () => {
  it('should parse valid NFT app spec', () => {
    const identity = 'a'.repeat(64);
    const vk = 'b'.repeat(64);
    const result = parseAppSpec(`n/${identity}/${vk}`);

    expect(result).toEqual({
      tag: 'n',
      identity,
      vk,
    });
  });

  it('should parse valid token app spec', () => {
    const identity = 'a'.repeat(64);
    const vk = 'b'.repeat(64);
    const result = parseAppSpec(`t/${identity}/${vk}`);

    expect(result).toEqual({
      tag: 't',
      identity,
      vk,
    });
  });

  it('should return null for invalid tag', () => {
    const identity = 'a'.repeat(64);
    const vk = 'b'.repeat(64);
    expect(parseAppSpec(`x/${identity}/${vk}`)).toBeNull();
  });

  it('should return null for wrong number of parts', () => {
    expect(parseAppSpec('n/only/two')).toBeNull();
    expect(parseAppSpec('n/one')).toBeNull();
    expect(parseAppSpec('invalid')).toBeNull();
  });

  it('should return null for invalid identity length', () => {
    const vk = 'b'.repeat(64);
    expect(parseAppSpec(`n/tooshort/${vk}`)).toBeNull();
  });

  it('should return null for invalid vk length', () => {
    const identity = 'a'.repeat(64);
    expect(parseAppSpec(`n/${identity}/tooshort`)).toBeNull();
  });
});

describe('buildAppSpec', () => {
  it('should build correct app spec string', () => {
    const identity = 'a'.repeat(64);
    const vk = 'b'.repeat(64);

    const result = buildAppSpec({ tag: 'n', identity, vk });
    expect(result).toBe(`n/${identity}/${vk}`);
  });

  it('should handle token tag', () => {
    const identity = 'a'.repeat(64);
    const vk = 'b'.repeat(64);

    const result = buildAppSpec({ tag: 't', identity, vk });
    expect(result).toBe(`t/${identity}/${vk}`);
  });
});
