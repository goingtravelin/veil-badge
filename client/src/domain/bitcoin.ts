

// Bitcoin-specific business logic and domain rules.

//
// Contains:
// - Bitcoin address validation
// - Bitcoin transaction rules
// - Bitcoin-specific constants
// - Dust limit rules
// - Fee calculation

import {
  Chain,
  Network,
  NetworkType,
  UTXO,
  AddressValidationResult,
} from './blockchain';

export const BITCOIN_DUST_LIMIT = 546; // satoshis

export const BITCOIN_BLOCK_TIME_MINUTES = 10;

export const BITCOIN_BLOCKS_PER_DAY = 144; 

export const SATOSHIS_PER_BTC = 100_000_000;

export const BITCOIN_ADDRESS_PREFIXES = {
  mainnet: {
    p2pkh: '1',
    p2sh: '3',
    bech32: 'bc1',
  },
  testnet: {
    p2pkh: ['m', 'n'],
    p2sh: '2',
    bech32: 'tb1',
  },
  regtest: {
    bech32: 'bcrt1',
  },
} as const;

export type BitcoinNetwork = 'mainnet' | 'testnet4' | 'signet' | 'regtest';

export function toBitcoinNetwork(network: Network): BitcoinNetwork {
  if (network.chain !== Chain.Bitcoin) {
    throw new Error(`Network is not Bitcoin: ${network.chain}`);
  }

  if (network.specificNetwork) {
    return network.specificNetwork as BitcoinNetwork;
  }

  switch (network.type) {
    case NetworkType.Mainnet:
      return 'mainnet';
    case NetworkType.Testnet:
      return 'testnet4';
    case NetworkType.Regtest:
      return 'regtest';
    default:
      return 'regtest';
  }
}

export function bitcoinNetworkFromString(network: BitcoinNetwork): Network {
  const typeMap: Record<BitcoinNetwork, NetworkType> = {
    mainnet: NetworkType.Mainnet,
    testnet4: NetworkType.Testnet,
    signet: NetworkType.Testnet,
    regtest: NetworkType.Regtest,
  };

  return {
    chain: Chain.Bitcoin,
    type: typeMap[network],
    specificNetwork: network,
  };
}

export enum BitcoinAddressType {
  P2PKH = 'p2pkh',     // Legacy: 1...
  P2SH = 'p2sh',       // Script: 3...
  P2WPKH = 'p2wpkh',   // Native SegWit: bc1q...
  P2TR = 'p2tr',       // Taproot: bc1p...
}

export function validateBitcoinAddress(
  address: string,
  network: BitcoinNetwork = 'mainnet'
): AddressValidationResult {
  if (!address || address.length === 0) {
    return {
      valid: false,
      error: 'Address cannot be empty',
    };
  }

  const networkKey = (network === 'testnet4' || network === 'signet') ? 'testnet' : network;
  const prefixes = BITCOIN_ADDRESS_PREFIXES[networkKey];

  if ('bech32' in prefixes && prefixes.bech32 && address.startsWith(prefixes.bech32)) {

    if (address !== address.toLowerCase()) {
      return {
        valid: false,
        error: 'Bech32 addresses must be lowercase',
      };
    }

    const validLengths = [42, 62];
    if (!validLengths.includes(address.length)) {
      return {
        valid: false,
        error: `Invalid bech32 address length: ${address.length}`,
      };
    }

    return {
      valid: true,
      chain: Chain.Bitcoin,
      networkType: network === 'mainnet' ? NetworkType.Mainnet : NetworkType.Testnet,
    };
  }

  if ('p2pkh' in prefixes) {
    if (typeof prefixes.p2pkh === 'string') {
      if (address.startsWith(prefixes.p2pkh)) {
        return validateLegacyAddress(address, network);
      }
    } else if (Array.isArray(prefixes.p2pkh)) {
      if (prefixes.p2pkh.some((p: string) => address.startsWith(p))) {
        return validateLegacyAddress(address, network);
      }
    }
  }

  if ('p2sh' in prefixes && prefixes.p2sh && address.startsWith(prefixes.p2sh)) {
    return validateLegacyAddress(address, network);
  }

  return {
    valid: false,
    error: `Address does not match any known Bitcoin format for ${network}`,
  };
}

function validateLegacyAddress(
  address: string,
  network: BitcoinNetwork
): AddressValidationResult {

  if (address.length < 26 || address.length > 35) {
    return {
      valid: false,
      error: `Invalid legacy address length: ${address.length}`,
    };
  }

  if (!/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(address)) {
    return {
      valid: false,
      error: 'Address contains invalid base58 characters',
    };
  }

  return {
    valid: true,
    chain: Chain.Bitcoin,
    networkType: network === 'mainnet' ? NetworkType.Mainnet : NetworkType.Testnet,
  };
}

export function getBitcoinAddressType(address: string): BitcoinAddressType | null {
  if (address.startsWith('bc1q') || address.startsWith('tb1q') || address.startsWith('bcrt1q')) {
    return BitcoinAddressType.P2WPKH;
  }
  if (address.startsWith('bc1p') || address.startsWith('tb1p') || address.startsWith('bcrt1p')) {
    return BitcoinAddressType.P2TR;
  }
  if (address.startsWith('1') || address.startsWith('m') || address.startsWith('n')) {
    return BitcoinAddressType.P2PKH;
  }
  if (address.startsWith('3') || address.startsWith('2')) {
    return BitcoinAddressType.P2SH;
  }
  return null;
}

export function isDust(sats: number): boolean {
  return sats < BITCOIN_DUST_LIMIT;
}

export function isSpendable(utxo: UTXO): boolean {
  return utxo.value >= BITCOIN_DUST_LIMIT;
}

export function filterSpendableUtxos(utxos: UTXO[]): UTXO[] {
  return utxos.filter(isSpendable);
}

export function estimateTransactionSize(
  inputCount: number,
  outputCount: number,
  useSegwit: boolean = true
): number {
  const baseSize = 10;
  const inputSize = useSegwit ? 68 : 148;
  const outputSize = useSegwit ? 31 : 34;

  return baseSize + (inputCount * inputSize) + (outputCount * outputSize);
}

export function calculateFee(sizeVbytes: number, feeRate: number): number {
  return Math.ceil(sizeVbytes * feeRate);
}

export function estimateFee(
  inputCount: number,
  outputCount: number,
  feeRate: number,
  useSegwit: boolean = true
): number {
  const size = estimateTransactionSize(inputCount, outputCount, useSegwit);
  return calculateFee(size, feeRate);
}

export function blocksToDays(blocks: number): number {
  return blocks / BITCOIN_BLOCKS_PER_DAY;
}

export function daysToBlocks(days: number): number {
  return Math.round(days * BITCOIN_BLOCKS_PER_DAY);
}

export function blocksToHours(blocks: number): number {
  return (blocks * BITCOIN_BLOCK_TIME_MINUTES) / 60;
}

export function hoursToBlocks(hours: number): number {
  return Math.round((hours * 60) / BITCOIN_BLOCK_TIME_MINUTES);
}

export function btcToSats(btc: number): number {
  return Math.round(btc * SATOSHIS_PER_BTC);
}

export function satsToBtc(sats: number): number {
  return sats / SATOSHIS_PER_BTC;
}

export function formatBtc(sats: number, decimals: number = 8): string {
  return satsToBtc(sats).toFixed(decimals);
}

export const MIN_FUNDING_SATS = 2000;

/**
 * Select a funding UTXO, avoiding burned UTXOs (those already sent to prover).
 * The Charms prover caches requests by funding UTXO - once used, they can't be reused
 * even if the transaction was never broadcast.
 * 
 * @param utxos - Available UTXOs
 * @param excludeUtxoId - Specific UTXO ID to exclude (e.g., genesis UTXO)
 * @param minValue - Minimum value in satoshis
 * @param burnedUtxoIds - UTXOs that have been sent to prover and should be avoided
 */
export function selectFundingUtxo(
  utxos: UTXO[],
  excludeUtxoId?: string,
  minValue: number = MIN_FUNDING_SATS,
  burnedUtxoIds?: string[]
): UTXO | null {
  // Filter qualifying UTXOs
  const qualifying = utxos.filter(utxo => {
    const utxoId = `${utxo.txid}:${utxo.vout}`;
    
    // Must meet minimum value
    if (utxo.value < minValue) return false;

    // Must not be excluded
    if (excludeUtxoId && utxoId === excludeUtxoId) return false;

    // Must not be burned (already sent to prover)
    if (burnedUtxoIds && burnedUtxoIds.includes(utxoId)) return false;

    return true;
  });

  // No qualifying UTXOs
  if (qualifying.length === 0) return null;

  return qualifying.reduce((smallest, current) =>
    current.value < smallest.value ? current : smallest
  );
}

export function selectUtxosForValue(
  utxos: UTXO[],
  targetValue: number,
  excludeUtxoIds?: string[]
): UTXO[] | null {

  const available = utxos
    .filter(utxo => {
      if (utxo.value < BITCOIN_DUST_LIMIT) return false;
      if (excludeUtxoIds) {
        const id = `${utxo.txid}:${utxo.vout}`;
        if (excludeUtxoIds.includes(id)) return false;
      }
      return true;
    })
    .sort((a, b) => b.value - a.value);

  const selected: UTXO[] = [];
  let total = 0;

  for (const utxo of available) {
    selected.push(utxo);
    total += utxo.value;

    // Estimate fee for current number of inputs
    const estimatedFee = estimateFee(selected.length, 2, 1); // 2 outputs, 1 sat/vbyte

    if (total >= targetValue + estimatedFee) {
      return selected;
    }
  }

  // Insufficient funds
  return null;
}
