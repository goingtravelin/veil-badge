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

    it('should serialize active transactions with iAmProposer flags', () => {
      const spell = generateAcceptProposalSpell(params);
      
      // Should have both true and false iAmProposer
      expect(spell).toContain('i_am_proposer: true');
      expect(spell).toContain('i_am_proposer: false');
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
