// Spell Generator Tests
// ============================================================================
// Tests for atomic AcceptProposal spell generation

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateAcceptProposalSpell,
  generateReportOutcomeSpell,
  type AcceptProposalSpellParams,
} from '../../src/utils/spellGenerator';
import { VEIL_APP_VK } from '../../src/domain';
import {
  createTestBadge,
  createProposerBadge,
  createActiveTransaction,
  createTestProposal,
  TEST_UTXOS,
  TEST_ADDRESSES,
  TEST_CURRENT_BLOCK,
} from '../fixtures';

describe('generateAcceptProposalSpell', () => {
  let params: AcceptProposalSpellParams;

  beforeEach(() => {
    const proposerBadge = createProposerBadge();
    const acceptorBadge = createTestBadge();
    const proposal = createTestProposal();

    // Create updated badges with active transactions
    const proposerActive = createActiveTransaction(proposal, true, TEST_CURRENT_BLOCK);
    const acceptorActive = createActiveTransaction(proposal, false, TEST_CURRENT_BLOCK);

    const proposerUpdated = {
      ...proposerBadge,
      active_transactions: [...proposerBadge.active_transactions, proposerActive],
      last_update: TEST_CURRENT_BLOCK,
    };

    const acceptorUpdated = {
      ...acceptorBadge,
      active_transactions: [...acceptorBadge.active_transactions, acceptorActive],
      last_update: TEST_CURRENT_BLOCK,
    };

    params = {
      acceptorBadgeUtxo: TEST_UTXOS.acceptorBadge,
      acceptorOldBadge: acceptorBadge,
      acceptorNewBadge: acceptorUpdated,
      acceptorAddress: TEST_ADDRESSES.acceptor,
      proposerBadgeUtxo: TEST_UTXOS.proposerBadge,
      proposerOldBadge: proposerBadge,
      proposerNewBadge: proposerUpdated,
      proposerAddress: TEST_ADDRESSES.proposer,
      proposerVk: VEIL_APP_VK, // Required: proposer's VK from their on-chain badge
      proposalId: proposal.id,
      value: proposal.value,
      category: proposal.category,
      windowBlocks: proposal.windowBlocks,
      reportWindowBlocks: proposal.reportWindowBlocks,
      currentBlock: TEST_CURRENT_BLOCK,
    };
  });

  describe('YAML Structure', () => {
    it('should generate valid YAML with version 8', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain('version: 8');
    });

    it('should define two apps ($00 and $01)', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain('apps:');
      expect(spell).toContain('$00:');
      expect(spell).toContain('$01:');
    });

    it('should have two inputs (both badge UTXOs)', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain('ins:');
      // Should contain both UTXO IDs
      expect(spell).toContain(TEST_UTXOS.proposerBadge.txid);
      expect(spell).toContain(TEST_UTXOS.acceptorBadge.txid);
    });

    it('should have two outputs (updated badges)', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain('outs:');
      // Should contain both addresses
      expect(spell).toContain(TEST_ADDRESSES.proposer);
      expect(spell).toContain(TEST_ADDRESSES.acceptor);
    });

    it('should include public_args for both apps', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain('public_args:');
      
      // Both apps should have AcceptProposal action
      const matches = spell.match(/AcceptProposal:/g);
      expect(matches).toHaveLength(2);
    });
  });

  describe('App Identity and VK', () => {
    it('should use proposer badge ID as $00 app identity', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`n/${params.proposerOldBadge.id}/`);
    });

    it('should use acceptor badge ID as $01 app identity', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`n/${params.acceptorOldBadge.id}/`);
    });

    it('should use proposerVk for $00 app (not hardcoded VEIL_APP_VK)', () => {
      // Test with a different VK for proposer
      const differentVk = 'a'.repeat(64);
      const paramsWithDifferentVk = {
        ...params,
        proposerVk: differentVk,
      };
      
      const spell = generateAcceptProposalSpell(paramsWithDifferentVk);
      
      // $00 should have the different VK
      expect(spell).toContain(`$00: "n/${params.proposerOldBadge.id}/${differentVk}"`);
      // $01 should still use VEIL_APP_VK (acceptor's badge)
      expect(spell).toContain(`$01: "n/${params.acceptorOldBadge.id}/${VEIL_APP_VK}"`);
    });

    it('should allow acceptorVk override', () => {
      const proposerVk = 'a'.repeat(64);
      const acceptorVk = 'b'.repeat(64);
      const paramsWithBothVks = {
        ...params,
        proposerVk,
        acceptorVk,
      };
      
      const spell = generateAcceptProposalSpell(paramsWithBothVks);
      
      expect(spell).toContain(`$00: "n/${params.proposerOldBadge.id}/${proposerVk}"`);
      expect(spell).toContain(`$01: "n/${params.acceptorOldBadge.id}/${acceptorVk}"`);
    });
  });

  describe('UTXO References', () => {
    it('should reference proposer UTXO with correct vout', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(
        `"${TEST_UTXOS.proposerBadge.txid}:${TEST_UTXOS.proposerBadge.vout}"`
      );
    });

    it('should reference acceptor UTXO with correct vout', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(
        `"${TEST_UTXOS.acceptorBadge.txid}:${TEST_UTXOS.acceptorBadge.vout}"`
      );
    });

    it('should handle non-zero vout correctly', () => {
      params.acceptorBadgeUtxo = { ...TEST_UTXOS.acceptorBadge, vout: 5 };
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(':5"');
    });
  });

  describe('Badge State Serialization', () => {
    it('should include old badge state in inputs', () => {
      const spell = generateAcceptProposalSpell(params);
      
      // Old badges should be in inputs
      expect(spell).toContain(`id: "${params.proposerOldBadge.id}"`);
      expect(spell).toContain(`id: "${params.acceptorOldBadge.id}"`);
    });

    it('should include new badge state in outputs', () => {
      const spell = generateAcceptProposalSpell(params);
      
      // New badges should have active_transactions
      expect(spell).toContain('active_transactions:');
    });
  });

  describe('Public Args', () => {
    it('should include proposal_id in public_args', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`proposal_id: "${params.proposalId}"`);
    });

    it('should include transaction value', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`value: ${params.value}`);
    });

    it('should include category', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`category: ${params.category}`);
    });

    it('should include window blocks', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`window_blocks: ${params.windowBlocks}`);
    });

    it('should include report window blocks', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`report_window_blocks: ${params.reportWindowBlocks}`);
    });

    it('should include current block', () => {
      const spell = generateAcceptProposalSpell(params);
      expect(spell).toContain(`current_block: ${params.currentBlock}`);
    });
  });

  describe('Output Addresses', () => {
    it('should send proposer badge back to proposer address', () => {
      const spell = generateAcceptProposalSpell(params);
      
      // First output should be to proposer
      const firstOutput = spell.indexOf(`address: "${TEST_ADDRESSES.proposer}"`);
      const secondOutput = spell.indexOf(`address: "${TEST_ADDRESSES.acceptor}"`);
      
      expect(firstOutput).toBeLessThan(secondOutput);
    });

    it('should use dust limit for output amounts', () => {
      const spell = generateAcceptProposalSpell(params);
      
      // Should have sats: 546 (dust limit)
      const dustMatches = spell.match(/sats: 546/g);
      expect(dustMatches).toHaveLength(2);
    });
  });
});

describe('generateReportOutcomeSpell', () => {
  it('should generate spell with single badge input/output', () => {
    const badge = createTestBadge();
    const spell = generateReportOutcomeSpell({
      badgeUtxo: TEST_UTXOS.acceptorBadge,
      oldBadge: badge,
      newBadge: { ...badge, last_update: TEST_CURRENT_BLOCK },
      transactionId: 'tx'.padEnd(64, '0'),
      outcome: 'Positive',
      currentBlock: TEST_CURRENT_BLOCK,
      destinationAddress: TEST_ADDRESSES.acceptor,
    });

    expect(spell).toContain('version: 8');
    expect(spell).toContain('ReportOutcome:');
    expect(spell).toContain('outcome: Positive');
  });
});

// ============================================================================
// Spell Validation Tests
// These tests ensure no undefined/NaN values slip into generated spells
// ============================================================================

describe('Spell Validation (No Undefined Values)', () => {
  let params: AcceptProposalSpellParams;

  beforeEach(() => {
    const proposerBadge = createProposerBadge();
    const acceptorBadge = createTestBadge();
    const proposal = createTestProposal();

    const proposerActive = createActiveTransaction(proposal, true, TEST_CURRENT_BLOCK);
    const acceptorActive = createActiveTransaction(proposal, false, TEST_CURRENT_BLOCK);

    const proposerUpdated = {
      ...proposerBadge,
      active_transactions: [...proposerBadge.active_transactions, proposerActive],
      last_update: TEST_CURRENT_BLOCK,
    };

    const acceptorUpdated = {
      ...acceptorBadge,
      active_transactions: [...acceptorBadge.active_transactions, acceptorActive],
      last_update: TEST_CURRENT_BLOCK,
    };

    params = {
      acceptorBadgeUtxo: TEST_UTXOS.acceptorBadge,
      acceptorOldBadge: acceptorBadge,
      acceptorNewBadge: acceptorUpdated,
      acceptorAddress: TEST_ADDRESSES.acceptor,
      proposerBadgeUtxo: TEST_UTXOS.proposerBadge,
      proposerOldBadge: proposerBadge,
      proposerNewBadge: proposerUpdated,
      proposerAddress: TEST_ADDRESSES.proposer,
      proposerVk: VEIL_APP_VK,
      proposalId: proposal.id,
      value: proposal.value,
      category: proposal.category,
      windowBlocks: proposal.windowBlocks,
      reportWindowBlocks: proposal.reportWindowBlocks,
      currentBlock: TEST_CURRENT_BLOCK,
    };
  });

  it('should NEVER contain "undefined" string in generated spell', () => {
    const spell = generateAcceptProposalSpell(params);
    expect(spell).not.toContain('undefined');
    expect(spell).not.toContain('null');
    expect(spell).not.toContain('NaN');
  });

  it('should include schema_version in badge state', () => {
    const spell = generateAcceptProposalSpell(params);
    expect(spell).toContain('schema_version: 1');
  });

  it('should include proposer_badge_id in public_args for both apps', () => {
    const spell = generateAcceptProposalSpell(params);
    
    // Count occurrences of proposer_badge_id - should be exactly 2 (once per app)
    const matches = spell.match(/proposer_badge_id:/g);
    expect(matches).toHaveLength(2);
    
    // Both should reference the proposer's badge ID
    expect(spell).toContain(`proposer_badge_id: "${params.proposerOldBadge.id}"`);
  });

  it('should serialize active_transactions with correct snake_case field names', () => {
    const spell = generateAcceptProposalSpell(params);
    
    // Must use snake_case
    expect(spell).toContain('counterparty_badge_id:');
    expect(spell).toContain('started_at:');
    expect(spell).toContain('window_ends_at:');
    expect(spell).toContain('report_deadline:');
    
    // Must NOT use camelCase
    expect(spell).not.toContain('counterpartyBadgeId:');
    expect(spell).not.toContain('startedAt:');
    expect(spell).not.toContain('windowEndsAt:');
    expect(spell).not.toContain('reportDeadline:');
  });

  it('should serialize outcomes with correct snake_case field names', () => {
    const spell = generateAcceptProposalSpell(params);
    
    // Must use snake_case
    expect(spell).toContain('mutual_positive:');
    expect(spell).toContain('mutual_negative:');
    expect(spell).toContain('contested_i_positive:');
    expect(spell).toContain('contested_i_negative:');
    expect(spell).toContain('mutual_timeout:');
    
    // Must NOT use camelCase
    expect(spell).not.toContain('mutualPositive:');
    expect(spell).not.toContain('mutualNegative:');
    expect(spell).not.toContain('contestedIPositive:');
    expect(spell).not.toContain('contestedINegative:');
    expect(spell).not.toContain('mutualTimeout:');
  });

  it('should handle badges with existing active_transactions', () => {
    const existingTx = createActiveTransaction(
      { ...createTestProposal(), id: 'existing'.padEnd(64, '0') },
      true,
      TEST_CURRENT_BLOCK - 100
    );
    
    params.proposerOldBadge = {
      ...params.proposerOldBadge,
      active_transactions: [existingTx],
    };
    
    const spell = generateAcceptProposalSpell(params);
    expect(spell).not.toContain('undefined');
  });

  it('should handle badges with non-zero outcomes', () => {
    params.proposerOldBadge = {
      ...params.proposerOldBadge,
      outcomes: {
        mutual_positive: 5,
        mutual_negative: 1,
        contested_i_positive: 2,
        contested_i_negative: 0,
        timeout: 1,
        mutual_timeout: 0,
      },
    };
    
    const spell = generateAcceptProposalSpell(params);
    expect(spell).not.toContain('undefined');
    expect(spell).toContain('mutual_positive: 5');
    expect(spell).toContain('mutual_negative: 1');
  });

  it('should NOT wrap volume_sum_squares in quotes (WASM expects u128)', () => {
    const spell = generateAcceptProposalSpell(params);
    // volume_sum_squares is u128 in Rust - must NOT be quoted
    expect(spell).toMatch(/volume_sum_squares: \d+/);
    expect(spell).not.toMatch(/volume_sum_squares: "\d+"/);
  });
});
