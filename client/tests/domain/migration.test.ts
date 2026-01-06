// Migration Domain Tests
// ============================================================================
// Tests for VK registry and migration detection functions

import { describe, it, expect } from 'vitest';
import {
  VEIL_APP_VK,
  VEIL_PREVIOUS_VKS,
  VEIL_ALL_KNOWN_VKS,
  isCurrentVk,
  isKnownVk,
  badgeNeedsMigration,
} from '../../src/domain/charm';
import { TEST_VKS } from '../fixtures';

describe('VK Registry', () => {
  describe('VEIL_APP_VK', () => {
    it('should be a 64-character hex string', () => {
      expect(VEIL_APP_VK).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should not be in VEIL_PREVIOUS_VKS', () => {
      expect(VEIL_PREVIOUS_VKS).not.toContain(VEIL_APP_VK);
    });
  });

  describe('VEIL_PREVIOUS_VKS', () => {
    it('should be an array of 64-character hex strings', () => {
      for (const vk of VEIL_PREVIOUS_VKS) {
        expect(vk).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it('should not contain duplicates', () => {
      const unique = new Set(VEIL_PREVIOUS_VKS);
      expect(unique.size).toBe(VEIL_PREVIOUS_VKS.length);
    });

    it('should have at least one previous VK', () => {
      expect(VEIL_PREVIOUS_VKS.length).toBeGreaterThan(0);
    });
  });

  describe('VEIL_ALL_KNOWN_VKS', () => {
    it('should include current VK', () => {
      expect(VEIL_ALL_KNOWN_VKS).toContain(VEIL_APP_VK);
    });

    it('should include all previous VKs', () => {
      for (const vk of VEIL_PREVIOUS_VKS) {
        expect(VEIL_ALL_KNOWN_VKS).toContain(vk);
      }
    });

    it('should have length = 1 + previous count', () => {
      expect(VEIL_ALL_KNOWN_VKS.length).toBe(1 + VEIL_PREVIOUS_VKS.length);
    });
  });
});

describe('isCurrentVk', () => {
  it('should return true for current VK', () => {
    expect(isCurrentVk(VEIL_APP_VK)).toBe(true);
  });

  it('should return false for previous VKs', () => {
    for (const vk of VEIL_PREVIOUS_VKS) {
      expect(isCurrentVk(vk)).toBe(false);
    }
  });

  it('should return false for unknown VK', () => {
    expect(isCurrentVk(TEST_VKS.unknown)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isCurrentVk('')).toBe(false);
  });

  it('should be case-sensitive', () => {
    expect(isCurrentVk(VEIL_APP_VK.toUpperCase())).toBe(false);
  });
});

describe('isKnownVk', () => {
  it('should return true for current VK', () => {
    expect(isKnownVk(VEIL_APP_VK)).toBe(true);
  });

  it('should return true for all previous VKs', () => {
    for (const vk of VEIL_PREVIOUS_VKS) {
      expect(isKnownVk(vk)).toBe(true);
    }
  });

  it('should return false for unknown VK', () => {
    expect(isKnownVk(TEST_VKS.unknown)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isKnownVk('')).toBe(false);
  });

  it('should return false for partial VK match', () => {
    const partialVk = VEIL_APP_VK.slice(0, 32);
    expect(isKnownVk(partialVk)).toBe(false);
  });
});

describe('badgeNeedsMigration', () => {
  it('should return false for current VK (no migration needed)', () => {
    expect(badgeNeedsMigration(VEIL_APP_VK)).toBe(false);
  });

  it('should return true for previous VKs (migration needed)', () => {
    for (const vk of VEIL_PREVIOUS_VKS) {
      expect(badgeNeedsMigration(vk)).toBe(true);
    }
  });

  it('should return false for unknown VK (cannot migrate unknown badges)', () => {
    expect(badgeNeedsMigration(TEST_VKS.unknown)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(badgeNeedsMigration('')).toBe(false);
  });

  describe('migration scenarios', () => {
    it('should identify v0 legacy badges as needing migration', () => {
      // If TEST_VKS.legacy is in VEIL_PREVIOUS_VKS
      if (VEIL_PREVIOUS_VKS.includes(TEST_VKS.legacy)) {
        expect(badgeNeedsMigration(TEST_VKS.legacy)).toBe(true);
      }
    });

    it('should identify immediately previous version as needing migration', () => {
      // The most recent previous VK should need migration
      if (VEIL_PREVIOUS_VKS.length > 0) {
        const mostRecentPrevious = VEIL_PREVIOUS_VKS[VEIL_PREVIOUS_VKS.length - 1];
        expect(badgeNeedsMigration(mostRecentPrevious)).toBe(true);
      }
    });
  });
});

describe('Migration Decision Matrix', () => {
  // Truth table for migration logic
  const testCases = [
    { vk: 'current', isKnown: true, isCurrent: true, needsMigration: false },
    { vk: 'previous', isKnown: true, isCurrent: false, needsMigration: true },
    { vk: 'unknown', isKnown: false, isCurrent: false, needsMigration: false },
  ];

  it.each(testCases)(
    'VK=$vk: isKnown=$isKnown, isCurrent=$isCurrent, needsMigration=$needsMigration',
    ({ vk, isKnown, isCurrent, needsMigration }) => {
      const actualVk =
        vk === 'current'
          ? VEIL_APP_VK
          : vk === 'previous'
            ? VEIL_PREVIOUS_VKS[0]
            : TEST_VKS.unknown;

      expect(isKnownVk(actualVk)).toBe(isKnown);
      expect(isCurrentVk(actualVk)).toBe(isCurrent);
      expect(badgeNeedsMigration(actualVk)).toBe(needsMigration);
    }
  );
});

describe('VK Format Validation', () => {
  it('all VKs should be valid hex strings', () => {
    const allVks = [VEIL_APP_VK, ...VEIL_PREVIOUS_VKS];
    for (const vk of allVks) {
      expect(vk).toHaveLength(64);
      expect(vk).toMatch(/^[0-9a-f]+$/);
    }
  });

  it('VKs should be lowercase hex', () => {
    const allVks = [VEIL_APP_VK, ...VEIL_PREVIOUS_VKS];
    for (const vk of allVks) {
      expect(vk).toBe(vk.toLowerCase());
    }
  });
});
