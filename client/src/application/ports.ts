

import { VeilBadge, PubKey, B32, BlockHeight } from '../domain/types';

export type Network = 'mainnet' | 'testnet4' | 'signet' | 'regtest';

export interface UtxoInfo {
  txid: string;
  vout: number;
  value: number;
  scriptPubKey?: string;
  badge?: VeilBadge;
}

export interface IBitcoinPort {
  fetchUtxos(address: string, network: Network): Promise<UtxoInfo[]>;
  fetchTransaction(txid: string, network: Network): Promise<string>;
  broadcast(txHex: string, network: Network): Promise<string>;
  getCurrentBlockHeight(network: Network): Promise<BlockHeight>;
}

export interface ProveParams {
  spellYaml: string;
  prevTxs: string[];
  fundingUtxo: { txid: string; vout: number };
  fundingUtxoValue: number;
  changeAddress: string;
  feeRate: number;
  signingPubkey?: string; // Optional: x-only pubkey for Taproot signing (32 bytes hex)
}

export interface ProveResult {
  success: boolean;
  commitTx?: string;
  spellTx?: string;
  error?: string;
  isMock?: boolean; // True if this is a mock proof (not for real broadcast)
}

export interface IProverPort {
  prove(params: ProveParams): Promise<ProveResult>;
  isAvailable(): Promise<boolean>;
}

export interface IWalletPort {
  connect(): Promise<{ address: string; pubkey: PubKey }>;
  disconnect(): void;
  signMessage(message: string): Promise<string>;
  signPsbt(psbtBase64: string, signInputs?: Record<string, number[]>): Promise<string>;
  getPublicKey(): Promise<PubKey>;
  isConnected(): boolean;
}

export interface ICryptoPort {
  sha256Hex(data: string): Promise<B32>;
  generateNonce(): Promise<B32>;
  generateBadgeId(utxoString: string): Promise<B32>;
}

// Minimal storage for burned UTXO tracking
export interface IStoragePort {
  getBurnedUtxos?(): { utxoId: string; burnedAt: number }[];
  addBurnedUtxo?(utxoId: string): void;
  isUtxoBurned?(utxoId: string): boolean;
}

export interface UseCaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// PROGRESS & LOGGING CALLBACKS

export type ProgressCallback = (message: string) => void;

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface ILoggerPort {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export interface UseCaseContext {
  bitcoin: IBitcoinPort;
  prover: IProverPort;
  wallet: IWalletPort;
  crypto: ICryptoPort;
  storage: IStoragePort;
  network: Network;
  onProgress?: ProgressCallback;
  logger?: ILoggerPort;
}

