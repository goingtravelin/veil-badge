

// Primitive type aliases for clarity
export type B32 = string;       
export type PubKey = string;    
export type Signature = string; 
export type BlockHeight = number;
export type Satoshis = number;

export const CONSTANTS = {

  MIN_TRUST_TO_VOUCH: 30,
  MIN_TRUST_TO_RECEIVE_VOUCH: 20,

  WINDOW_SIZE_BLOCKS: 4320,              
  MIN_VOUCH_LOCK_BLOCKS: 1008,           
  NEW_BADGE_THRESHOLD_BLOCKS: 12960,     

  ISOLATION_THRESHOLD: 20,
  TOO_CLEAN_TX_THRESHOLD: 50,
  ACCELERATION_THRESHOLD: 3.0,
  EXTRACTION_MULTIPLIER: 10,
  ERRATIC_CV_THRESHOLD: 2.0,

  RISK_WEIGHTS: {
    acceleration: 25,
    extraction: 30,
    isolated: 20,
    too_clean: 10,
    erratic: 15,
    new_badge: 15,
  } as const,

  // Severity damage values
  SEVERITY_DAMAGE: {
    Minor: 5,
    Major: 15,
    Severe: 50,
  } as const,

  // Transaction limits
  DUST_LIMIT_SATS: 546,
  MIN_FUNDING_SATS: 2000,

  // Vouch limits
  MAX_STAKE_PERCENT: 100,
  MIN_STAKE_PERCENT: 1,

  // Trust level thresholds for UI
  TRUST_LEVELS: {
    CRITICAL_MAX: 20,    
    LOW_MAX: 40,         
    MEDIUM_MAX: 60,      
    HIGH_MAX: 80,        
    
  } as const,

  // Risk level thresholds for UI
  RISK_LEVELS: {
    MINIMAL_MAX: 15,     
    LOW_MAX: 30,         
    MODERATE_MAX: 50,    
    HIGH_MAX: 75,        
    
  } as const,

  // Backing tier thresholds
  BACKING_TIERS: {
    MIN_BACKED_COUNT: 10,     // Minimum backed transactions for trusted tier
    MIN_BACKED_RATIO: 0.7,    // Minimum ratio of backed transactions (70%)
  } as const,
} as const;

// Backward compatibility aliases
export const DUST_LIMIT = CONSTANTS.DUST_LIMIT_SATS;
export const MIN_LOCK_BLOCKS = CONSTANTS.MIN_VOUCH_LOCK_BLOCKS;

export interface Vouch {
  badge_id: B32;
  stake_percent: number; 
  created_at: BlockHeight;
  unlock_at: BlockHeight;
}

export interface RiskFlags {
  acceleration: boolean;
  extraction: boolean;
  isolated: boolean;
  too_clean: boolean;
  erratic: boolean;
  new_badge: boolean;
}

export interface BackingAggregates {
  /** Count of Backed transactions */
  backed_count: number;

  /** Count of Unbacked transactions */
  unbacked_count: number;

  /** Sum of values from Backed transactions */
  backed_volume: number;

  /** Sum of values from Unbacked transactions */
  unbacked_volume: number;
}

export interface VeilBadge {

  id: B32;
  created_at: BlockHeight;
  pubkey: PubKey;
  
  // UTXO where this badge lives (optional for backwards compatibility)
  utxo?: {
    txid: string;
    vout: number;
    value?: number; // Satoshi value of the UTXO
  };

  // Transaction counts
  tx_total: number;
  tx_positive: number;
  tx_negative: number;

  volume_total: number;
  volume_sum_squares: bigint;
  window_tx_count: number;
  window_volume: number;
  window_start: BlockHeight;
  counterparty_count: number;
  
  // Backing tracking
  backing: BackingAggregates;

  // Vouch relationships
  vouches_out: Vouch[];
  vouches_in: Vouch[];

  // Computed/cached values
  cascade_damage: number;
  trust: number;
  risk: number;
  flags: RiskFlags;

  active_transactions: import('./proposal').ActiveTransaction[];
  reporting_transactions: import('./proposal').ReportingTransaction[];
  outcomes: import('./proposal').OutcomeAggregates;

  // Replay protection
  last_nonce: B32;
  last_update: BlockHeight;
}

export type Severity = 'Minor' | 'Major' | 'Severe';

export type Outcome = 'Positive' | { Negative: { severity: Severity } };

export type TxType = 'Trade' | 'Loan' | 'Service' | 'Other';

export interface TransactionRecord {
  my_badge_id: B32;
  counterparty_badge_id: B32;
  outcome: Outcome;
  value: Satoshis;
  tx_type: TxType;
  timestamp: BlockHeight;
  nonce: B32;
}

export function createTransactionRecord(
  myBadgeId: B32,
  counterpartyBadgeId: B32,
  outcome: Outcome,
  value: Satoshis,
  txType: TxType,
  timestamp: BlockHeight,
  nonce: B32
): TransactionRecord {
  return {
    my_badge_id: myBadgeId,
    counterparty_badge_id: counterpartyBadgeId,
    outcome,
    value,
    tx_type: txType,
    timestamp,
    nonce,
  };
}

export type Action =
  | { Mint: { pubkey: PubKey } }
  | { Record: { outcome: Outcome; value: number; current_block: BlockHeight } }
  | { Vouch: { target_badge_id: B32; stake_percent: number; lock_blocks: number } }
  | { ReceiveVouch: { voucher_badge_id: B32 } }
  | { Unvouch: { target_badge_id: B32 } }
  | { LoseVouch: { voucher_badge_id: B32 } }
  | { Cascade: { damage: number; severity: Severity } };

export interface RecordWitness {
  record: TransactionRecord;
  my_signature: Signature;
  counterparty_signature: Signature;
  counterparty_pubkey: PubKey;
}

export interface VouchWitness {
  vouch: Vouch;
  signature: Signature;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function createEmptyBackingAggregates(): BackingAggregates {
  return {
    backed_count: 0,
    unbacked_count: 0,
    backed_volume: 0,
    unbacked_volume: 0,
  };
}

export function createEmptyRiskFlags(): RiskFlags {
  return {
    acceleration: false,
    extraction: false,
    isolated: false,
    too_clean: false,
    erratic: false,
    new_badge: false,
  };
}

export function createNewBadge(
  id: B32,
  pubkey: PubKey,
  createdAt: BlockHeight
): VeilBadge {
  return {
    id,
    created_at: createdAt,
    pubkey,
    tx_total: 0,
    tx_positive: 0,
    tx_negative: 0,
    volume_total: 0,
    volume_sum_squares: BigInt(0),
    window_tx_count: 0,
    window_volume: 0,
    window_start: createdAt,
    counterparty_count: 0,
    backing: createEmptyBackingAggregates(),
    vouches_out: [],
    vouches_in: [],
    cascade_damage: 0,
    trust: 15,
    risk: 35,
    flags: {
      ...createEmptyRiskFlags(),
      isolated: true,
      new_badge: true,
    },
    // Transaction flow fields
    active_transactions: [],
    reporting_transactions: [],
    outcomes: {
      mutualPositive: 0,
      mutualNegative: 0,
      contestedIPositive: 0,
      contestedINegative: 0,
      timeout: 0,
      mutualTimeout: 0,
    },
    last_nonce: '0'.repeat(64),
    last_update: createdAt,
  };
}

export function validateMint(address: string, pubkey: string): ValidationResult {
  if (!address || address.length < 20) {
    return { valid: false, errors: ['Invalid address'] };
  }
  if (!pubkey || pubkey.length < 64) {
    return { valid: false, errors: ['Invalid pubkey'] };
  }
  return { valid: true, errors: [] };
}

export function validateFundingUtxo(utxo: { value: number; txid: string; vout: number }): ValidationResult {
  if (!utxo.txid || utxo.txid.length !== 64) {
    return { valid: false, errors: ['Invalid UTXO txid'] };
  }
  if (utxo.value < CONSTANTS.MIN_FUNDING_SATS) {
    return { valid: false, errors: [`UTXO value ${utxo.value} below minimum ${CONSTANTS.MIN_FUNDING_SATS}`] };
  }
  return { valid: true, errors: [] };
}
