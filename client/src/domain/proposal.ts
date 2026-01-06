
// Proposal Types for Veil Transaction Flow

//

export const DEFAULT_WINDOW_BLOCKS = 1008;

export const DEFAULT_REPORT_WINDOW_BLOCKS = 432;

export const DEFAULT_PROPOSAL_EXPIRY_BLOCKS = 144;

export const WINDOW_OPTIONS = [
  { label: '1 day', blocks: 144 },
  { label: '3 days', blocks: 432 },
  { label: '7 days', blocks: 1008 },
  { label: '14 days', blocks: 2016 },
  { label: '30 days', blocks: 4320 },
] as const;

export type B32 = string;

export type Signature = string;

export type PubKey = string;

export type TxCategory = 'Trade' | 'Loan' | 'Service' | 'Other';

export type ReportedOutcome = 'Positive' | 'Negative';

export interface Proposal {
  /** Unique ID derived from hash of proposal data */
  id: B32;

  /** Badge ID of the party creating the proposal */
  proposerBadgeId: B32;

  /** Proposer's badge UTXO (for atomic update) */
  proposerBadgeUtxo: { txid: string; vout: number };

  /** Badge ID of the intended counterparty (optional if using address) */
  counterpartyBadgeId?: B32;

  /** Bitcoin address of counterparty (required if no badge ID) */
  counterpartyAddress?: string;

  /** Transaction value in satoshis */
  value: number;

  /** Category for contextual weighting */
  category: TxCategory;

  /** Settlement window in blocks (time for real-world transaction) */
  windowBlocks: number;

  /** Reporting window in blocks (time to submit outcome after settlement) */
  reportWindowBlocks: number;

  /** Block height when proposal was created */
  createdAt: number;

  /** Block height when proposal expires (if not accepted) */
  expiresAt: number;

  /** Optional memo/description */
  memo?: string;

  /** Proposer's signature over the canonical proposal data */
  proposerSignature: Signature;
}

export interface CreateProposalInput {
  proposerBadgeId: B32;
  proposerBadgeUtxo: { txid: string; vout: number };
  counterpartyBadgeId?: B32;
  counterpartyAddress?: string;
  value: number;
  category: TxCategory;
  windowBlocks?: number;
  reportWindowBlocks?: number;
  memo?: string;
}

export type TransactionStatus =
  | 'pending'    // Proposal created, waiting for counterparty
  | 'active'     // Both signed, settlement window running
  | 'reporting'  // Settlement window closed, awaiting reports
  | 'settled'    // Final state, outcome recorded
  | 'expired'    // Proposal expired before acceptance
  | 'cancelled'; // Proposer withdrew before acceptance

export interface ActiveTransaction {
  /** Unique ID (same as proposal ID) */
  id: B32;

  /** Badge ID of the counterparty */
  counterpartyBadgeId: B32;

  /** Transaction value in satoshis */
  value: number;

  /** Category for contextual weighting */
  category: TxCategory;

  /** Block height when both parties signed (acceptance) */
  startedAt: number;

  /** Block height when settlement window ends (reporting begins) */
  windowEndsAt: number;

  /** Block height when reporting window ends (auto-timeout) */
  reportDeadline: number;

  /** Was I the one who proposed this transaction? */
  iAmProposer: boolean;
}

export interface ReportingTransaction {
  /** Unique ID (same as proposal/active ID) */
  id: B32;

  /** Badge ID of the counterparty */
  counterpartyBadgeId: B32;

  /** Transaction value in satoshis */
  value: number;

  /** Category for contextual weighting */
  category: TxCategory;

  /** Block height when reporting window ends */
  reportDeadline: number;

  /** What I reported (undefined = haven't reported yet) */
  myReport?: ReportedOutcome;

  /** Was I the one who proposed this transaction? */
  iAmProposer: boolean;
}

export type SettledOutcome =
  | { type: 'MutualPositive' }                    // 👍👍
  | { type: 'MutualNegative' }                    // 👎👎
  | { type: 'ContestedIPositive' }                // I said 👍, they said 👎
  | { type: 'ContestedINegative' }                // I said 👎, they said 👍
  | { type: 'Timeout'; reporterOutcome: ReportedOutcome; iReported: boolean }
  | { type: 'MutualTimeout' };                    // Neither reported

export function computeSettledOutcome(
  myReport: ReportedOutcome | undefined,
  theirReport: ReportedOutcome | undefined
): SettledOutcome {
  // Both reported
  if (myReport && theirReport) {
    if (myReport === 'Positive' && theirReport === 'Positive') {
      return { type: 'MutualPositive' };
    }
    if (myReport === 'Negative' && theirReport === 'Negative') {
      return { type: 'MutualNegative' };
    }
    if (myReport === 'Positive' && theirReport === 'Negative') {
      return { type: 'ContestedIPositive' };
    }
    return { type: 'ContestedINegative' };
  }

  // One timed out
  if (myReport && !theirReport) {
    return { type: 'Timeout', reporterOutcome: myReport, iReported: true };
  }
  if (!myReport && theirReport) {
    return { type: 'Timeout', reporterOutcome: theirReport, iReported: false };
  }

  // Both timed out
  return { type: 'MutualTimeout' };
}

export function getOutcomeDescription(outcome: SettledOutcome): string {
  switch (outcome.type) {
    case 'MutualPositive':
      return 'Both parties reported positive';
    case 'MutualNegative':
      return 'Both parties reported negative';
    case 'ContestedIPositive':
      return 'Contested: You reported positive, they reported negative';
    case 'ContestedINegative':
      return 'Contested: You reported negative, they reported positive';
    case 'Timeout':
      return outcome.iReported
        ? `You reported ${outcome.reporterOutcome.toLowerCase()}, they timed out`
        : `They reported ${outcome.reporterOutcome.toLowerCase()}, you timed out`;
    case 'MutualTimeout':
      return 'Neither party reported (treated as positive)';
  }
}

export function getOutcomeTrustWeight(outcome: SettledOutcome): number {
  switch (outcome.type) {
    case 'MutualPositive': return 1.0;
    case 'MutualNegative': return -1.0;
    case 'ContestedIPositive': return 0.0;
    case 'ContestedINegative': return 0.0;
    case 'MutualTimeout': return 0.8;
    case 'Timeout':
      return outcome.reporterOutcome === 'Positive' ? 0.9 : -0.5;
  }
}

export interface OutcomeAggregates {
  /** Both parties said positive 👍👍 */
  mutualPositive: number;

  /** Both parties said negative 👎👎 */
  mutualNegative: number;

  /** I said positive, they said negative */
  contestedIPositive: number;

  /** I said negative, they said positive */
  contestedINegative: number;

  /** One party timed out */
  timeout: number;

  /** Both parties timed out */
  mutualTimeout: number;
}

export function createEmptyAggregates(): OutcomeAggregates {
  return {
    mutualPositive: 0,
    mutualNegative: 0,
    contestedIPositive: 0,
    contestedINegative: 0,
    timeout: 0,
    mutualTimeout: 0,
  };
}

export function getComplaintRatio(agg: OutcomeAggregates): number | null {
  const totalContested = agg.contestedIPositive + agg.contestedINegative;
  if (totalContested === 0) return null;
  return agg.contestedINegative / totalContested;
}

export function getTotalTransactions(agg: OutcomeAggregates): number {
  return (
    agg.mutualPositive +
    agg.mutualNegative +
    agg.contestedIPositive +
    agg.contestedINegative +
    agg.timeout +
    agg.mutualTimeout
  );
}

export function isInSettlementWindow(tx: ActiveTransaction, currentBlock: number): boolean {
  return currentBlock < tx.windowEndsAt;
}

export function isInReportingPhase(tx: ActiveTransaction, currentBlock: number): boolean {
  return currentBlock >= tx.windowEndsAt && currentBlock < tx.reportDeadline;
}

export function isPastDeadline(
  tx: ActiveTransaction | ReportingTransaction,
  currentBlock: number
): boolean {
  return currentBlock >= tx.reportDeadline;
}

export function getBlocksRemaining(targetBlock: number, currentBlock: number): number {
  return Math.max(0, targetBlock - currentBlock);
}

export function blocksToTime(blocks: number): string {
  const minutes = blocks * 10;

  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}

export function formatSats(sats: number): string {
  if (sats >= 100_000_000) {
    return `${(sats / 100_000_000).toFixed(2)} BTC`;
  }
  if (sats >= 1_000_000) {
    return `${(sats / 1_000_000).toFixed(2)}M sats`;
  }
  if (sats >= 1_000) {
    return `${(sats / 1_000).toFixed(1)}k sats`;
  }
  return `${sats} sats`;
}

export function truncateBadgeId(id: B32, chars: number = 8): string {
  if (id.length <= chars * 2 + 3) return id;
  return `${id.slice(0, chars)}...${id.slice(-chars)}`;
}
