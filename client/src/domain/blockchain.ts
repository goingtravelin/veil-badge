

//

export enum Chain {
  Bitcoin = 'bitcoin',
  Cardano = 'cardano',
}

export enum NetworkType {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  Regtest = 'regtest',
}

export interface Network {
  chain: Chain;
  type: NetworkType;

  /** Chain-specific network identifier (e.g., "testnet4" for Bitcoin) */
  specificNetwork?: string;
}

export interface UTXO {
  /** Transaction ID that created this output */
  txid: string;

  /** Output index within the transaction (0-based) */
  vout: number;

  /** Value in the smallest unit (satoshis for Bitcoin, lovelace for Cardano) */
  value: number;

  /** Spending script/address */
  scriptPubKey?: string;

  /** Optional: Metadata attached to this UTXO (e.g., Charms for Bitcoin, native assets for Cardano) */
  metadata?: unknown;
}

export function utxoId(utxo: UTXO): string {
  return `${utxo.txid}:${utxo.vout}`;
}

export function parseUtxoId(id: string): { txid: string; vout: number } | null {
  const parts = id.split(':');
  if (parts.length !== 2) return null;

  const [txid, voutStr] = parts;
  const vout = parseInt(voutStr, 10);

  if (isNaN(vout) || vout < 0) return null;

  return { txid, vout };
}

export interface TransactionInput {
  /** UTXO being spent */
  utxo: UTXO;

  /** Witness/signature data (chain-specific format) */
  witness?: unknown;
}

export interface TransactionOutput {
  /** Recipient address */
  address: string;

  /** Amount in smallest unit */
  value: number;

  /** Optional metadata for this output */
  metadata?: unknown;
}

export interface Transaction {
  /** Unique transaction identifier (hash) */
  txid: string;

  /** Inputs being spent */
  inputs: TransactionInput[];

  /** Outputs being created */
  outputs: TransactionOutput[];

  /** Fee paid to miners/validators */
  fee: number;

  /** Block height where this tx was confirmed (undefined if unconfirmed) */
  blockHeight?: number;
}

export interface TransactionValidationError {
  field: string;
  message: string;
}

export interface TransactionValidationResult {
  valid: boolean;
  errors: TransactionValidationError[];
}

export function validateTransaction(
  tx: Transaction,
  inputValues?: number[]
): TransactionValidationResult {
  const errors: TransactionValidationError[] = [];

  // Check inputs
  if (tx.inputs.length === 0) {
    errors.push({
      field: 'inputs',
      message: 'Transaction must have at least one input',
    });
  }

  // Check outputs
  if (tx.outputs.length === 0) {
    errors.push({
      field: 'outputs',
      message: 'Transaction must have at least one output',
    });
  }

  if (inputValues && inputValues.length === tx.inputs.length) {
    const totalInput = inputValues.reduce((sum, v) => sum + v, 0);
    const totalOutput = tx.outputs.reduce((sum, out) => sum + out.value, 0);

    if (totalOutput > totalInput) {
      errors.push({
        field: 'outputs',
        message: `Output value (${totalOutput}) exceeds input value (${totalInput})`,
      });
    }

    const calculatedFee = totalInput - totalOutput;
    if (calculatedFee !== tx.fee) {
      errors.push({
        field: 'fee',
        message: `Fee mismatch: calculated ${calculatedFee}, declared ${tx.fee}`,
      });
    }
  }

  if (tx.fee < 0) {
    errors.push({
      field: 'fee',
      message: 'Fee cannot be negative',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export interface Block {
  /** Block hash */
  hash: string;

  /** Height in the blockchain */
  height: number;

  /** Timestamp */
  timestamp: number;

  /** Transactions in this block */
  transactions: Transaction[];

  /** Previous block hash */
  previousBlockHash: string;
}

export interface AddressValidationResult {
  valid: boolean;
  chain?: Chain;
  networkType?: NetworkType;
  error?: string;
}

export function validateAddress(
  address: string,
  expectedChain?: Chain
): AddressValidationResult {
  // Basic checks
  if (!address || address.length === 0) {
    return {
      valid: false,
      error: 'Address cannot be empty',
    };
  }

  return {
    valid: true,
    chain: expectedChain,
  };
}

export interface FeeRate {
  /** Rate value */
  rate: number;

  /** Unit (e.g., "sat/vbyte", "lovelace/byte") */
  unit: string;
}

export enum FeePriority {
  /** Low priority - may take hours/days */
  Low = 'low',

  /** Medium priority - should confirm in a few blocks */
  Medium = 'medium',

  /** High priority - fast confirmation */
  High = 'high',

  /** Custom rate */
  Custom = 'custom',
}

export function bitcoinMainnet(): Network {
  return {
    chain: Chain.Bitcoin,
    type: NetworkType.Mainnet,
    specificNetwork: 'mainnet',
  };
}

export function bitcoinTestnet4(): Network {
  return {
    chain: Chain.Bitcoin,
    type: NetworkType.Testnet,
    specificNetwork: 'testnet4',
  };
}

export function bitcoinRegtest(): Network {
  return {
    chain: Chain.Bitcoin,
    type: NetworkType.Regtest,
    specificNetwork: 'regtest',
  };
}

export function isTestNetwork(network: Network): boolean {
  return network.type === NetworkType.Testnet || network.type === NetworkType.Regtest;
}

export function isBitcoinNetwork(network: Network): boolean {
  return network.chain === Chain.Bitcoin;
}

export function isCardanoNetwork(network: Network): boolean {
  return network.chain === Chain.Cardano;
}
