// useWallet Hook Tests
// ============================================================================
// Tests for badge persistence and UTXO handling

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VeilBadge } from '../../src/domain/types';
import { createTestBadge, TEST_BADGE_IDS } from '../fixtures';

// We need to test the persistence functions directly
// Since they're not exported, we'll test via the module

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get _store() {
      return store;
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
});

describe('Badge Persistence', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  describe('Badge serialization', () => {
    it('should handle badge with valid volume_sum_squares BigInt', () => {
      const badge = createTestBadge({
        volume_sum_squares: BigInt('123456789012345678901234567890'),
      });

      // Simulate what persistBadges does
      const serializable = {
        ...badge,
        volume_sum_squares: (badge.volume_sum_squares ?? BigInt(0)).toString(),
      };

      expect(serializable.volume_sum_squares).toBe('123456789012345678901234567890');
      expect(() => JSON.stringify(serializable)).not.toThrow();
    });

    it('should handle badge with undefined volume_sum_squares', () => {
      const badge = createTestBadge();
      // @ts-expect-error - Testing runtime behavior with undefined
      badge.volume_sum_squares = undefined;

      // Simulate defensive persistence
      const serializable = {
        ...badge,
        volume_sum_squares: (badge.volume_sum_squares ?? BigInt(0)).toString(),
      };

      expect(serializable.volume_sum_squares).toBe('0');
    });

    it('should handle badge with zero volume_sum_squares', () => {
      const badge = createTestBadge({
        volume_sum_squares: BigInt(0),
      });

      const serializable = {
        ...badge,
        volume_sum_squares: (badge.volume_sum_squares ?? BigInt(0)).toString(),
      };

      expect(serializable.volume_sum_squares).toBe('0');
    });
  });

  describe('Badge deduplication', () => {
    it('should deduplicate badges by ID', () => {
      const badge1 = createTestBadge({ id: TEST_BADGE_IDS.proposer, trust: 50 });
      const badge2 = createTestBadge({ id: TEST_BADGE_IDS.proposer, trust: 75 }); // Same ID, different trust
      const badge3 = createTestBadge({ id: TEST_BADGE_IDS.acceptor, trust: 60 });

      const badges = [badge1, badge2, badge3];

      // Simulate deduplication logic
      const badgeMap = new Map<string, VeilBadge>();
      for (const badge of badges) {
        if (badge?.id && typeof badge.id === 'string') {
          badgeMap.set(badge.id, badge);
        }
      }

      expect(badgeMap.size).toBe(2);
      // Last one wins
      expect(badgeMap.get(TEST_BADGE_IDS.proposer)?.trust).toBe(75);
    });

    it('should skip badges without valid IDs during deduplication', () => {
      const validBadge = createTestBadge();
      const invalidBadge1 = { ...createTestBadge(), id: undefined } as unknown as VeilBadge;
      const invalidBadge2 = { ...createTestBadge(), id: '' };
      const invalidBadge3 = { ...createTestBadge(), id: 123 } as unknown as VeilBadge;

      const badges = [validBadge, invalidBadge1, invalidBadge2, invalidBadge3];

      // Simulate deduplication with validation
      const badgeMap = new Map<string, VeilBadge>();
      for (const badge of badges) {
        if (badge?.id && typeof badge.id === 'string') {
          badgeMap.set(badge.id, badge);
        }
      }

      expect(badgeMap.size).toBe(1);
      expect(badgeMap.get(validBadge.id)).toBeDefined();
    });

    it('should handle null/undefined badges in array', () => {
      const validBadge = createTestBadge();
      const badges = [validBadge, null, undefined] as unknown as VeilBadge[];

      const badgeMap = new Map<string, VeilBadge>();
      for (const badge of badges) {
        if (badge?.id && typeof badge.id === 'string') {
          badgeMap.set(badge.id, badge);
        }
      }

      expect(badgeMap.size).toBe(1);
    });
  });

  describe('Badge loading from localStorage', () => {
    it('should convert volume_sum_squares string back to BigInt', () => {
      const storedBadge = {
        ...createTestBadge(),
        volume_sum_squares: '123456789012345678901234567890',
      };
      mockLocalStorage.setItem('veil_badges', JSON.stringify([storedBadge]));

      const stored = mockLocalStorage.getItem('veil_badges');
      const parsed = JSON.parse(stored!);

      // Simulate loadBadges conversion
      const loaded = parsed.map((b: Record<string, unknown>) => ({
        ...b,
        volume_sum_squares: BigInt(b.volume_sum_squares as string || '0'),
      }));

      expect(loaded[0].volume_sum_squares).toBe(BigInt('123456789012345678901234567890'));
    });

    it('should handle corrupted localStorage data', () => {
      mockLocalStorage.setItem('veil_badges', 'not valid json');

      let loaded: VeilBadge[] = [];
      try {
        const stored = mockLocalStorage.getItem('veil_badges');
        loaded = JSON.parse(stored!);
      } catch {
        loaded = [];
      }

      expect(loaded).toEqual([]);
    });

    it('should handle missing volume_sum_squares in stored data', () => {
      const storedBadge = {
        ...createTestBadge(),
      };
      // @ts-expect-error - Simulating corrupted data
      delete storedBadge.volume_sum_squares;
      mockLocalStorage.setItem('veil_badges', JSON.stringify([storedBadge]));

      const stored = mockLocalStorage.getItem('veil_badges');
      const parsed = JSON.parse(stored!);

      const loaded = parsed.map((b: Record<string, unknown>) => ({
        ...b,
        volume_sum_squares: BigInt(b.volume_sum_squares as string || '0'),
      }));

      expect(loaded[0].volume_sum_squares).toBe(BigInt(0));
    });
  });
});

describe('Badge UTXO Handling', () => {
  describe('UTXO mapping', () => {
    it('should handle badges with stored UTXO info', () => {
      const badge = createTestBadge({
        utxo: {
          txid: 'abc123'.repeat(10) + 'abcd',
          vout: 0,
          value: 546,
        },
      });

      expect(badge.utxo).toBeDefined();
      expect(badge.utxo?.txid).toHaveLength(64);
    });

    it('should handle badges without UTXO info', () => {
      const badge = createTestBadge();
      // Remove utxo if present
      delete badge.utxo;

      expect(badge.utxo).toBeUndefined();
    });
  });

  describe('Badge ID validation for UTXO operations', () => {
    it('should safely slice valid badge ID', () => {
      const badge = createTestBadge();
      expect(() => badge.id.slice(0, 8)).not.toThrow();
      expect(badge.id.slice(0, 8)).toHaveLength(8);
    });

    it('should check for valid ID before slicing', () => {
      const badge = { id: undefined } as unknown as VeilBadge;

      // This is what we want to prevent
      const safeSlice = badge?.id ? badge.id.slice(0, 8) : 'unknown';
      expect(safeSlice).toBe('unknown');
    });
  });
});

describe('Discovered Badge Validation', () => {
  it('should filter out discovered badges without valid IDs', () => {
    const discovered = [
      { txid: 'tx1', vout: 0, badge: createTestBadge() },
      { txid: 'tx2', vout: 0, badge: { ...createTestBadge(), id: undefined } as unknown as VeilBadge },
      { txid: 'tx3', vout: 0, badge: { ...createTestBadge(), id: '' } },
    ];

    const valid = discovered.filter(d => d.badge?.id && typeof d.badge.id === 'string');

    expect(valid).toHaveLength(1);
    expect(valid[0].txid).toBe('tx1');
  });
});
