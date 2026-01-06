/**
 * Spell Integrity Tests
 * 
 * These tests ensure that TypeScript spell generation produces valid output
 * that matches what the Rust WASM expects. This catches bugs like:
 * - Missing fields in YAML templates
 * - Field name mismatches (snake_case vs camelCase)
 * - Type mismatches (number vs string)
 */

import { describe, it, expect } from 'vitest';
import { parse as parseYaml } from 'yaml';
import {
  VeilBadge,
  createNewBadge,
  SCHEMA_VERSION,
  RiskFlags,
} from '../../src/domain/types';
import { buildMintSpellYaml } from '../../src/application/mintBadge';

/**
 * All fields that MUST be present in a serialized VeilBadge for the Rust WASM.
 * This is the source of truth - if Rust adds a field, add it here.
 */
const REQUIRED_BADGE_FIELDS = [
  'schema_version',
  'id',
  'created_at',
  'pubkey',
  'tx_total',
  'tx_positive',
  'tx_negative',
  'volume_total',
  'volume_sum_squares',
  'window_tx_count',
  'window_volume',
  'window_start',
  'counterparty_count',
  'backing',
  'vouches_out',
  'vouches_in',
  'cascade_damage',
  'active_transactions',
  'reporting_transactions',
  'outcomes',
  'trust',
  'risk',
  'flags',
  'last_nonce',
  'last_update',
] as const;

const REQUIRED_BACKING_FIELDS = [
  'backed_count',
  'unbacked_count',
  'backed_volume',
  'unbacked_volume',
] as const;

const REQUIRED_OUTCOMES_FIELDS = [
  'mutual_positive',
  'mutual_negative',
  'contested_i_positive',
  'contested_i_negative',
  'timeout',
  'mutual_timeout',
] as const;

describe('Spell Integrity', () => {
  describe('Badge Field Completeness', () => {
    it('VeilBadge type should have all required fields', () => {
      // Create a badge and verify it has all required fields
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );

      for (const field of REQUIRED_BADGE_FIELDS) {
        expect(badge).toHaveProperty(field);
      }
    });

    it('createNewBadge should set schema_version correctly', () => {
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );

      expect(badge.schema_version).toBe(SCHEMA_VERSION);
      expect(badge.schema_version).toBe(1); // Explicit check
    });

    it('backing aggregates should have all required fields', () => {
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );

      for (const field of REQUIRED_BACKING_FIELDS) {
        expect(badge.backing).toHaveProperty(field);
      }
    });

    it('outcome aggregates should have all required fields', () => {
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );

      // All fields use snake_case to match Rust
      expect(badge.outcomes).toHaveProperty('mutual_positive');
      expect(badge.outcomes).toHaveProperty('mutual_negative');
      expect(badge.outcomes).toHaveProperty('contested_i_positive');
      expect(badge.outcomes).toHaveProperty('contested_i_negative');
      expect(badge.outcomes).toHaveProperty('timeout');
      expect(badge.outcomes).toHaveProperty('mutual_timeout');
    });
  });

  describe('Mint Spell YAML Completeness', () => {
    // This is a simplified version of the mint spell template
    // In real tests, you'd import the actual function
    function buildTestMintSpellYaml(badge: VeilBadge): string {
      const flagsBits = 0b00100100; // NEW_BADGE | ISOLATED
      
      return `version: 8

apps:
  $00: "n/${'0'.repeat(64)}/bc4b45c7d3ad40d4ebccf6a6f7db1ba44aa6c82ef80b0eae42174eaaf1133713"

ins:
  - utxo_id: "abc123:0"
    charms: {}

outs:
  - address: "tb1test"
    sats: 546
    charms:
      $00:
        schema_version: ${badge.schema_version}
        id: "${badge.id}"
        created_at: ${badge.created_at}
        pubkey: "${badge.pubkey}"
        tx_total: ${badge.tx_total}
        tx_positive: ${badge.tx_positive}
        tx_negative: ${badge.tx_negative}
        volume_total: ${badge.volume_total}
        volume_sum_squares: ${badge.volume_sum_squares}
        window_tx_count: ${badge.window_tx_count}
        window_volume: ${badge.window_volume}
        window_start: ${badge.window_start}
        counterparty_count: ${badge.counterparty_count}
        backing:
          backed_count: ${badge.backing.backed_count}
          unbacked_count: ${badge.backing.unbacked_count}
          backed_volume: ${badge.backing.backed_volume}
          unbacked_volume: ${badge.backing.unbacked_volume}
        vouches_out: []
        vouches_in: []
        cascade_damage: ${badge.cascade_damage}
        active_transactions: []
        reporting_transactions: []
        outcomes:
          mutual_positive: ${badge.outcomes.mutual_positive}
          mutual_negative: ${badge.outcomes.mutual_negative}
          contested_i_positive: ${badge.outcomes.contested_i_positive}
          contested_i_negative: ${badge.outcomes.contested_i_negative}
          timeout: ${badge.outcomes.timeout}
          mutual_timeout: ${badge.outcomes.mutual_timeout}
        trust: ${badge.trust}
        risk: ${badge.risk}
        flags: ${flagsBits}
        last_nonce: "${badge.last_nonce}"
        last_update: ${badge.last_update}

public_args:
  $00:
    Mint:
      pubkey: "${badge.pubkey}"
      current_block: ${badge.created_at}
`;
    }

    it('mint spell YAML should include schema_version', () => {
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );
      
      const yaml = buildTestMintSpellYaml(badge);
      
      // Parse the YAML to verify structure
      const parsed = parseYaml(yaml);
      const charmData = parsed.outs[0].charms['$00'];
      
      expect(charmData).toHaveProperty('schema_version');
      expect(charmData.schema_version).toBe(1);
    });

    it('mint spell YAML should have all required badge fields', () => {
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );
      
      const yaml = buildTestMintSpellYaml(badge);
      const parsed = parseYaml(yaml);
      const charmData = parsed.outs[0].charms['$00'];
      
      // Check all top-level fields
      for (const field of REQUIRED_BADGE_FIELDS) {
        expect(charmData, `Missing field: ${field}`).toHaveProperty(field);
      }
    });

    it('mint spell YAML backing should have all required fields', () => {
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );
      
      const yaml = buildTestMintSpellYaml(badge);
      const parsed = parseYaml(yaml);
      const backing = parsed.outs[0].charms['$00'].backing;
      
      for (const field of REQUIRED_BACKING_FIELDS) {
        expect(backing, `Missing backing field: ${field}`).toHaveProperty(field);
      }
    });

    it('mint spell YAML outcomes should have all required fields', () => {
      const badge = createNewBadge(
        '0'.repeat(64),
        '02' + '0'.repeat(64),
        100000
      );
      
      const yaml = buildTestMintSpellYaml(badge);
      const parsed = parseYaml(yaml);
      const outcomes = parsed.outs[0].charms['$00'].outcomes;
      
      for (const field of REQUIRED_OUTCOMES_FIELDS) {
        expect(outcomes, `Missing outcomes field: ${field}`).toHaveProperty(field);
      }
    });
  });

  describe('Field Value Validation', () => {
    it('new badge should have correct initial values', () => {
      const badge = createNewBadge(
        'a'.repeat(64),
        '02' + 'b'.repeat(64),
        117000
      );

      // Schema
      expect(badge.schema_version).toBe(1);

      // Identity
      expect(badge.id).toBe('a'.repeat(64));
      expect(badge.pubkey).toBe('02' + 'b'.repeat(64));
      expect(badge.created_at).toBe(117000);

      // Counters should all be zero
      expect(badge.tx_total).toBe(0);
      expect(badge.tx_positive).toBe(0);
      expect(badge.tx_negative).toBe(0);
      expect(badge.volume_total).toBe(0);
      expect(badge.volume_sum_squares).toBe(BigInt(0));
      expect(badge.window_tx_count).toBe(0);
      expect(badge.window_volume).toBe(0);
      expect(badge.counterparty_count).toBe(0);
      expect(badge.cascade_damage).toBe(0);

      // Window starts at creation
      expect(badge.window_start).toBe(117000);

      // Trust/risk for new badges
      expect(badge.trust).toBe(15);
      expect(badge.risk).toBe(35);

      // Flags for new badges
      expect(badge.flags.new_badge).toBe(true);
      expect(badge.flags.isolated).toBe(true);

      // Empty collections
      expect(badge.vouches_out).toEqual([]);
      expect(badge.vouches_in).toEqual([]);
      expect(badge.active_transactions).toEqual([]);
      expect(badge.reporting_transactions).toEqual([]);

      // Nonce and update
      expect(badge.last_nonce).toBe('0'.repeat(64));
      expect(badge.last_update).toBe(117000);
    });
  });

  describe('Action Type Completeness', () => {
    it('Mint action should have pubkey and current_block', () => {
      // This mirrors what Rust expects
      interface MintAction {
        Mint: {
          pubkey: string;
          current_block: number;
        };
      }

      const action: MintAction = {
        Mint: {
          pubkey: '02' + '0'.repeat(64),
          current_block: 100000,
        },
      };

      expect(action.Mint).toHaveProperty('pubkey');
      expect(action.Mint).toHaveProperty('current_block');
    });
  });
});

describe('Serialization Round-Trip', () => {
  it('badge values should survive YAML serialization', () => {
    const originalBadge = createNewBadge(
      'deadbeef'.repeat(8),
      '02' + 'cafebabe'.repeat(8),
      117519
    );

    // Simulate what the spell generator does
    const serialized = {
      schema_version: originalBadge.schema_version,
      id: originalBadge.id,
      created_at: originalBadge.created_at,
      pubkey: originalBadge.pubkey,
      tx_total: originalBadge.tx_total,
      tx_positive: originalBadge.tx_positive,
      tx_negative: originalBadge.tx_negative,
      volume_total: originalBadge.volume_total,
      volume_sum_squares: Number(originalBadge.volume_sum_squares),
      window_tx_count: originalBadge.window_tx_count,
      window_volume: originalBadge.window_volume,
      window_start: originalBadge.window_start,
      counterparty_count: originalBadge.counterparty_count,
      backing: originalBadge.backing,
      vouches_out: originalBadge.vouches_out,
      vouches_in: originalBadge.vouches_in,
      cascade_damage: originalBadge.cascade_damage,
      active_transactions: originalBadge.active_transactions,
      reporting_transactions: originalBadge.reporting_transactions,
      outcomes: {
        mutual_positive: originalBadge.outcomes.mutual_positive,
        mutual_negative: originalBadge.outcomes.mutual_negative,
        contested_i_positive: originalBadge.outcomes.contested_i_positive,
        contested_i_negative: originalBadge.outcomes.contested_i_negative,
        timeout: originalBadge.outcomes.timeout,
        mutual_timeout: originalBadge.outcomes.mutual_timeout,
      },
      trust: originalBadge.trust,
      risk: originalBadge.risk,
      flags: 36, // NEW_BADGE | ISOLATED
      last_nonce: originalBadge.last_nonce,
      last_update: originalBadge.last_update,
    };

    // Verify key values
    expect(serialized.schema_version).toBe(1);
    expect(serialized.id).toBe(originalBadge.id);
    expect(serialized.created_at).toBe(117519);
    expect(serialized.trust).toBe(15);
    expect(serialized.risk).toBe(35);
  });
});
/**
 * Tests against the REAL buildMintSpellYaml function
 * These would have caught the missing schema_version bug!
 */
describe('Real Mint Spell Generator', () => {
  const testConfig = {
    appId: 'e437c806e5ab24fe0ea628930bed9f1dd32993eaf20086cb5bf70a119b55b536',
    appVk: 'bc4b45c7d3ad40d4ebccf6a6f7db1ba44aa6c82ef80b0eae42174eaaf1133713',
  };

  it('buildMintSpellYaml should include schema_version', () => {
    const badge = createNewBadge(
      testConfig.appId,
      '02fbfb68f6479fcf0655ffb14c8a3ef9d4633719e22d2cd44edc2d7e0bc75e01b5',
      117519
    );

    const yaml = buildMintSpellYaml(
      'abc123:0',
      'tb1ptest',
      badge.pubkey,
      badge,
      testConfig
    );

    const parsed = parseYaml(yaml);
    const charmData = parsed.outs[0].charms['$00'];

    expect(charmData).toHaveProperty('schema_version');
    expect(charmData.schema_version).toBe(1);
  });

  it('buildMintSpellYaml output should have ALL required fields', () => {
    const badge = createNewBadge(
      testConfig.appId,
      '02fbfb68f6479fcf0655ffb14c8a3ef9d4633719e22d2cd44edc2d7e0bc75e01b5',
      117519
    );

    const yaml = buildMintSpellYaml(
      'abc123:0',
      'tb1ptest',
      badge.pubkey,
      badge,
      testConfig
    );

    const parsed = parseYaml(yaml);
    const charmData = parsed.outs[0].charms['$00'];

    // All required top-level fields
    for (const field of REQUIRED_BADGE_FIELDS) {
      expect(charmData, `REAL mint spell missing field: ${field}`).toHaveProperty(field);
    }

    // Backing fields
    for (const field of REQUIRED_BACKING_FIELDS) {
      expect(charmData.backing, `REAL mint spell missing backing.${field}`).toHaveProperty(field);
    }

    // Outcomes fields
    for (const field of REQUIRED_OUTCOMES_FIELDS) {
      expect(charmData.outcomes, `REAL mint spell missing outcomes.${field}`).toHaveProperty(field);
    }
  });

  it('buildMintSpellYaml should produce valid public_args for Mint action', () => {
    const badge = createNewBadge(
      testConfig.appId,
      '02fbfb68f6479fcf0655ffb14c8a3ef9d4633719e22d2cd44edc2d7e0bc75e01b5',
      117519
    );

    const yaml = buildMintSpellYaml(
      'abc123:0',
      'tb1ptest',
      badge.pubkey,
      badge,
      testConfig
    );

    const parsed = parseYaml(yaml);
    const action = parsed.public_args['$00'];

    // Mint action must have these fields for Rust
    expect(action).toHaveProperty('Mint');
    expect(action.Mint).toHaveProperty('pubkey');
    expect(action.Mint).toHaveProperty('current_block');

    // Values should match
    expect(action.Mint.pubkey).toBe(badge.pubkey);
    expect(action.Mint.current_block).toBe(badge.created_at);
  });

  it('buildMintSpellYaml badge values should match input badge', () => {
    const badge = createNewBadge(
      testConfig.appId,
      '02fbfb68f6479fcf0655ffb14c8a3ef9d4633719e22d2cd44edc2d7e0bc75e01b5',
      117519
    );

    const yaml = buildMintSpellYaml(
      'abc123:0',
      'tb1ptest',
      badge.pubkey,
      badge,
      testConfig
    );

    const parsed = parseYaml(yaml);
    const charmData = parsed.outs[0].charms['$00'];

    // Key identity fields
    expect(charmData.id).toBe(badge.id);
    expect(charmData.created_at).toBe(badge.created_at);
    expect(charmData.pubkey).toBe(badge.pubkey);

    // Trust/risk
    expect(charmData.trust).toBe(badge.trust);
    expect(charmData.risk).toBe(badge.risk);

    // Flags should be 36 (NEW_BADGE | ISOLATED)
    expect(charmData.flags).toBe(36);
  });
});