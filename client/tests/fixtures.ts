// Test Fixtures for Veil Badge Tests
// ============================================================================

import type { VeilBadge } from '../src/domain/types';
import type { Proposal, ActiveTransaction, TxCategory } from '../src/domain/proposal';
import type { UtxoInfo, Network } from '../src/application/ports';

// Helper to create valid 64-char hex strings
const padHex = (str: string, length = 64) => str.padEnd(length, '0');

// Test badge IDs
export const TEST_BADGE_IDS = {
  proposer: padHex('proposer_badge_'),
  acceptor: padHex('acceptor_badge_'),
  thirdParty: padHex('third_party_badge_'),
} as const;

// Test addresses (testnet4 format)
export const TEST_ADDRESSES = {
  proposer: 'tb1p2nv60d0wwem72kzrwaz6746wz5qnvv5f3vrks3qp50x65g829a0s9wc6zk',
  acceptor: 'tb1q3u4khx8rpymwnjzm7gp7qxmkv8kqzf9vqxg8d4',
} as const;

// Test pubkeys
export const TEST_PUBKEYS = {
  proposer: '02f08db1ece274aab4c11fa441e672c8f6b8cc913b03e2aa12a2625d5be13e0fe0',
  acceptor: '03a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
} as const;

// Test UTXOs
export const TEST_UTXOS = {
  proposerBadge: {
    txid: padHex('proposer_badge_tx_'),
    vout: 0,
    value: 546,
    scriptPubKey: '',
  } as UtxoInfo,
  acceptorBadge: {
    txid: padHex('acceptor_badge_tx_'),
    vout: 2,
    value: 546,
    scriptPubKey: '',
  } as UtxoInfo,
  funding: {
    txid: padHex('funding_tx_'),
    vout: 0,
    value: 500000,
    scriptPubKey: '',
  } as UtxoInfo,
  fundingSmall: {
    txid: padHex('funding_small_tx_'),
    vout: 1,
    value: 1000,
    scriptPubKey: '',
  } as UtxoInfo,
};

// Factory for creating test badges
export function createTestBadge(overrides: Partial<VeilBadge> = {}): VeilBadge {
  return {
    id: TEST_BADGE_IDS.acceptor,
    created_at: 100000,
    pubkey: TEST_PUBKEYS.acceptor,
    tx_total: 10,
    tx_positive: 8,
    tx_negative: 2,
    volume_total: 1000000,
    volume_sum_squares: BigInt('1000000000000'),
    window_tx_count: 5,
    window_volume: 500000,
    window_start: 117000,
    counterparty_count: 5,
    backing: {
      backed_count: 3,
      unbacked_count: 7,
      backed_volume: 300000,
      unbacked_volume: 700000,
    },
    vouches_out: [],
    vouches_in: [],
    cascade_damage: 0,
    trust: 50,
    risk: 25,
    flags: {
      acceleration: false,
      extraction: false,
      isolated: false,
      too_clean: false,
      erratic: false,
      new_badge: false,
    },
    active_transactions: [],
    reporting_transactions: [],
    outcomes: {
      total_resolved: 0,
      positive_count: 0,
      negative_count: 0,
      negative_volume: 0,
      positive_volume: 0,
      pending_reports: 0,
    },
    last_nonce: padHex('nonce_'),
    last_update: 117190,
    ...overrides,
  };
}

// Factory for proposer badge
export function createProposerBadge(overrides: Partial<VeilBadge> = {}): VeilBadge {
  return createTestBadge({
    id: TEST_BADGE_IDS.proposer,
    pubkey: TEST_PUBKEYS.proposer,
    ...overrides,
  });
}

// Factory for creating test proposals
export function createTestProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: padHex('proposal_'),
    proposerBadgeId: TEST_BADGE_IDS.proposer,
    proposerBadgeUtxo: {
      txid: TEST_UTXOS.proposerBadge.txid,
      vout: TEST_UTXOS.proposerBadge.vout,
    },
    counterpartyBadgeId: TEST_BADGE_IDS.acceptor,
    value: 100000,
    category: 'Trade' as TxCategory,
    windowBlocks: 144,
    reportWindowBlocks: 432,
    createdAt: 117180,
    expiresAt: 117324, // createdAt + 144
    proposerSignature: 'sig'.repeat(20),
    ...overrides,
  };
}

// Factory for active transactions
export function createActiveTransaction(
  proposal: Proposal,
  iAmProposer: boolean,
  currentBlock: number
): ActiveTransaction {
  const windowEndsAt = currentBlock + proposal.windowBlocks;
  const reportDeadline = windowEndsAt + proposal.reportWindowBlocks;
  
  return {
    id: proposal.id,
    counterpartyBadgeId: iAmProposer
      ? proposal.counterpartyBadgeId!
      : proposal.proposerBadgeId,
    value: proposal.value,
    category: proposal.category as TxCategory,
    startedAt: currentBlock,
    windowEndsAt,
    reportDeadline,
    iAmProposer,
  };
}

// Default network for tests
export const TEST_NETWORK: Network = 'testnet4';

// Current block height for tests
export const TEST_CURRENT_BLOCK = 117190;
