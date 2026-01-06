/**
 * TaprootKeyService - Derives Taproot keys from seed phrase
 * 
 * This service handles BIP-86 Taproot key derivation for signing Charms transactions.
 * It stores the seed phrase in localStorage and derives keys as needed.
 */

import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as bip39 from 'bip39';
import * as ecc from '@bitcoinerlab/secp256k1';
import { createLogger } from '../utils/logger';

const logger = createLogger('TaprootKeyService');

// Initialize ECC library for bitcoinjs-lib
bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

// Storage key for seed phrase
const SEED_PHRASE_KEY = 'veil_seed_phrase';

export interface TaprootKeys {
  index: number;
  derivationPath: string;
  privateKey: Buffer;
  tweakedPrivateKey: Buffer;
  internalPubkey: Buffer;
  xOnlyPubkey: Buffer;
  address: string;
  script: string;
  p2tr: bitcoin.Payment;
}

/**
 * Convert public key to x-only format for Taproot (remove 02/03 prefix)
 */
function toXOnly(pubkey: Buffer): Buffer {
  return pubkey.length === 33 ? Buffer.from(pubkey.subarray(1, 33)) : pubkey;
}

/**
 * Get the Bitcoin network based on environment
 */
function getBitcoinNetwork(isTestnet: boolean = true): bitcoin.Network {
  return isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
}

/**
 * Generate Taproot keys for a specific derivation index
 * Uses BIP-86 path: m/86'/coinType'/0'/0/index
 */
export async function generateTaprootKeysForIndex(
  seedPhrase: string,
  index: number,
  isTestnet: boolean = true
): Promise<TaprootKeys> {
  // Convert seed phrase to seed
  const seed = await bip39.mnemonicToSeed(seedPhrase);
  
  const bitcoinNetwork = getBitcoinNetwork(isTestnet);
  const root = bip32.fromSeed(seed, bitcoinNetwork);
  
  // BIP-86 derivation path (Taproot)
  // m/86'/0'/0'/0/index for mainnet
  // m/86'/1'/0'/0/index for testnet
  const coinType = isTestnet ? "1'" : "0'";
  const derivationPath = `m/86'/${coinType}/0'/0/${index}`;
  
  const child = root.derivePath(derivationPath);
  const privateKey = child.privateKey;
  
  if (!privateKey) {
    throw new Error(`Could not derive private key for index ${index}`);
  }
  
  // Get x-only pubkey for Taproot - ensure we're working with Buffers
  const publicKeyBuf = Buffer.from(child.publicKey);
  const internalPubkey = toXOnly(publicKeyBuf);
  
  // Apply Taproot tweaking
  const tweakHash = bitcoin.crypto.taggedHash('TapTweak', internalPubkey);
  const tweak = Buffer.from(tweakHash);
  
  // Negate private key if Y coordinate is odd
  const isOddY = publicKeyBuf[0] === 0x03;
  const privateKeyBuf = Buffer.from(privateKey);
  const keyToTweak = isOddY ? Buffer.from(ecc.privateNegate(privateKeyBuf)) : privateKeyBuf;
  
  const tweakedPrivateKey = ecc.privateAdd(keyToTweak, tweak);
  if (!tweakedPrivateKey) {
    throw new Error('Tweak resulted in invalid private key');
  }
  
  // Create P2TR payment
  const p2tr = bitcoin.payments.p2tr({
    internalPubkey,
    network: bitcoinNetwork,
  });
  
  if (!p2tr.address || !p2tr.output) {
    throw new Error('Failed to generate P2TR address');
  }
  
  return {
    index,
    derivationPath,
    privateKey: Buffer.from(privateKey),
    tweakedPrivateKey: Buffer.from(tweakedPrivateKey),
    internalPubkey,
    xOnlyPubkey: internalPubkey,
    address: p2tr.address,
    script: p2tr.output.toString('hex'),
    p2tr,
  };
}

/**
 * Find the address index that matches a given script
 * Searches through derivation indices until a match is found
 */
export async function findAddressIndexByScript(
  seedPhrase: string,
  targetScriptHex: string,
  isTestnet: boolean = true,
  maxIndex: number = 100
): Promise<TaprootKeys | null> {
  logger.debug('Searching for address index matching script:', targetScriptHex.substring(0, 20) + '...');
  
  for (let index = 0; index < maxIndex; index++) {
    const keys = await generateTaprootKeysForIndex(seedPhrase, index, isTestnet);
    if (keys.script === targetScriptHex) {
      logger.info(`Found matching address at index ${index}:`, keys.address);
      return keys;
    }
  }
  
  logger.warn(`No matching address found in first ${maxIndex} indices`);
  return null;
}

/**
 * Get UTXO value from a transaction hex
 */
export function getUtxoValueFromTxHex(txHex: string, vout: number): number {
  const tx = bitcoin.Transaction.fromHex(txHex);
  if (vout >= tx.outs.length) {
    throw new Error(`Output index ${vout} out of range (tx has ${tx.outs.length} outputs)`);
  }
  return tx.outs[vout].value;
}

// ============================================================================
// Seed Phrase Storage (localStorage)
// ============================================================================

/**
 * Store seed phrase in localStorage
 * WARNING: This is not secure for production - use proper key management
 */
export function storeSeedPhrase(seedPhrase: string): void {
  if (!bip39.validateMnemonic(seedPhrase)) {
    throw new Error('Invalid seed phrase');
  }
  localStorage.setItem(SEED_PHRASE_KEY, seedPhrase);
  logger.info('Seed phrase stored');
}

/**
 * Get seed phrase from localStorage
 */
export function getSeedPhrase(): string | null {
  return localStorage.getItem(SEED_PHRASE_KEY);
}

/**
 * Check if seed phrase is stored
 */
export function hasSeedPhrase(): boolean {
  return !!localStorage.getItem(SEED_PHRASE_KEY);
}

/**
 * Clear stored seed phrase
 */
export function clearSeedPhrase(): void {
  localStorage.removeItem(SEED_PHRASE_KEY);
  logger.info('Seed phrase cleared');
}

/**
 * Generate a new random seed phrase
 */
export function generateSeedPhrase(): string {
  return bip39.generateMnemonic(128); // 12 words
}

/**
 * Validate a seed phrase
 */
export function validateSeedPhrase(seedPhrase: string): boolean {
  return bip39.validateMnemonic(seedPhrase);
}

/**
 * Get the primary Taproot address (index 0) for a seed phrase
 */
export async function getPrimaryAddress(
  seedPhrase: string,
  isTestnet: boolean = true
): Promise<string> {
  const keys = await generateTaprootKeysForIndex(seedPhrase, 0, isTestnet);
  return keys.address;
}

/**
 * Sign a message using the seed phrase's primary key (Schnorr/BIP-340)
 * Returns the signature as a hex string
 */
export async function signMessageWithSeedPhrase(
  message: string,
  isTestnet: boolean = true
): Promise<string> {
  const seedPhrase = getSeedPhrase();
  if (!seedPhrase) {
    throw new Error('No seed phrase stored');
  }
  
  const keys = await generateTaprootKeysForIndex(seedPhrase, 0, isTestnet);
  
  // Hash the message (BIP-340 uses tagged hashes, but for simple messages we use SHA256)
  const messageHash = bitcoin.crypto.sha256(Buffer.from(message, 'utf8'));
  
  // Sign with Schnorr
  const signature = ecc.signSchnorr(messageHash, keys.privateKey);
  
  return Buffer.from(signature).toString('hex');
}

/**
 * Verify a Schnorr signature on a message
 */
export function verifyMessageSignature(
  message: string,
  signature: string,
  pubkey: string // x-only pubkey (32 bytes hex)
): boolean {
  try {
    const messageHash = bitcoin.crypto.sha256(Buffer.from(message, 'utf8'));
    const sigBuffer = Buffer.from(signature, 'hex');
    const pubkeyBuffer = Buffer.from(pubkey, 'hex');
    
    // If pubkey is 33 bytes (compressed), extract x-only
    const xOnlyPubkey = pubkeyBuffer.length === 33 
      ? toXOnly(pubkeyBuffer) 
      : pubkeyBuffer;
    
    return ecc.verifySchnorr(messageHash, xOnlyPubkey, sigBuffer);
  } catch (error) {
    logger.warn('Signature verification failed:', error);
    return false;
  }
}

/**
 * Extract the address from a transaction output
 * Parses the raw transaction hex and extracts the address at the given output index
 * 
 * @param txHex - The raw transaction hex
 * @param vout - The output index
 * @param isTestnet - Whether to use testnet address encoding (default true)
 * @returns The address as a string, or null if extraction fails
 */
export function getAddressFromTxOutput(
  txHex: string,
  vout: number,
  isTestnet: boolean = true
): string | null {
  try {
    const tx = bitcoin.Transaction.fromHex(txHex);
    
    if (vout >= tx.outs.length) {
      logger.warn(`Output index ${vout} out of range (tx has ${tx.outs.length} outputs)`);
      return null;
    }
    
    const output = tx.outs[vout];
    const network = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    
    // Use bitcoin.address.fromOutputScript to decode the address
    const address = bitcoin.address.fromOutputScript(output.script, network);
    
    logger.debug(`Extracted address from tx output ${vout}:`, address.slice(0, 20) + '...');
    return address;
  } catch (error) {
    logger.warn('Failed to extract address from tx output:', error);
    return null;
  }
}
