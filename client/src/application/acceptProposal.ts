
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
import { charmsService } from '../services/CharmsService';
import { VEIL_APP_VK } from '../domain/charm';
import { getAddressFromTxOutput } from '../services/TaprootKeyService';

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
  /** VK of acceptor's badge (optional - defaults to current VK) */
  acceptorVk?: string;
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
    // Ensure WASM is initialized before any charms operations
    if (!charmsService.isReady()) {
      onProgress?.('Initializing WASM module...');
      await charmsService.initWasm();
    }

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

    onProgress?.('Fetching proposer badge...');

    // Fetch proposer's badge from their UTXO using CharmsService
    // Use scanUtxoForAnyBadge since proposer may have minted with a different VK version
    const proposerBadgeUtxo = proposal.proposerBadgeUtxo;
    logger.debug('Fetching proposer badge from UTXO:', `${proposerBadgeUtxo.txid.slice(0, 8)}:${proposerBadgeUtxo.vout}`);
    
    const proposerBadgeResult = await charmsService.scanUtxoForAnyBadge(
      proposerBadgeUtxo.txid,
      proposerBadgeUtxo.vout,
      network
    );

    if (!proposerBadgeResult) {
      return {
        success: false,
        error: 'Proposer badge not found or invalid. They may have spent it. Please request a new proposal.',
      };
    }

    const { badge: proposerBadge, vk: proposerVk } = proposerBadgeResult;

    // Verify proposer badge ID matches
    if (proposerBadge.id !== proposal.proposerBadgeId) {
      return {
        success: false,
        error: 'Proposer badge ID mismatch. Invalid proposal.',
      };
    }

    // Get acceptor's badge VK from input, or default to current VK
    const acceptorVk = input.acceptorVk || VEIL_APP_VK;

    // Log VK information - cross-VK transactions are supported!
    // Each badge is validated by its own VK atomically in the same transaction
    logger.info('Badge VKs for atomic transaction:', {
      proposerVk: proposerVk.slice(0, 16),
      acceptorVk: acceptorVk.slice(0, 16),
      crossVk: proposerVk !== acceptorVk,
    });

    logger.info('Proposer badge verified:', {
      badgeId: proposerBadge.id.slice(0, 16),
      utxo: `${proposerBadgeUtxo.txid.slice(0, 8)}:${proposerBadgeUtxo.vout}`,
      vk: proposerVk.slice(0, 16),
    });

    onProgress?.('Creating active transaction...');

    // Calculate window deadlines
    const windowEndsAt = currentBlock + proposal.windowBlocks;
    const reportDeadline = windowEndsAt + proposal.reportWindowBlocks;

    // Create the active transaction (same for both parties)
    const activeTransaction: ActiveTransaction = {
      id: proposal.id,
      counterparty_badge_id: proposal.proposerBadgeId,
      value: proposal.value,
      category: proposal.category as TxCategory,
      started_at: currentBlock,
      window_ends_at: windowEndsAt,
      report_deadline: reportDeadline,
    };

    // For proposer, they see the inverse
    const proposerActiveTransaction: ActiveTransaction = {
      id: proposal.id,
      counterparty_badge_id: myBadge.id,
      value: proposal.value,
      category: proposal.category as TxCategory,
      started_at: currentBlock,
      window_ends_at: windowEndsAt,
      report_deadline: reportDeadline,
    };

    // Create updated badges with active transactions added
    const acceptorUpdatedBadge: VeilBadge = {
      ...myBadge,
      active_transactions: [...myBadge.active_transactions, activeTransaction],
      last_update: currentBlock,
    };

    const proposerUpdatedBadge: VeilBadge = {
      ...proposerBadge,
      active_transactions: [...proposerBadge.active_transactions, proposerActiveTransaction],
      last_update: currentBlock,
    };

    // Fetch proposer's transaction to extract their address
    // We need this early to generate the spell with correct addresses
    const proposerPrevTxForAddress = await bitcoin.fetchTransaction(proposerBadgeUtxo.txid, network);
    
    // Extract proposer's address from their badge UTXO output
    const isTestnet = network !== 'mainnet';
    const proposerAddress = getAddressFromTxOutput(proposerPrevTxForAddress, proposerBadgeUtxo.vout, isTestnet);
    
    if (!proposerAddress) {
      return {
        success: false,
        error: 'Could not extract proposer address from badge UTXO',
      };
    }
    
    logger.info('Extracted proposer address:', proposerAddress.slice(0, 20) + '...');

    onProgress?.('Generating atomic spell...');

    // Generate the atomic accept proposal spell (updates BOTH badges)
    // Important: Use the actual VKs from the on-chain badges
    const spellYaml = generateAcceptProposalSpell({
      acceptorBadgeUtxo: myBadgeUtxo,
      acceptorOldBadge: myBadge,
      acceptorNewBadge: acceptorUpdatedBadge,
      acceptorAddress: myAddress,
      acceptorVk, // Use the actual VK from the acceptor's on-chain badge
      proposerBadgeUtxo: {
        txid: proposerBadgeUtxo.txid,
        vout: proposerBadgeUtxo.vout,
        value: 546, // DUST_LIMIT
        scriptPubKey: '',
      },
      proposerOldBadge: proposerBadge,
      proposerNewBadge: proposerUpdatedBadge,
      proposerAddress,
      proposerVk, // Use the actual VK from the proposer's on-chain badge
      proposalId: proposal.id,
      value: proposal.value,
      category: proposal.category,
      windowBlocks: proposal.windowBlocks,
      reportWindowBlocks: proposal.reportWindowBlocks,
      currentBlock,
    });

    logger.debug('Generated atomic spell YAML length:', spellYaml.length);

    // Get previous transactions for proving (BOTH badge UTXOs)
    // Note: proposer prev tx was already fetched earlier to extract address
    logger.debug('Fetching acceptor badge prev tx:', myBadgeUtxo.txid.slice(0, 16));
    const acceptorPrevTx = await bitcoin.fetchTransaction(myBadgeUtxo.txid, network);
    
    // Reuse the proposer tx we fetched earlier for address extraction
    const proposerPrevTx = proposerPrevTxForAddress;
    logger.debug('Using cached proposer prev tx');
    
    logger.debug('Both prev txs ready');

    onProgress?.('Selecting funding UTXO...');

    // Find a funding UTXO (separate from BOTH badge UTXOs) to pay fees
    logger.debug('Available UTXOs for funding:', input.availableUtxos.map(u => ({
      txid: u.txid.slice(0, 8),
      vout: u.vout,
      value: u.value,
    })));
    
    const otherUtxos = input.availableUtxos.filter(
      u => !(
        (u.txid === myBadgeUtxo.txid && u.vout === myBadgeUtxo.vout) ||
        (u.txid === proposerBadgeUtxo.txid && u.vout === proposerBadgeUtxo.vout)
      )
    );
    logger.debug('UTXOs after filtering both badge UTXOs:', otherUtxos.length);
    
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
        error: `No suitable funding UTXO found. Need at least ${MIN_FUNDING_SATS} sats (separate from both badge UTXOs) to pay transaction fees.`,
      };
    }
    
    logger.info('Selected funding UTXO:', {
      txid: fundingUtxo.txid.slice(0, 8),
      vout: fundingUtxo.vout,
      value: fundingUtxo.value,
    });

    onProgress?.('Proving transaction...');

    // Get funding UTXO's prev tx if different from both badge UTXOs
    // Note: prev_txs order does not need to match spell inputs - prover matches by txid
    const prevTxs = [proposerPrevTx, acceptorPrevTx];
    if (fundingUtxo.txid !== myBadgeUtxo.txid && fundingUtxo.txid !== proposerBadgeUtxo.txid) {
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
          updatedBadge: acceptorUpdatedBadge,
        },
      };
    }

    onProgress?.('Broadcasting transaction...');

    // Broadcast the spell transaction
    const txid = await bitcoin.broadcast(proveResult.spellTx, network);

    logger.info('Proposal accepted successfully (atomic)', { txid, proposalId: proposal.id });

    return {
      success: true,
      data: {
        txid,
        activeTransaction,
        updatedBadge: acceptorUpdatedBadge,
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
