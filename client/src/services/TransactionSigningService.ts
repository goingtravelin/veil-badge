/**
 * Transaction Signing Service - Signs Charms commit and spell transactions
 * 
 * This implements signing using seed phrase-derived Taproot keys
 * to sign both commit and spell transactions.
 */

import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from '@bitcoinerlab/secp256k1';
import {
  findAddressIndexByScript,
  getUtxoValueFromTxHex,
  getSeedPhrase,
  TaprootKeys,
} from './TaprootKeyService';
import { createLogger } from '../utils/logger';

const logger = createLogger('TransactionSigningService');

// Initialize ECC library
bitcoin.initEccLib(ecc);

export interface SignedTransactionResult {
  success: boolean;
  txid: string;
  signedHex: string;
}

/**
 * Sign a commit transaction using derived Taproot keys
 * 
 * The commit transaction spends a funding UTXO (from a previous "mining" or funding tx)
 * and creates the commit output that will be spent by the spell transaction.
 * 
 * @param unsignedTxHex - The unsigned commit transaction from the prover
 * @param fundingTxHex - The funding transaction that created the input UTXO
 * @param isTestnet - Whether to use testnet derivation paths
 */
export async function signCommitTransaction(
  unsignedTxHex: string,
  fundingTxHex: string,
  isTestnet: boolean = true
): Promise<SignedTransactionResult> {
  logger.info('Signing commit transaction...');
  
  const seedPhrase = getSeedPhrase();
  if (!seedPhrase) {
    throw new Error('Seed phrase not found. Please import your seed phrase first.');
  }
  
  try {
    // Parse the unsigned transaction
    const tx = bitcoin.Transaction.fromHex(unsignedTxHex);
    const input = tx.ins[0];
    const inputVout = input.index;
    
    // Get UTXO value from funding transaction
    const utxoValue = getUtxoValueFromTxHex(fundingTxHex, inputVout);
    logger.debug('Funding UTXO value:', utxoValue);
    
    // Parse funding transaction to get the output script
    const fundingTx = bitcoin.Transaction.fromHex(fundingTxHex);
    const targetOutput = fundingTx.outs[inputVout];
    const targetScriptHex = targetOutput.script.toString('hex');
    
    // Find the address index that matches this script
    const keys = await findAddressIndexByScript(seedPhrase, targetScriptHex, isTestnet);
    if (!keys) {
      throw new Error(
        `Could not find matching address for funding UTXO script. ` +
        `Make sure you imported the correct seed phrase that controls this address.`
      );
    }
    
    logger.info('Found matching key at index:', keys.index, 'address:', keys.address);
    
    // Prepare transaction for signing
    const signTx = bitcoin.Transaction.fromHex(unsignedTxHex);
    signTx.version = 2; // Taproot requires version 2
    
    // Generate signature hash for Taproot key-path spending
    const sighash = signTx.hashForWitnessV1(
      0, // Input index
      [keys.p2tr.output!], // Previous output script
      [utxoValue], // Previous output value
      bitcoin.Transaction.SIGHASH_DEFAULT // Sighash type (0 for default)
    );
    
    // Create Schnorr signature
    const signature = Buffer.from(ecc.signSchnorr(sighash, keys.tweakedPrivateKey));
    
    // Attach signature as witness
    signTx.ins[0].witness = [signature];
    
    const signedTxHex = signTx.toHex();
    const txid = signTx.getId();
    
    logger.info('Commit transaction signed successfully:', txid);
    
    return {
      success: true,
      txid,
      signedHex: signedTxHex,
    };
  } catch (error) {
    logger.error('Error signing commit transaction:', error);
    throw error;
  }
}

/**
 * Sign a spell transaction using derived Taproot keys
 * 
 * The spell transaction has multiple inputs:
 * - One input spends the commit output (pre-signed by prover per Charms docs)
 * - Other inputs spend UTXOs (genesis UTXO, etc.) that we need to sign
 * 
 * Per Charms docs: "the last input already includes the valid witness"
 * 
 * @param spellTxHex - The unsigned spell transaction from the prover
 * @param signedCommitTxHex - The signed commit transaction (to get its output)
 * @param prevTxsHex - Array of previous transaction hex strings for other inputs
 * @param isTestnet - Whether to use testnet derivation paths
 */
export async function signSpellTransaction(
  spellTxHex: string,
  signedCommitTxHex: string,
  prevTxsHex: string[] = [],
  isTestnet: boolean = true
): Promise<SignedTransactionResult> {
  logger.info('Signing spell transaction...');
  
  const seedPhrase = getSeedPhrase();
  if (!seedPhrase) {
    throw new Error('Seed phrase not found. Please import your seed phrase first.');
  }
  
  try {
    // Parse transactions
    const spellTx = bitcoin.Transaction.fromHex(spellTxHex);
    const commitTx = bitcoin.Transaction.fromHex(signedCommitTxHex);
    const commitTxId = commitTx.getId();
    
    spellTx.version = 2; // Taproot requires version 2
    
    logger.debug('Spell TX has', spellTx.ins.length, 'inputs');
    logger.debug('Commit TX ID:', commitTxId);
    
    // Log witness data for each input to debug
    for (let i = 0; i < spellTx.ins.length; i++) {
      const input = spellTx.ins[i];
      logger.debug(`Input ${i} witness:`, {
        hasWitness: !!input.witness,
        witnessLength: input.witness?.length || 0,
        witnessItems: input.witness?.map(w => w.length + ' bytes') || [],
      });
    }
    
    // Collect previous output scripts and values for sighash computation
    const prevOutScripts: Buffer[] = [];
    const values: number[] = [];
    const signData: Map<number, { keys: TaprootKeys; isCommitInput: boolean }> = new Map();
    
    // Process each input
    for (let i = 0; i < spellTx.ins.length; i++) {
      const input = spellTx.ins[i];
      const inputTxid = Buffer.from(input.hash).reverse().toString('hex');
      const inputVout = input.index;
      
      logger.debug(`Input ${i}: ${inputTxid}:${inputVout}`);
      
      if (inputTxid === commitTxId) {
        // This input spends the commit output
        const commitOutput = commitTx.outs[inputVout];
        const script = commitOutput.script;
        const value = commitOutput.value;
        
        logger.debug(`Input ${i} spends commit output, value:`, value);
        logger.debug(`Commit output script:`, script.toString('hex'));
        
        // Check if this input already has a witness (prover may have signed it)
        // Per Charms docs: "the last input already includes the valid witness"
        const hasValidWitness = input.witness && input.witness.length > 0 && 
          input.witness.some(w => w.length > 0);
        
        if (hasValidWitness) {
          logger.info(`Input ${i} (commit output) already has witness with ${input.witness.length} items - prover signed it`);
          prevOutScripts.push(script);
          values.push(value);
          // Don't add to signData - already signed
          continue;
        }
        
        logger.info(`Input ${i} (commit output) has no valid witness - need to find keys`);
        logger.info(`This may indicate a problem - per Charms docs, prover should sign the commit input`);
        
        // Find keys for commit output
        const keys = await findAddressIndexByScript(
          seedPhrase,
          script.toString('hex'),
          isTestnet
        );
        
        if (!keys) {
          throw new Error(
            `Could not find keys for commit output at input ${i}. ` +
            `The commit output address may not be derived from your seed phrase.`
          );
        }
        
        prevOutScripts.push(script);
        values.push(value);
        signData.set(i, { keys, isCommitInput: true });
        
      } else {
        // This input spends another UTXO (genesis or funding)
        // We need the previous transaction to get the script and value
        
        // Check if this input already has a witness
        const hasExistingWitness = input.witness && input.witness.length > 0 &&
          input.witness.some(w => w.length > 0);
        
        if (hasExistingWitness) {
          logger.info(`Input ${i} already has witness - skipping signing`);
        }
        
        // Try to find the prev tx from provided transactions
        let prevTx: bitcoin.Transaction | null = null;
        
        for (const txHex of prevTxsHex) {
          const tx = bitcoin.Transaction.fromHex(txHex);
          if (tx.getId() === inputTxid) {
            prevTx = tx;
            break;
          }
        }
        
        if (!prevTx) {
          // Log which transactions we have for debugging
          const availableTxids = prevTxsHex.map(hex => {
            try {
              return bitcoin.Transaction.fromHex(hex).getId();
            } catch {
              return 'invalid';
            }
          });
          logger.error(`Previous TX not found for input ${i}`, {
            lookingFor: inputTxid,
            available: availableTxids,
          });
          throw new Error(
            `Previous transaction not found for input ${i} (${inputTxid}). ` +
            `Available: ${availableTxids.join(', ')}`
          );
        }
        
        const output = prevTx.outs[inputVout];
        const script = output.script;
        const value = output.value;
        
        logger.debug(`Input ${i} spends external UTXO, value:`, value);
        
        // If already has witness, just add script and value for sighash
        if (hasExistingWitness) {
          prevOutScripts.push(script);
          values.push(value);
          continue; // Don't try to sign
        }
        
        // Find keys for this output
        const keys = await findAddressIndexByScript(
          seedPhrase,
          script.toString('hex'),
          isTestnet
        );
        
        if (!keys) {
          throw new Error(
            `Could not find keys for input ${i}. ` +
            `The UTXO may not be owned by your wallet.`
          );
        }
        
        prevOutScripts.push(script);
        values.push(value);
        signData.set(i, { keys, isCommitInput: false });
      }
    }
    
    // Generate signature hashes for all inputs
    const sighashes: Buffer[] = [];
    for (let i = 0; i < spellTx.ins.length; i++) {
      const sighash = spellTx.hashForWitnessV1(
        i,
        prevOutScripts,
        values,
        bitcoin.Transaction.SIGHASH_DEFAULT
      );
      sighashes.push(sighash);
    }
    
    // Sign each input that needs signing (skip pre-signed inputs)
    for (let i = 0; i < spellTx.ins.length; i++) {
      const input = spellTx.ins[i];
      
      // Skip inputs that already have valid witnesses (signed by prover)
      const hasValidWitness = input.witness && input.witness.length > 0 && 
        input.witness.some(w => w.length > 0);
      
      if (hasValidWitness) {
        logger.debug(`Skipping input ${i} - already has witness from prover`);
        continue;
      }
      
      const data = signData.get(i);
      if (!data) {
        throw new Error(`No signing data for input ${i}`);
      }
      
      const signature = Buffer.from(
        ecc.signSchnorr(sighashes[i], data.keys.tweakedPrivateKey)
      );
      
      spellTx.ins[i].witness = [signature];
      
      logger.debug(`Signed input ${i} with key at index ${data.keys.index}`);
    }
    
    const signedTxHex = spellTx.toHex();
    const txid = spellTx.getId();
    
    logger.info('Spell transaction signed successfully:', txid);
    
    return {
      success: true,
      txid,
      signedHex: signedTxHex,
    };
  } catch (error) {
    logger.error('Error signing spell transaction:', error);
    throw error;
  }
}

/**
 * Sign both commit and spell transactions in sequence
 */
export async function signCharmsTransactions(
  commitTxHex: string,
  spellTxHex: string,
  fundingTxHex: string,
  isTestnet: boolean = true
): Promise<{
  commitTx: SignedTransactionResult;
  spellTx: SignedTransactionResult;
}> {
  logger.info('Signing Charms transaction pair...');
  
  // Sign commit transaction first
  const commitResult = await signCommitTransaction(commitTxHex, fundingTxHex, isTestnet);
  
  // Sign spell transaction using the signed commit
  // Pass funding TX as array of prev TXs
  const spellResult = await signSpellTransaction(
    spellTxHex,
    commitResult.signedHex,
    [fundingTxHex], // Must be array
    isTestnet
  );
  
  return {
    commitTx: commitResult,
    spellTx: spellResult,
  };
}
