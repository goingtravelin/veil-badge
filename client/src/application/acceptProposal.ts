

import { VeilBadge } from '../domain/types';
import {
  Proposal,
  ActiveTransaction,
  TxCategory,
} from '../domain/proposal';
import {
  UseCaseResult,
  UtxoInfo,
  Network,
  IBitcoinPort,
  IProverPort,
  ICryptoPort,
  IStoragePort,
} from './ports';
import { generateAcceptProposalSpell } from '../utils/spellGenerator';
import { createLogger } from '../utils/logger';
import { selectFundingUtxo } from '../domain/bitcoin';

const logger = createLogger('acceptProposal');

export interface AcceptProposalInput {
  /** The proposal being accepted */
  proposal: Proposal;
  /** My badge (the acceptor) */
  myBadge: VeilBadge;
  /** UTXO containing my badge */
  myBadgeUtxo: UtxoInfo;
  /** All available UTXOs (to find funding UTXO) */
  availableUtxos: UtxoInfo[];
  /** Address to receive the updated badge */
  myAddress: string;
  /** My signature on the proposal ID (acceptance) */
  mySignature: string;
  /** Network to use */
  network?: Network;
}

export interface AcceptProposalOutput {
  /** Transaction ID of the broadcast transaction */
  txid: string;
  /** The active transaction created */
  activeTransaction: ActiveTransaction;
  /** Updated badge with active transaction added */
  updatedBadge: VeilBadge;
}

export interface AcceptProposalContext {
  bitcoin: IBitcoinPort;
  prover: IProverPort;
  crypto: ICryptoPort;
  storage: IStoragePort;
  network: Network;
  onProgress?: (message: string) => void;
}

export async function acceptProposal(
  input: AcceptProposalInput,
  ctx: AcceptProposalContext
): Promise<UseCaseResult<AcceptProposalOutput>> {
  const { proposal, myBadge, myBadgeUtxo, myAddress, mySignature: _mySignature } = input;
  const { bitcoin, prover, storage, crypto: _crypto, network, onProgress } = ctx;

  logger.info('Starting acceptProposal:', {
    proposalId: proposal.id.slice(0, 16),
    myBadgeId: myBadge.id.slice(0, 16),
    myBadgeUtxo: `${myBadgeUtxo.txid.slice(0, 8)}:${myBadgeUtxo.vout}`,
    availableUtxos: input.availableUtxos.length,
    proposerBadgeId: proposal.proposerBadgeId.slice(0, 16),
    value: proposal.value,
    network,
  });

  try {
    onProgress?.('Validating proposal...');

    // Get current block height
    const currentBlock = await bitcoin.getCurrentBlockHeight(network);
    logger.debug('Current block height:', currentBlock);

    // Check proposal hasn't expired
    if (currentBlock > proposal.expiresAt) {
      return {
        success: false,
        error: `Proposal expired at block ${proposal.expiresAt}, current block is ${currentBlock}`,
      };
    }

    // Verify I'm the intended counterparty
    if (proposal.counterpartyBadgeId !== myBadge.id) {
      return {
        success: false,
        error: 'This proposal is not addressed to your badge',
      };
    }

    onProgress?.('Creating active transaction...');

    // Calculate window deadlines
    const windowEndsAt = currentBlock + proposal.windowBlocks;
    const reportDeadline = windowEndsAt + proposal.reportWindowBlocks;

    // Create the active transaction
    const activeTransaction: ActiveTransaction = {
      id: proposal.id,
      counterpartyBadgeId: proposal.proposerBadgeId,
      value: proposal.value,
      category: proposal.category as TxCategory,
      startedAt: currentBlock,
      windowEndsAt,
      reportDeadline,
      iAmProposer: false,
    };

    // Create updated badge with active transaction added
    const updatedBadge: VeilBadge = {
      ...myBadge,
      active_transactions: [...myBadge.active_transactions, activeTransaction],
      last_update: currentBlock,
    };

    onProgress?.('Generating spell...');

    // Generate the accept proposal spell
    const spellYaml = generateAcceptProposalSpell({
      badgeUtxo: myBadgeUtxo,
      oldBadge: myBadge,
      newBadge: updatedBadge,
      proposalId: proposal.id,
      proposerBadgeId: proposal.proposerBadgeId,
      value: proposal.value,
      category: proposal.category,
      windowBlocks: proposal.windowBlocks,
      reportWindowBlocks: proposal.reportWindowBlocks,
      currentBlock,
      destinationAddress: myAddress,
    });

    logger.debug('Generated spell YAML length:', spellYaml.length);

    // Get previous transaction for proving (badge UTXO)
    logger.debug('Fetching badge prev tx:', myBadgeUtxo.txid.slice(0, 16));
    const badgePrevTx = await bitcoin.fetchTransaction(myBadgeUtxo.txid, network);
    logger.debug('Badge prev tx fetched, length:', badgePrevTx.length);

    onProgress?.('Selecting funding UTXO...');

    // Find a funding UTXO (separate from badge UTXO) to pay fees
    // Filter out the badge UTXO itself
    logger.debug('Available UTXOs for funding:', input.availableUtxos.map(u => ({
      txid: u.txid.slice(0, 8),
      vout: u.vout,
      value: u.value,
    })));
    
    const otherUtxos = input.availableUtxos.filter(
      u => !(u.txid === myBadgeUtxo.txid && u.vout === myBadgeUtxo.vout)
    );
    logger.debug('UTXOs after filtering badge UTXO:', otherUtxos.length);
    
    // Get burned UTXOs to exclude (UTXOs already sent to prover)
    const burnedUtxos = storage.getBurnedUtxos?.() ?? [];
    const burnedUtxoIds = burnedUtxos.map(u => u.utxoId);
    logger.debug('Burned UTXOs to exclude:', burnedUtxoIds.length);
    
    const MIN_FUNDING_SATS = 5000; // Minimum sats needed for fees
    const fundingUtxo = selectFundingUtxo(otherUtxos, undefined, MIN_FUNDING_SATS, burnedUtxoIds);
    
    if (!fundingUtxo) {
      logger.error('No suitable funding UTXO found:', {
        availableUtxos: otherUtxos.map(u => ({ txid: u.txid.slice(0, 8), value: u.value })),
        minRequired: MIN_FUNDING_SATS,
      });
      return {
        success: false,
        error: `No suitable funding UTXO found. Need at least ${MIN_FUNDING_SATS} sats (separate from badge UTXO) to pay transaction fees.`,
      };
    }
    
    logger.info('Selected funding UTXO:', {
      txid: fundingUtxo.txid.slice(0, 8),
      vout: fundingUtxo.vout,
      value: fundingUtxo.value,
    });

    onProgress?.('Proving transaction...');

    // Get funding UTXO's prev tx if different from badge
    const prevTxs = [badgePrevTx];
    if (fundingUtxo.txid !== myBadgeUtxo.txid) {
      logger.debug('Fetching funding prev tx:', fundingUtxo.txid.slice(0, 16));
      const fundingPrevTx = await bitcoin.fetchTransaction(fundingUtxo.txid, network);
      prevTxs.push(fundingPrevTx);
    }

    logger.info('Sending to prover:', {
      spellYamlLength: spellYaml.length,
      prevTxsCount: prevTxs.length,
      fundingUtxo: `${fundingUtxo.txid.slice(0, 8)}:${fundingUtxo.vout}`,
      fundingValue: fundingUtxo.value,
      changeAddress: myAddress.slice(0, 16),
    });

    // Mark funding UTXO as burned BEFORE calling prover to prevent duplicate use
    const fundingUtxoId = `${fundingUtxo.txid}:${fundingUtxo.vout}`;
    storage.addBurnedUtxo?.(fundingUtxoId);
    logger.debug('Marked funding UTXO as burned:', fundingUtxoId);

    const proveResult = await prover.prove({
      spellYaml,
      prevTxs,
      fundingUtxo: { txid: fundingUtxo.txid, vout: fundingUtxo.vout },
      fundingUtxoValue: fundingUtxo.value,
      changeAddress: myAddress,
      feeRate: 2.0,
    });

    if (!proveResult.success || !proveResult.spellTx) {
      return {
        success: false,
        error: proveResult.error || 'Proof generation failed',
      };
    }

    // In mock mode, don't broadcast
    if (proveResult.isMock) {
      logger.info('Mock mode: skipping broadcast');
      return {
        success: true,
        data: {
          txid: 'mock_txid_' + Date.now(),
          activeTransaction,
          updatedBadge,
        },
      };
    }

    onProgress?.('Broadcasting transaction...');

    // Broadcast the spell transaction
    const txid = await bitcoin.broadcast(proveResult.spellTx, network);

    logger.info('Proposal accepted successfully', { txid, proposalId: proposal.id });

    return {
      success: true,
      data: {
        txid,
        activeTransaction,
        updatedBadge,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('acceptProposal failed:', { error: errorMessage });
    return {
      success: false,
      error: errorMessage,
    };
  }
}
