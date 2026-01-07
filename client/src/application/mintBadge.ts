

// Orchestrates the badge minting flow:
// 1. Validate inputs
// 2. Select funding UTXO
// 3. Generate badge ID
// 4. Build spell
// 5. Get ZK proof
// 6. Sign and broadcast
//

import {
  VeilBadge,
  createNewBadge,
  validateMint,
  validateFundingUtxo,
  CONSTANTS,
  selectFundingUtxo,
  VEIL_APP_VK,
} from '../domain';
import {
  UseCaseContext,
  UseCaseResult,
} from './ports';
import { createLogger } from '../utils/logger';
import {
  signCommitTransaction,
  signSpellTransaction,
} from '../services/TransactionSigningService';
import {
  hasSeedPhrase,
  getPrimaryAddress,
} from '../services/TaprootKeyService';

const logger = createLogger('mintBadge');

export interface MintBadgeInput {
  address: string;
  pubkey: string;
}

export interface MintBadgeOutput {
  badge: VeilBadge;
  txid: string;
  commitTxid?: string;
}

interface SpellConfig {
  appId: string;
  appVk: string;
}

// Default Veil app configuration

const VEIL_APP_CONFIG: SpellConfig = {
  appId: '0'.repeat(64), // Overridden with SHA256(genesisUtxo) during minting
  appVk: VEIL_APP_VK, // Real verification key from compiled app
};

// Exported for testing
export function buildMintSpellYaml(
  genesisUtxo: string,
  outputAddress: string,
  ownerPubkey: string,
  badge: VeilBadge,
  config: SpellConfig = VEIL_APP_CONFIG
): string {

  // isolated = 0b00000100 = 4
  // new_badge = 0b00100000 = 32
  // isolated + new_badge = 36
  const flagsBits = 0b00100100; // NEW_BADGE | ISOLATED for new badges

  return `version: 8

apps:
  $00: "n/${config.appId}/${config.appVk}"

ins:
  - utxo_id: "${genesisUtxo}"
    charms: {}

outs:
  - address: "${outputAddress}"
    sats: ${CONSTANTS.DUST_LIMIT_SATS}
    charms:
      $00:
        schema_version: 1
        id: "${badge.id}"
        created_at: ${badge.created_at}
        pubkey: "${badge.pubkey}"
        tx_total: 0
        tx_positive: 0
        tx_negative: 0
        volume_total: 0
        volume_sum_squares: 0
        window_tx_count: 0
        window_volume: 0
        window_start: ${badge.window_start}
        counterparty_count: 0
        backing:
          backed_count: 0
          unbacked_count: 0
          backed_volume: 0
          unbacked_volume: 0
        vouches_out: []
        vouches_in: []
        cascade_damage: 0
        active_transactions: []
        reporting_transactions: []
        outcomes:
          mutual_positive: 0
          mutual_negative: 0
          contested_i_positive: 0
          contested_i_negative: 0
          timeout: 0
          mutual_timeout: 0
        trust: 15
        risk: 35
        flags: ${flagsBits}
        last_nonce: "${badge.last_nonce}"
        last_update: ${badge.last_update}

public_args:
  $00:
    Mint:
      pubkey: "${ownerPubkey}"
      current_block: ${badge.created_at}
`;
}

export async function mintBadge(
  input: MintBadgeInput,
  ctx: UseCaseContext
): Promise<UseCaseResult<MintBadgeOutput>> {
  const { bitcoin, prover, storage, crypto, network, onProgress } = ctx;
  const progress = onProgress || (() => {});
  
  try {
    // ========================================================================
    // STEP 1: Validate inputs
    // ========================================================================
    progress('Validating inputs...');
    
    const mintValidation = validateMint(input.address, input.pubkey);
    if (!mintValidation.valid) {
      return {
        success: false,
        error: `Validation failed: ${mintValidation.errors.join(', ')}`,
      };
    }
    
    // ========================================================================
    // STEP 2: Fetch UTXOs and select genesis + funding UTXOs
    // ========================================================================
    progress('Fetching UTXOs...');

    // Use seed phrase address for UTXOs if available
    let fundingAddress = input.address;
    if (hasSeedPhrase()) {
      const seedAddress = await getPrimaryAddress(
        localStorage.getItem('veil_seed_phrase')!,
        network === 'testnet4'
      );
      logger.info(`Using seed phrase address for UTXOs: ${seedAddress}`);
      fundingAddress = seedAddress;
    }

    const utxos = await bitcoin.fetchUtxos(fundingAddress, network);

    // Get list of burned UTXOs (already sent to prover, can't be reused)
    // The Charms prover caches requests by funding UTXO
    const burnedUtxos = storage.getBurnedUtxos?.() ?? [];
    const burnedUtxoIds = burnedUtxos.map(u => u.utxoId);
    
    if (burnedUtxoIds.length > 0) {
      logger.info(`Filtering out ${burnedUtxoIds.length} burned UTXOs from prover cache`);
    }

    // For minting, we need TWO separate UTXOs:
    // 1. Genesis UTXO - consumed by spell input, becomes the NFT identity
    // 2. Funding UTXO - separate plain BTC UTXO to pay transaction fees
    // 
    // Filter out burned UTXOs first, then sort by value ascending
    const availableUtxos = utxos.filter(utxo => {
      const utxoId = `${utxo.txid}:${utxo.vout}`;
      return !burnedUtxoIds.includes(utxoId);
    });
    
    const sortedUtxos = [...availableUtxos].sort((a, b) => a.value - b.value);
    
    // Need at least 2 UTXOs
    if (sortedUtxos.length < 2) {
      const burnedMsg = burnedUtxoIds.length > 0 
        ? ` (${burnedUtxoIds.length} UTXOs are burned from previous prover attempts - they expire after 24h)`
        : '';
      return {
        success: false,
        error: `Need at least 2 available UTXOs for minting: one for genesis (spell input) and one for funding (fees). Found ${sortedUtxos.length}.${burnedMsg}`,
      };
    }

    // Use smallest UTXO as genesis (just needs to exist, value doesn't matter much)
    const genesisUtxoInfo = sortedUtxos[0];
    
    // Find a funding UTXO from remaining UTXOs (needs enough value for fees)
    const remainingUtxos = sortedUtxos.slice(1);
    const fundingUtxo = selectFundingUtxo(remainingUtxos, undefined, CONSTANTS.MIN_FUNDING_SATS, burnedUtxoIds);
    if (!fundingUtxo) {
      return {
        success: false,
        error: `No suitable funding UTXO found. Need at least ${CONSTANTS.MIN_FUNDING_SATS} sats (excluding genesis UTXO and burned UTXOs).`,
      };
    }
    
    const utxoValidation = validateFundingUtxo(fundingUtxo);
    if (!utxoValidation.valid) {
      return {
        success: false,
        error: utxoValidation.errors.join(', '),
      };
    }
    
    // ========================================================================
    // STEP 3: Generate badge ID and app ID from genesis UTXO
    // ========================================================================
    progress('Generating badge ID...');

    // Genesis UTXO is the spell input - its hash becomes the NFT/badge identity
    const genesisUtxo = `${genesisUtxoInfo.txid}:${genesisUtxoInfo.vout}`;
    const badgeId = await crypto.generateBadgeId(genesisUtxo);

    const appId = await crypto.sha256Hex(genesisUtxo);

    // ========================================================================
    // STEP 4: Get current block height
    // ========================================================================
    progress('Getting current block height...');

    const currentBlock = await bitcoin.getCurrentBlockHeight(network);

    // ========================================================================

    // ========================================================================
    progress('Creating badge...');

    const newBadge = createNewBadge(badgeId, input.pubkey, currentBlock);

    // ========================================================================
    // STEP 6: Build the spell with generated app ID
    // ========================================================================
    progress('Building spell...');

    const spellYaml = buildMintSpellYaml(
      genesisUtxo,
      input.address,
      input.pubkey,
      newBadge,
      {
        appId,
        appVk: VEIL_APP_VK, // Use real verification key from compiled app
      }
    );
    
    // ========================================================================

    // ========================================================================
    progress('Fetching previous transactions...');
    
    // Need prev_txs for the genesis UTXO (spell input) to verify ownership
    // The funding UTXO doesn't need to be in prev_txs - it's handled separately by the prover
    const genesisPrevTxHex = await bitcoin.fetchTransaction(genesisUtxoInfo.txid, network);
    
    // ========================================================================
    // STEP 8: Generate ZK proof
    // ========================================================================
    progress('Generating ZK proof...');

    const proverAvailable = await prover.isAvailable();
    if (!proverAvailable) {
      return {
        success: false,
        error: 'Prover service is not available',
      };
    }

    // Mark both genesis and funding UTXOs as burned BEFORE calling prover
    // The Charms prover caches requests by UTXO - once sent, they can't be reused
    // even if the transaction fails or user cancels signing
    const fundingUtxoId = `${fundingUtxo.txid}:${fundingUtxo.vout}`;
    if (storage.addBurnedUtxo) {
      storage.addBurnedUtxo(genesisUtxo);
      storage.addBurnedUtxo(fundingUtxoId);
      logger.info(`Marked UTXOs as burned before prover call: genesis=${genesisUtxo}, funding=${fundingUtxoId}`);
    }

    // Convert compressed pubkey (33 bytes) to x-only pubkey (32 bytes) for Taproot
    // Compressed pubkeys start with 02 or 03, x-only removes this prefix
    let signingPubkey: string | undefined;
    if (input.pubkey && input.pubkey.length === 66) {
      // Remove the 02/03 prefix to get x-only pubkey
      signingPubkey = input.pubkey.slice(2);
      logger.info('Converted compressed pubkey to x-only for Taproot:', {
        compressedPubkey: input.pubkey.substring(0, 10) + '...',
        xOnlyPubkey: signingPubkey.substring(0, 10) + '...',
      });
    } else if (input.pubkey && input.pubkey.length === 64) {
      // Already x-only format
      signingPubkey = input.pubkey;
      logger.info('Pubkey already in x-only format');
    }

    const proofResult = await prover.prove({
      spellYaml,
      prevTxs: [genesisPrevTxHex], // prev_txs for the spell input (genesis UTXO)
      fundingUtxo: { txid: fundingUtxo.txid, vout: fundingUtxo.vout },
      fundingUtxoValue: fundingUtxo.value,
      changeAddress: input.address,
      feeRate: 2.0,
      signingPubkey, // Pass x-only pubkey for Taproot commit address derivation
    });
    
    if (!proofResult.success || !proofResult.spellTx) {
      let errorMsg = `Proof generation failed: ${proofResult.error || 'Unknown error'}`;
      
      // Check for duplicate UTXO error - this means the prover has cached these UTXOs
      if (proofResult.error?.includes('duplicate funding UTXO')) {
        errorMsg = 'These UTXOs have already been used in a previous prover request. ' +
          'The Charms prover caches requests for ~24 hours. ' +
          'Please wait for more UTXOs or try again later.';
      }
      
      logger.error('Mint badge proof generation failed:', {
        error: proofResult.error,
        spellYaml: spellYaml.substring(0, 500), // Log first 500 chars of spell
        genesisUtxo,
        fundingUtxo,
        changeAddress: input.address,
      });
      
      return {
        success: false,
        error: errorMsg,
      };
    }
    
    // ========================================================================
    // STEP 9: Sign and Broadcast transactions
    // ========================================================================
    // The Charms prover returns UNSIGNED transactions that must be signed
    // by the wallet before broadcasting.
    // See: https://docs.charms.dev/guides/wallet-integration/transactions/signing/
    // ========================================================================
    progress('Preparing transactions for signing...');

    let commitTxid: string | undefined;
    let spellTxid: string;

    // Validate transactions before processing
    logger.info('Proof result transactions:', {
      hasCommitTx: !!proofResult.commitTx,
      commitTxLength: proofResult.commitTx?.length || 0,
      hasSpellTx: !!proofResult.spellTx,
      spellTxLength: proofResult.spellTx?.length || 0,
    });

    if (proofResult.isMock) {
      // Mock mode: Skip signing and broadcast, generate fake txids
      progress('Mock mode: Simulating broadcast...');
      commitTxid = proofResult.commitTx ? '0000000000000000000000000000000000000000000000000000000000000000' : undefined;
      spellTxid = '1111111111111111111111111111111111111111111111111111111111111111';
      progress(`Mock TX: ${spellTxid.slice(0, 8)}...`);
    } else {
      // ========================================================================
      // SEED PHRASE SIGNING: Use seed phrase-derived Taproot keys
      // ========================================================================
      // This approach uses BIP-86 Taproot key derivation:
      // 1. Store seed phrase locally (user imports it)
      // 2. Derive Taproot keys using BIP-86 path
      // 3. Find which derived address matches each UTXO script
      // 4. Sign with the corresponding tweaked private key
      // ========================================================================
      
      // Check if user has imported a seed phrase
      if (!hasSeedPhrase()) {
        return {
          success: false,
          error: 'No seed phrase found. Please import your seed phrase in Settings to enable transaction signing.',
        };
      }
      
      const isTestnet = network !== 'mainnet';
      
      // STEP 9a: Sign and broadcast commit transaction
      if (proofResult.commitTx && proofResult.commitTx.length > 0) {
        // Validate it looks like a valid hex transaction
        if (!/^[0-9a-fA-F]+$/.test(proofResult.commitTx)) {
          return {
            success: false,
            error: `Invalid commit transaction format (not hex): ${proofResult.commitTx.substring(0, 50)}...`,
          };
        }
        
        progress('Signing commit transaction...');
        
        try {
          // The commit transaction spends the funding UTXO
          // We need the funding transaction hex to derive the correct signing key
          const fundingTxHex = await bitcoin.fetchTransaction(fundingUtxo.txid, network);
          
          const commitResult = await signCommitTransaction(
            proofResult.commitTx,
            fundingTxHex,
            isTestnet
          );
          
          logger.info('Commit transaction signed:', {
            txid: commitResult.txid,
            signedHexLength: commitResult.signedHex.length,
          });
          
          // Broadcast the signed commit transaction
          progress('Broadcasting commit transaction...');
          commitTxid = await bitcoin.broadcast(commitResult.signedHex, network);
          progress(`Commit TX: ${commitTxid.slice(0, 8)}...`);
          
        } catch (signError) {
          const errorMsg = signError instanceof Error ? signError.message : String(signError);
          logger.error('Failed to sign commit transaction:', {
            error: errorMsg,
            fundingUtxo,
          });
          return {
            success: false,
            error: `Failed to sign commit transaction: ${errorMsg}`,
          };
        }

        // CRITICAL: Add delay to ensure commit TX propagates before spell TX
        progress('Waiting for commit TX to propagate...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // STEP 9b: Sign and broadcast spell transaction
      if (!proofResult.spellTx || proofResult.spellTx.length === 0) {
        return {
          success: false,
          error: 'Prover returned empty spell transaction',
        };
      }
      
      if (!/^[0-9a-fA-F]+$/.test(proofResult.spellTx)) {
        return {
          success: false,
          error: `Invalid spell transaction format (not hex): ${proofResult.spellTx.substring(0, 50)}...`,
        };
      }
      
      progress('Signing spell transaction...');
      
      try {
        // Get the signed commit transaction hex
        const signedCommitTxHex = await bitcoin.fetchTransaction(commitTxid!, network);
        
        // Collect all previous transactions that the spell TX might spend
        // This includes genesis UTXO and funding UTXO transactions
        const prevTxsHex: string[] = [];
        
        // Add genesis TX
        const genesisTxHex = await bitcoin.fetchTransaction(genesisUtxoInfo.txid, network);
        prevTxsHex.push(genesisTxHex);
        
        // Add funding TX if different from genesis
        if (fundingUtxo.txid !== genesisUtxoInfo.txid) {
          const fundingTxHex = await bitcoin.fetchTransaction(fundingUtxo.txid, network);
          prevTxsHex.push(fundingTxHex);
        }
        
        logger.info('Passing prev TXs to spell signing:', {
          count: prevTxsHex.length,
          genesisTxid: genesisUtxoInfo.txid,
          fundingTxid: fundingUtxo.txid,
        });
        
        const spellResult = await signSpellTransaction(
          proofResult.spellTx,
          signedCommitTxHex,
          prevTxsHex,
          isTestnet
        );
        
        logger.info('Spell transaction signed:', {
          txid: spellResult.txid,
          signedHexLength: spellResult.signedHex.length,
        });
        
        // Broadcast the signed spell transaction
        progress('Broadcasting spell transaction...');
        spellTxid = await bitcoin.broadcast(spellResult.signedHex, network);
        progress(`Spell TX: ${spellTxid.slice(0, 8)}...`);
        
      } catch (signError) {
        const errorMsg = signError instanceof Error ? signError.message : String(signError);
        logger.error('Failed to sign spell transaction:', {
          error: errorMsg,
          stack: signError instanceof Error ? signError.stack : undefined,
        });
        return {
          success: false,
          error: `Failed to sign spell transaction: ${errorMsg}`,
        };
      }
    }
    
    // ========================================================================
    // STEP 10: Add UTXO info to badge and persist to storage
    // ========================================================================
    progress('Finalizing badge...');
    
    // Store the UTXO where this badge lives (spell tx output 0)
    newBadge.utxo = {
      txid: spellTxid,
      vout: 0, // Badge is always at output 0 in spell tx
      value: CONSTANTS.DUST_LIMIT_SATS, // Store the actual value for localStorage persistence
    };
    
    // Note: Badge persistence is handled by the calling code (useWallet hook)
    
    // ========================================================================
    // SUCCESS
    // ========================================================================
    progress('Badge minted successfully!');
    
    return {
      success: true,
      data: {
        badge: newBadge,
        txid: spellTxid,
        commitTxid,
      },
    };
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: message,
    };
  }
}
