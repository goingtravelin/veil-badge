

import { VeilBadge } from '../domain/types';
import {
  TxCategory,
  ReportedOutcome,
  ActiveTransaction,
  ReportingTransaction,
} from '../domain/proposal';
import { UtxoInfo } from '../application/ports';
import { VEIL_APP_VK } from '../domain';
import { createLogger } from './logger';

const logger = createLogger('SpellGenerator');
const DUST_LIMIT_SATS = 546;

export interface AcceptProposalSpellParams {
  badgeUtxo: UtxoInfo;
  oldBadge: VeilBadge;
  newBadge: VeilBadge;
  proposalId: string;
  proposerBadgeId: string;
  value: number;
  category: TxCategory;
  windowBlocks: number;
  reportWindowBlocks: number;
  currentBlock: number;
  destinationAddress: string;
}

export function generateAcceptProposalSpell(params: AcceptProposalSpellParams): string {
  const {
    badgeUtxo,
    oldBadge,
    newBadge,
    proposalId,
    proposerBadgeId,
    value,
    category,
    windowBlocks,
    reportWindowBlocks,
    currentBlock,
    destinationAddress,
  } = params;

  logger.info('Generating AcceptProposal spell:', {
    badgeUtxo: `${badgeUtxo.txid.slice(0, 8)}:${badgeUtxo.vout}`,
    badgeId: oldBadge.id.slice(0, 16),
    proposalId: proposalId.slice(0, 16),
    proposerBadgeId: proposerBadgeId.slice(0, 16),
    value,
    category,
    windowBlocks,
    reportWindowBlocks,
    currentBlock,
    oldBadgeActiveTxs: oldBadge.active_transactions.length,
    newBadgeActiveTxs: newBadge.active_transactions.length,
  });

  // App identity = badge ID = SHA256(genesis UTXO) from when badge was minted
  const appId = oldBadge.id;
  const appVk = VEIL_APP_VK;

  // Serialize badge states in YAML-friendly format (inline with spell)
  const oldBadgeYaml = serializeBadgeStateYaml(oldBadge);
  const newBadgeYaml = serializeBadgeStateYaml(newBadge);

  const spell = `version: 8

apps:
  $00: "n/${appId}/${appVk}"

ins:
  - utxo_id: "${badgeUtxo.txid}:${badgeUtxo.vout}"
    charms:
      $00:
${oldBadgeYaml}

outs:
  - address: "${destinationAddress}"
    sats: ${DUST_LIMIT_SATS}
    charms:
      $00:
${newBadgeYaml}

public_args:
  $00:
    AcceptProposal:
      proposal_id: "${proposalId}"
      proposer_badge_id: "${proposerBadgeId}"
      value: ${value}
      category: ${category}
      window_blocks: ${windowBlocks}
      report_window_blocks: ${reportWindowBlocks}
      current_block: ${currentBlock}
`;

  logger.debug('Generated AcceptProposal spell YAML:', spell);
  return spell;
}

export interface ReportOutcomeSpellParams {
  badgeUtxo: UtxoInfo;
  oldBadge: VeilBadge;
  newBadge: VeilBadge;
  transactionId: string;
  outcome: ReportedOutcome;
  currentBlock: number;
  destinationAddress: string;
}

export function generateReportOutcomeSpell(params: ReportOutcomeSpellParams): string {
  const {
    badgeUtxo,
    oldBadge,
    newBadge,
    transactionId,
    outcome,
    currentBlock,
    destinationAddress,
  } = params;

  logger.info('Generating ReportOutcome spell:', {
    badgeUtxo: `${badgeUtxo.txid.slice(0, 8)}:${badgeUtxo.vout}`,
    badgeId: oldBadge.id.slice(0, 16),
    transactionId: transactionId.slice(0, 16),
    outcome,
    currentBlock,
  });

  // App identity = badge ID = SHA256(genesis UTXO) from when badge was minted
  const appId = oldBadge.id;
  const appVk = VEIL_APP_VK;

  // Serialize badge states in YAML format
  const oldBadgeYaml = serializeBadgeStateYaml(oldBadge);
  const newBadgeYaml = serializeBadgeStateYaml(newBadge);

  const spell = `version: 8

apps:
  $00: "n/${appId}/${appVk}"

ins:
  - utxo_id: "${badgeUtxo.txid}:${badgeUtxo.vout}"
    charms:
      $00:
${oldBadgeYaml}

outs:
  - address: "${destinationAddress}"
    sats: ${DUST_LIMIT_SATS}
    charms:
      $00:
${newBadgeYaml}

public_args:
  $00:
    ReportOutcome:
      transaction_id: "${transactionId}"
      outcome: ${outcome}
      current_block: ${currentBlock}
`;

  logger.debug('Generated ReportOutcome spell YAML:', spell);
  return spell;
}

/**
 * Serialize badge state as indented YAML (for embedding in spell)
 * Each line indented 8 spaces to fit under $00:
 */
function serializeBadgeStateYaml(badge: VeilBadge): string {
  const indent = '        '; // 8 spaces
  
  const lines = [
    `id: "${badge.id}"`,
    `created_at: ${badge.created_at}`,
    `pubkey: "${badge.pubkey}"`,
    `tx_total: ${badge.tx_total}`,
    `tx_positive: ${badge.tx_positive}`,
    `tx_negative: ${badge.tx_negative}`,
    `volume_total: ${badge.volume_total}`,
    `volume_sum_squares: ${badge.volume_sum_squares}`,
    `window_tx_count: ${badge.window_tx_count}`,
    `window_volume: ${badge.window_volume}`,
    `window_start: ${badge.window_start}`,
    `counterparty_count: ${badge.counterparty_count}`,
    `backing:`,
    `  backed_count: ${badge.backing.backed_count}`,
    `  unbacked_count: ${badge.backing.unbacked_count}`,
    `  backed_volume: ${badge.backing.backed_volume}`,
    `  unbacked_volume: ${badge.backing.unbacked_volume}`,
    `vouches_out: ${serializeVouchesYaml(badge.vouches_out)}`,
    `vouches_in: ${serializeVouchesYaml(badge.vouches_in)}`,
    `cascade_damage: ${badge.cascade_damage}`,
    `active_transactions: ${serializeActiveTransactionsYaml(badge.active_transactions)}`,
    `reporting_transactions: ${serializeReportingTransactionsYaml(badge.reporting_transactions)}`,
    `outcomes:`,
    `  mutual_positive: ${badge.outcomes.mutualPositive}`,
    `  mutual_negative: ${badge.outcomes.mutualNegative}`,
    `  contested_i_positive: ${badge.outcomes.contestedIPositive}`,
    `  contested_i_negative: ${badge.outcomes.contestedINegative}`,
    `  timeout: ${badge.outcomes.timeout}`,
    `  mutual_timeout: ${badge.outcomes.mutualTimeout}`,
    `trust: ${badge.trust}`,
    `risk: ${badge.risk}`,
    `flags: ${serializeRiskFlags(badge.flags)}`,
    `last_nonce: "${badge.last_nonce}"`,
    `last_update: ${badge.last_update}`,
  ];
  
  return lines.map(line => indent + line).join('\n');
}

function serializeVouchesYaml(vouches: VeilBadge['vouches_out']): string {
  if (vouches.length === 0) return '[]';
  const items = vouches.map(v => 
    `{ badge_id: "${v.badge_id}", stake_percent: ${v.stake_percent}, created_at: ${v.created_at}, unlock_at: ${v.unlock_at} }`
  );
  return `[${items.join(', ')}]`;
}

function serializeActiveTransactionsYaml(txs: ActiveTransaction[]): string {
  if (txs.length === 0) return '[]';
  const items = txs.map(tx => 
    `{ id: "${tx.id}", counterparty_badge_id: "${tx.counterpartyBadgeId}", value: ${tx.value}, category: "${tx.category}", started_at: ${tx.startedAt}, window_ends_at: ${tx.windowEndsAt}, report_deadline: ${tx.reportDeadline}, i_am_proposer: ${tx.iAmProposer} }`
  );
  return `[${items.join(', ')}]`;
}

function serializeReportingTransactionsYaml(txs: ReportingTransaction[]): string {
  if (txs.length === 0) return '[]';
  const items = txs.map(tx => 
    `{ id: "${tx.id}", counterparty_badge_id: "${tx.counterpartyBadgeId}", value: ${tx.value}, category: "${tx.category}", report_deadline: ${tx.reportDeadline}, my_report: ${tx.myReport ? `"${tx.myReport}"` : 'null'}, i_am_proposer: ${tx.iAmProposer} }`
  );
  return `[${items.join(', ')}]`;
}

function serializeRiskFlags(flags: VeilBadge['flags']): number {
  let bits = 0;
  if (flags.acceleration) bits |= 0b00000001;
  if (flags.extraction) bits |= 0b00000010;
  if (flags.isolated) bits |= 0b00000100;
  if (flags.too_clean) bits |= 0b00001000;
  if (flags.erratic) bits |= 0b00010000;
  if (flags.new_badge) bits |= 0b00100000;
  return bits;
}
