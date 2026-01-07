// Migration Spell Generator Tests
// ============================================================================
// Tests for badge migration spell generation (MigrateOut/MigrateIn)

import { describe, it, expect } from 'vitest';
import {
  generateMigrateBadgeSpell,
  type MigrateBadgeSpellParams,
} from '../../src/utils/spellGenerator';
import {
  createTestBadge,
  createLegacyBadge,
  createBadgeNeedingMigration,
  TEST_ADDRESSES,
  TEST_VKS,
} from '../fixtures';

describe('generateMigrateBadgeSpell', () => {
  describe('YAML Structure', () => {
    it('should generate valid YAML with version 8', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('version: 8');
    });

    it('should define two apps ($00 for old VK, $01 for new VK)', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('apps:');
      expect(spell).toContain('$00:');
      expect(spell).toContain('$01:');
      
      // Old VK should be in $00
      expect(spell).toContain(`$00: "n/${badge.id}/${oldVk}"`);
      // New VK should be in $01
      expect(spell).toContain(`$01: "n/${badge.id}/${TEST_VKS.current}"`);
    });

    it('should have one input with the badge UTXO', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('ins:');
      expect(spell).toContain(`utxo_id: "${utxo.txid}:${utxo.vout}"`);
    });

    it('should have one output with the destination address', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('outs:');
      expect(spell).toContain(`address: "${TEST_ADDRESSES.acceptor}"`);
      expect(spell).toContain('sats: 546'); // Dust limit
    });

    it('should include MigrateOut action for old app ($00)', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('public_args:');
      expect(spell).toContain('$00:');
      expect(spell).toContain('MigrateOut: {}');
    });

    it('should include MigrateIn action with from_vk for new app ($01)', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('$01:');
      expect(spell).toContain('MigrateIn:');
      expect(spell).toContain(`from_vk: "${oldVk}"`);
    });
  });

  describe('Badge Data Preservation', () => {
    it('should preserve schema_version in both input and output', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // Badge data should appear twice (ins and outs)
      const matches = spell.match(/schema_version: 1/g);
      expect(matches).toHaveLength(2);
    });

    it('should preserve badge id in both input and output', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      const idMatches = spell.match(new RegExp(`id: "${badge.id}"`, 'g'));
      expect(idMatches).toHaveLength(2);
    });

    it('should preserve pubkey in both input and output', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      const pubkeyMatches = spell.match(new RegExp(`pubkey: "${badge.pubkey}"`, 'g'));
      expect(pubkeyMatches).toHaveLength(2);
    });

    it('should preserve all aggregates (tx counts, volumes)', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // Each aggregate should appear twice
      expect(spell.match(/tx_total: 10/g)).toHaveLength(2);
      expect(spell.match(/tx_positive: 8/g)).toHaveLength(2);
      expect(spell.match(/tx_negative: 2/g)).toHaveLength(2);
      expect(spell.match(/volume_total: 1000000/g)).toHaveLength(2);
    });

    it('should preserve vouches arrays', () => {
      const badgeWithVouches = createTestBadge({
        id: 'voucher_badge_'.padEnd(64, '0'),
        vouches_out: [
          {
            badge_id: 'target_badge_'.padEnd(64, '0'),
            stake_percent: 25,
            created_at: 100000,
            unlock_at: 200000,
          },
        ],
      });
      
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: { txid: 'tx'.padEnd(64, '0'), vout: 0, value: 546, scriptPubKey: '' },
        badge: badgeWithVouches,
        oldVk: TEST_VKS.previous,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // Vouch data should appear twice
      expect(spell.match(/stake_percent: 25/g)).toHaveLength(2);
      expect(spell.match(/target_badge_/g)).toHaveLength(2);
    });
  });

  describe('Legacy Badge Migration (v0 to v1)', () => {
    it('should handle legacy badge with schema_version 0', () => {
      const legacyBadge = createLegacyBadge({
        id: 'legacy_badge_'.padEnd(64, '0'),
      });
      
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: { txid: 'legacy_tx_'.padEnd(64, '0'), vout: 0, value: 546, scriptPubKey: '' },
        badge: legacyBadge,
        oldVk: TEST_VKS.legacy,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('schema_version: 0');
      expect(spell).toContain(`from_vk: "${TEST_VKS.legacy}"`);
    });
  });

  describe('App Identity Consistency', () => {
    it('should use same badge id in both app specs', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // Both app specs should have same badge id (identity)
      expect(spell).toContain(`"n/${badge.id}/${oldVk}"`);
      expect(spell).toContain(`"n/${badge.id}/${TEST_VKS.current}"`);
    });

    it('should use different VKs for $00 and $01', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // Should have exactly one occurrence of each VK in app specs
      const oldVkPattern = new RegExp(`/${oldVk}"`, 'g');
      const newVkPattern = new RegExp(`/${TEST_VKS.current}"`, 'g');
      
      expect(spell.match(oldVkPattern)).toHaveLength(1);
      expect(spell.match(newVkPattern)).toHaveLength(1);
    });
  });

  describe('Input/Output Structure', () => {
    it('should have badge data under $00 in input charms', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // Input should reference old app ($00)
      const insSection = spell.split('outs:')[0];
      expect(insSection).toContain('$00:');
      expect(insSection).toContain('schema_version:');
    });

    it('should have badge data under $01 in output charms', () => {
      const { badge, utxo, oldVk } = createBadgeNeedingMigration();
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: utxo,
        badge,
        oldVk,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // Output should reference new app ($01)
      const outsSection = spell.split('outs:')[1].split('public_args:')[0];
      expect(outsSection).toContain('$01:');
      expect(outsSection).toContain('schema_version:');
    });
  });

  describe('Edge Cases', () => {
    it('should handle badge with empty vouches arrays', () => {
      const emptyBadge = createTestBadge({
        vouches_out: [],
        vouches_in: [],
        active_transactions: [],
        reporting_transactions: [],
      });
      
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: { txid: 'tx'.padEnd(64, '0'), vout: 0, value: 546, scriptPubKey: '' },
        badge: emptyBadge,
        oldVk: TEST_VKS.previous,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('vouches_out: []');
      expect(spell).toContain('vouches_in: []');
      expect(spell).toContain('active_transactions: []');
    });

    it('should handle badge with large volume_sum_squares (BigInt)', () => {
      const bigBadge = createTestBadge({
        volume_sum_squares: BigInt('99999999999999999999999'),
      });
      
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: { txid: 'tx'.padEnd(64, '0'), vout: 0, value: 546, scriptPubKey: '' },
        badge: bigBadge,
        oldVk: TEST_VKS.previous,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      expect(spell).toContain('volume_sum_squares: 99999999999999999999999');
    });

    it('should correctly serialize risk flags', () => {
      const flaggedBadge = createTestBadge({
        flags: {
          acceleration: true,
          extraction: false,
          isolated: true,
          too_clean: false,
          erratic: false,
          new_badge: true,
        },
      });
      
      const spell = generateMigrateBadgeSpell({
        badgeUtxo: { txid: 'tx'.padEnd(64, '0'), vout: 0, value: 546, scriptPubKey: '' },
        badge: flaggedBadge,
        oldVk: TEST_VKS.previous,
        newVk: TEST_VKS.current,
        destinationAddress: TEST_ADDRESSES.acceptor,
      });

      // flags: acceleration(1) + isolated(4) + new_badge(32) = 37
      expect(spell).toContain('flags: 37');
    });
  });
});

describe('Migration Spell Prover Compatibility', () => {
  it('should generate spell with correct structure for prover', () => {
    const { badge, utxo, oldVk } = createBadgeNeedingMigration();
    const spell = generateMigrateBadgeSpell({
      badgeUtxo: utxo,
      badge,
      oldVk,
      newVk: TEST_VKS.current,
      destinationAddress: TEST_ADDRESSES.acceptor,
    });

    // Prover expects these top-level keys
    expect(spell).toContain('version:');
    expect(spell).toContain('apps:');
    expect(spell).toContain('ins:');
    expect(spell).toContain('outs:');
    expect(spell).toContain('public_args:');
  });

  it('should not include binaries key (added by ProverService)', () => {
    const { badge, utxo, oldVk } = createBadgeNeedingMigration();
    const spell = generateMigrateBadgeSpell({
      badgeUtxo: utxo,
      badge,
      oldVk,
      newVk: TEST_VKS.current,
      destinationAddress: TEST_ADDRESSES.acceptor,
    });

    expect(spell).not.toContain('binaries:');
  });

  it('should use NFT app tag (n/) for badge apps', () => {
    const { badge, utxo, oldVk } = createBadgeNeedingMigration();
    const spell = generateMigrateBadgeSpell({
      badgeUtxo: utxo,
      badge,
      oldVk,
      newVk: TEST_VKS.current,
      destinationAddress: TEST_ADDRESSES.acceptor,
    });

    // Both apps should use NFT tag
    const nftAppMatches = spell.match(/"n\//g);
    expect(nftAppMatches).toHaveLength(2);
  });
});
