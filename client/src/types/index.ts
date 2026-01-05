// Veil Protocol - Frontend Types

import type { PubKey, VeilBadge } from '../domain/types';

// Re-export ALL domain types and constants
export type {
  B32,
  PubKey,
  Signature,
  BlockHeight,
  Satoshis,
  Vouch,
  RiskFlags,
  VeilBadge,
  Severity,
  Outcome,
  TxType,
  Action,
  BackingAggregates,
  ValidationResult,
} from '../domain/types';

// Re-export Spell and Charm domain types
export type {
  Spell,
  SpellInput,
  SpellOutput,
  SpellValidationError,
  SpellValidationResult,
} from '../domain/spell';

export type {
  Charm,
  CharmApp,
  CharmTag,
  CharmValidationError,
  CharmValidationResult,
} from '../domain/charm';

export {
  Chain,
  NetworkType,
  FeePriority,
} from '../domain/blockchain';

export type {

  UTXO,
  TransactionInput,
  TransactionOutput,
  Transaction,
  Block,
  FeeRate,
  AddressValidationResult,
  TransactionValidationError,
  TransactionValidationResult,
} from '../domain/blockchain';

export type { Network as BlockchainNetwork } from '../domain/blockchain';

// Re-export Bitcoin domain types
export {
  BitcoinAddressType,
  BITCOIN_DUST_LIMIT,
  BITCOIN_BLOCKS_PER_DAY,
  SATOSHIS_PER_BTC,
} from '../domain/bitcoin';

export type {
  BitcoinNetwork,
} from '../domain/bitcoin';

export {
  CONSTANTS,
  DUST_LIMIT,
  MIN_LOCK_BLOCKS,
  createNewBadge,
  createEmptyBackingAggregates,
  createEmptyRiskFlags,
} from '../domain/types';

// Re-export individual constants for convenience
import { CONSTANTS } from '../domain/types';
export const {
  WINDOW_SIZE_BLOCKS,
  MIN_VOUCH_LOCK_BLOCKS,
  NEW_BADGE_THRESHOLD_BLOCKS,
  MIN_TRUST_TO_VOUCH,
  MIN_TRUST_TO_RECEIVE_VOUCH,
  ISOLATION_THRESHOLD,
  TOO_CLEAN_TX_THRESHOLD,
  ACCELERATION_THRESHOLD,
  EXTRACTION_MULTIPLIER,
  ERRATIC_CV_THRESHOLD,
  RISK_WEIGHTS,
  SEVERITY_DAMAGE,
  DUST_LIMIT_SATS,
} = CONSTANTS;

export type NetworkString = 'mainnet' | 'testnet4' | 'signet' | 'regtest';

export type Network = NetworkString;

export interface WalletState {
  connected: boolean;
  address: string | null;
  pubkey: PubKey | null;
  network: NetworkString;
  utxos: UtxoInfo[];
}

export interface UtxoInfo {
  txid: string;
  vout: number;
  value: number;
  scriptPubKey?: string;
  badge?: VeilBadge;
}

/** Badge with its associated UTXO - the primary type for working with badges */
export interface BadgeWithUtxo {
  badge: VeilBadge;
  utxo: UtxoInfo;
}
