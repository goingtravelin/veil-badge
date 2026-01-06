// Atomic AcceptProposal Application Tests
// ============================================================================
// Tests for the atomic proposal acceptance flow where BOTH badges are updated
// in a single transaction.

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { acceptProposal, type AcceptProposalInput, type AcceptProposalContext } from '../../src/application/acceptProposal';
import { createNewBadge } from '../../src/domain';
import {
  createMockBitcoinPort,
  createMockProverPort,
  createMockCryptoPort,
  createMockStoragePort,
} from '../mocks';
import {
  TEST_BADGE_IDS,
  TEST_UTXOS,
  TEST_ADDRESSES,
  TEST_CURRENT_BLOCK,
  createTestBadge,
  createProposerBadge,
  createTestProposal,
} from '../fixtures';

// Mock the CharmsService module
vi.mock('../../src/services/CharmsService', () => ({
  charmsService: {
    scanUtxoForBadge: vi.fn(),
    scanUtxoForAnyBadge: vi.fn(),
  },
}));

import { charmsService } from '../../src/services/CharmsService';

describe('Atomic AcceptProposal Use Case', () => {
  let ctx: AcceptProposalContext;
  let input: AcceptProposalInput;
  let progressMessages: string[];
  let proposerBadge: ReturnType<typeof createProposerBadge>;

  beforeEach(() => {
    vi.clearAllMocks();
    progressMessages = [];
    
    // Create proposer badge for mock response
    proposerBadge = createProposerBadge();

    // Mock CharmsService to return proposer badge (uses scanUtxoForAnyBadge for cross-VK compatibility)
    vi.mocked(charmsService.scanUtxoForAnyBadge).mockResolvedValue(proposerBadge);

    // Create context with all mocks
    ctx = {
      bitcoin: createMockBitcoinPort({
        fetchUtxos: vi.fn().mockResolvedValue([
          TEST_UTXOS.acceptorBadge,
          TEST_UTXOS.funding,
        ]),
      }),
      prover: createMockProverPort(),
      crypto: createMockCryptoPort(),
      storage: createMockStoragePort(),
      network: 'testnet4',
      onProgress: (msg: string) => progressMessages.push(msg),
    };

    // Create test input
    const myBadge = createTestBadge();
    const proposal = createTestProposal();

    input = {
      proposal,
      myBadge,
      myBadgeUtxo: TEST_UTXOS.acceptorBadge,
      availableUtxos: [TEST_UTXOS.acceptorBadge, TEST_UTXOS.funding],
      myAddress: TEST_ADDRESSES.acceptor,
      mySignature: 'my_signature'.repeat(5),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Proposer Badge Fetching', () => {
    it('should fetch proposer badge from UTXO', async () => {
      await acceptProposal(input, ctx);

      // scanUtxoForAnyBadge is used for cross-VK compatibility
      expect(charmsService.scanUtxoForAnyBadge).toHaveBeenCalledWith(
        TEST_UTXOS.proposerBadge.txid,
        TEST_UTXOS.proposerBadge.vout,
        'testnet4'
      );
    });

    it('should fail if proposer badge not found', async () => {
      vi.mocked(charmsService.scanUtxoForAnyBadge).mockResolvedValue(null);

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Proposer badge not found');
    });

    it('should fail if proposer badge ID mismatches', async () => {
      const wrongBadge = createProposerBadge({ id: 'wrong_badge_id'.padEnd(64, '0') });
      vi.mocked(charmsService.scanUtxoForAnyBadge).mockResolvedValue(wrongBadge);

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Proposer badge ID mismatch');
    });
  });

  describe('Atomic Spell Generation', () => {
    it('should generate spell with both badge UTXOs as inputs', async () => {
      await acceptProposal(input, ctx);

      const proveCall = vi.mocked(ctx.prover.prove).mock.calls[0][0];
      const spellYaml = proveCall.spellYaml;

      // Both badge UTXOs should be in the spell
      expect(spellYaml).toContain(TEST_UTXOS.proposerBadge.txid);
      expect(spellYaml).toContain(TEST_UTXOS.acceptorBadge.txid);
    });

    it('should include both badge IDs as separate apps', async () => {
      await acceptProposal(input, ctx);

      const proveCall = vi.mocked(ctx.prover.prove).mock.calls[0][0];
      const spellYaml = proveCall.spellYaml;

      // Both badge IDs should appear as app identities
      expect(spellYaml).toContain(`n/${TEST_BADGE_IDS.proposer}/`);
      expect(spellYaml).toContain(`n/${TEST_BADGE_IDS.acceptor}/`);
    });

    it('should include AcceptProposal public_args for both badges', async () => {
      await acceptProposal(input, ctx);

      const proveCall = vi.mocked(ctx.prover.prove).mock.calls[0][0];
      const spellYaml = proveCall.spellYaml;

      // Should have public_args section with AcceptProposal for both $00 and $01
      expect(spellYaml).toContain('$00:');
      expect(spellYaml).toContain('$01:');
      expect(spellYaml).toContain('AcceptProposal:');
    });

    it('should set correct iAmProposer flags in active transactions', async () => {
      await acceptProposal(input, ctx);

      const proveCall = vi.mocked(ctx.prover.prove).mock.calls[0][0];
      const spellYaml = proveCall.spellYaml;

      // Proposer badge should have iAmProposer: true
      // Acceptor badge should have iAmProposer: false
      expect(spellYaml).toContain('i_am_proposer: true');
      expect(spellYaml).toContain('i_am_proposer: false');
    });
  });

  describe('UTXO Selection', () => {
    it('should exclude both badge UTXOs from funding selection', async () => {
      // Add proposer's badge UTXO to available UTXOs
      const utxosWithProposer = [
        TEST_UTXOS.proposerBadge,
        TEST_UTXOS.acceptorBadge,
        TEST_UTXOS.funding,
      ];
      input.availableUtxos = utxosWithProposer;

      await acceptProposal(input, ctx);

      const proveCall = vi.mocked(ctx.prover.prove).mock.calls[0][0];
      
      // Funding UTXO should be the separate one, not either badge UTXO
      expect(proveCall.fundingUtxo.txid).toBe(TEST_UTXOS.funding.txid);
    });

    it('should fail if no funding UTXO available after excluding badges', async () => {
      // Only provide badge UTXOs, no funding
      input.availableUtxos = [TEST_UTXOS.acceptorBadge];

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(false);
      expect(result.error).toContain('No suitable funding UTXO found');
    });

    it('should fetch prev txs for both badge UTXOs', async () => {
      await acceptProposal(input, ctx);

      // Should fetch both badge's previous transactions
      expect(ctx.bitcoin.fetchTransaction).toHaveBeenCalledWith(
        TEST_UTXOS.acceptorBadge.txid,
        'testnet4'
      );
      expect(ctx.bitcoin.fetchTransaction).toHaveBeenCalledWith(
        TEST_UTXOS.proposerBadge.txid,
        'testnet4'
      );
    });
  });

  describe('Proposal Validation', () => {
    it('should reject expired proposals', async () => {
      // Set current block past expiry
      vi.mocked(ctx.bitcoin.getCurrentBlockHeight).mockResolvedValue(
        input.proposal.expiresAt + 10
      );

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(false);
      expect(result.error).toContain('expired');
    });

    it('should reject if counterparty badge ID does not match', async () => {
      input.myBadge = createTestBadge({ id: 'different_badge'.padEnd(64, '0') });

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not addressed to your badge');
    });
  });

  describe('Transaction Output', () => {
    it('should return updated badge with active transaction added', async () => {
      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(true);
      expect(result.data?.updatedBadge.active_transactions).toHaveLength(1);
      expect(result.data?.activeTransaction.iAmProposer).toBe(false);
    });

    it('should set correct counterparty in active transaction', async () => {
      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(true);
      expect(result.data?.activeTransaction.counterpartyBadgeId).toBe(
        TEST_BADGE_IDS.proposer
      );
    });

    it('should calculate correct window deadlines', async () => {
      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(true);
      const tx = result.data?.activeTransaction;
      expect(tx?.startedAt).toBe(TEST_CURRENT_BLOCK);
      expect(tx?.windowEndsAt).toBe(TEST_CURRENT_BLOCK + input.proposal.windowBlocks);
      expect(tx?.reportDeadline).toBe(
        TEST_CURRENT_BLOCK + input.proposal.windowBlocks + input.proposal.reportWindowBlocks
      );
    });
  });

  describe('Progress Callbacks', () => {
    it('should report progress throughout the flow', async () => {
      await acceptProposal(input, ctx);

      expect(progressMessages).toContain('Validating proposal...');
      expect(progressMessages).toContain('Fetching proposer badge...');
      expect(progressMessages).toContain('Creating active transaction...');
      expect(progressMessages).toContain('Generating atomic spell...');
      expect(progressMessages).toContain('Selecting funding UTXO...');
      expect(progressMessages).toContain('Proving transaction...');
    });
  });

  describe('Error Handling', () => {
    it('should handle prover failure gracefully', async () => {
      vi.mocked(ctx.prover.prove).mockResolvedValue({
        success: false,
        error: 'Prover unavailable',
      });

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Prover unavailable');
    });

    it('should handle CharmsService errors gracefully', async () => {
      vi.mocked(charmsService.scanUtxoForAnyBadge).mockRejectedValue(
        new Error('Network error')
      );

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should mark funding UTXO as burned before proving', async () => {
      await acceptProposal(input, ctx);

      expect(ctx.storage.addBurnedUtxo).toHaveBeenCalledWith(
        `${TEST_UTXOS.funding.txid}:${TEST_UTXOS.funding.vout}`
      );
    });
  });

  describe('Mock Mode', () => {
    it('should skip broadcast in mock mode', async () => {
      vi.mocked(ctx.prover.prove).mockResolvedValue({
        success: true,
        commitTx: '02000000...',
        spellTx: '02000000...',
        isMock: true,
      });

      const result = await acceptProposal(input, ctx);

      expect(result.success).toBe(true);
      expect(ctx.bitcoin.broadcast).not.toHaveBeenCalled();
      expect(result.data?.txid).toContain('mock_txid_');
    });

    it('should broadcast in production mode', async () => {
      vi.mocked(ctx.prover.prove).mockResolvedValue({
        success: true,
        commitTx: '02000000...',
        spellTx: '02000000spellhex...',
        isMock: false,
      });

      await acceptProposal(input, ctx);

      expect(ctx.bitcoin.broadcast).toHaveBeenCalledWith(
        '02000000spellhex...',
        'testnet4'
      );
    });
  });
});
