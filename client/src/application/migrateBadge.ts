import { VeilBadge } from '../domain/types';
import {
  UseCaseResult,
  UtxoInfo,
  Network,
  IBitcoinPort,
  IProverPort,
  IStoragePort,
} from './ports';
import { generateMigrateBadgeSpell } from '../utils/spellGenerator';
import { createLogger } from '../utils/logger';
import { selectFundingUtxo } from '../domain/bitcoin';
import { VEIL_APP_VK, badgeNeedsMigration } from '../domain/charm';

const logger = createLogger('migrateBadge');

export interface MigrateBadgeInput {
  badge: VeilBadge;
  badgeUtxo: UtxoInfo;
  badgeVk: string;
  availableUtxos: UtxoInfo[];
  destinationAddress: string;
  network?: Network;
}

export interface MigrateBadgeOutput {
  txid: string;
  migratedBadge: VeilBadge;
  newVk: string;
}

export interface MigrateBadgeContext {
  bitcoin: IBitcoinPort;
  prover: IProverPort;
  storage: IStoragePort;
  network: Network;
  onProgress?: (message: string) => void;
}

export async function migrateBadge(
  input: MigrateBadgeInput,
  ctx: MigrateBadgeContext
): Promise<UseCaseResult<MigrateBadgeOutput>> {
  const { badge, badgeUtxo, badgeVk, availableUtxos, destinationAddress } = input;
  const { bitcoin, prover, network, onProgress } = ctx;

  logger.info('Starting badge migration:', {
    badgeId: badge.id.slice(0, 16),
    oldVk: badgeVk.slice(0, 16),
    newVk: VEIL_APP_VK.slice(0, 16),
  });

  try {
    if (!badgeNeedsMigration(badgeVk)) {
      return {
        success: false,
        error: 'Badge does not need migration - already on current VK',
      };
    }

    onProgress?.('Generating migration spell...');

    const spellYaml = generateMigrateBadgeSpell({
      badgeUtxo,
      badge,
      oldVk: badgeVk,
      newVk: VEIL_APP_VK,
      destinationAddress,
    });

    logger.debug('Generated migration spell YAML length:', spellYaml.length);

    onProgress?.('Fetching previous transaction...');

    const prevTxHex = await bitcoin.fetchTransaction(badgeUtxo.txid, network);

    onProgress?.('Selecting funding UTXO...');

    const nonBadgeUtxos = availableUtxos.filter(
      u => !(u.txid === badgeUtxo.txid && u.vout === badgeUtxo.vout)
    );

    const fundingUtxo = selectFundingUtxo(nonBadgeUtxos, undefined, 2000);
    if (!fundingUtxo) {
      return {
        success: false,
        error: 'No suitable funding UTXO found. Need at least 2000 sats.',
      };
    }

    logger.info('Selected funding UTXO:', {
      txid: fundingUtxo.txid.slice(0, 8),
      vout: fundingUtxo.vout,
      value: fundingUtxo.value,
    });

    const fundingPrevTxHex = await bitcoin.fetchTransaction(fundingUtxo.txid, network);

    onProgress?.('Proving migration transaction...');

    // ProverService automatically extracts all VKs from spell and loads binaries
    const proveResult = await prover.prove({
      spellYaml,
      prevTxs: [prevTxHex, fundingPrevTxHex],
      fundingUtxo: {
        txid: fundingUtxo.txid,
        vout: fundingUtxo.vout,
      },
      fundingUtxoValue: fundingUtxo.value,
      changeAddress: destinationAddress,
      feeRate: 2,
    });

    if (!proveResult.success || !proveResult.spellTx) {
      return {
        success: false,
        error: proveResult.error || 'Prover failed to generate transaction',
      };
    }

    onProgress?.('Broadcasting migration transaction...');

    const txid = await bitcoin.broadcast(proveResult.spellTx, network);

    logger.info('Migration transaction broadcast:', txid);

    const migratedBadge: VeilBadge = {
      ...badge,
      utxo: { txid, vout: 0 },
    };

    onProgress?.('Migration complete!');

    return {
      success: true,
      data: {
        txid,
        migratedBadge,
        newVk: VEIL_APP_VK,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Migration failed:', message);
    return {
      success: false,
      error: `Migration failed: ${message}`,
    };
  }
}
