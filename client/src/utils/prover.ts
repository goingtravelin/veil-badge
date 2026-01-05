
// PROVER UTILITIES - Pure Helpers

// Pure functions for Charms prover operations.

//

// use ProverService from services/ProverService.ts

import { Spell, Network } from '../types';

export interface ChainTransaction {
  bitcoin?: string;
  cardano?: string;
}

export interface ProveRequest {
  /** The Spell JSON object defining the charm operation */
  spell: SpellJson;
  /** Map of app VK (hex 32 bytes) to app binary (base64 RISC-V ELF) - empty for basic transfers */
  binaries: Record<string, string>;
  /** Array of previous transactions that created the UTXOs being spent */
  prev_txs: ChainTransaction[];
  /** UTXO to use for funding (txid:vout format) */
  funding_utxo: string;
  /** Value of the funding UTXO in satoshis */
  funding_utxo_value: number;
  /** Address to send remaining satoshis from funding UTXO */
  change_address: string;
  /** Fee rate in satoshis per vbyte */
  fee_rate: number;
  /** Blockchain to use: "bitcoin" or "cardano" (lowercase) */
  chain: "bitcoin" | "cardano";
  /** Collateral UTXO for Cardano (optional, required for Cardano only) */
  collateral_utxo?: string;
}

export interface SpellJson {
  version: number;
  apps: Record<string, string>;
  ins: Array<{
    utxo_id: string;
    charms?: Record<string, unknown>;
  }>;
  outs: Array<{
    address: string;
    sats?: number;
    charms?: Record<string, unknown>;
  }>;
  public_args?: Record<string, unknown>;
  private_args?: Record<string, unknown>;
}

export interface ProveResult {
  success: boolean;
  /** Hex-encoded commit transaction (first of package) */
  commitTx?: string;
  /** Hex-encoded spell transaction (second of package) */
  spellTx?: string;
  /** Error message if failed */
  error?: string;
}

export interface ProverConfig {
  endpoint: string;
  timeout: number;
  retries: number;
  mock?: boolean; // Enable mock mode for development (accepts placeholder app IDs)
}

// Fallback prover endpoints in order of preference
// Note: Only include endpoints with compatible API formats
const PROVER_FALLBACKS: string[] = [
  'https://v8.charms.dev/spells/prove',      // Primary endpoint (current API)
  // v7 has incompatible API format (expects prev_txs as strings, not objects)
];

function getProverEndpoint(network: Network): string {
  const envEndpoint = import.meta.env.VITE_PROVER_ENDPOINT;

  if (envEndpoint) {
    return envEndpoint;
  }

  // Use primary endpoint from fallbacks
  const primary = PROVER_FALLBACKS[0];
  
  const defaults: Record<Network, string> = {
    mainnet: primary,
    testnet4: primary,
    signet: primary,
    regtest: 'http://localhost:17784/spells/prove', // Local prover
  };

  return defaults[network];
}

export { PROVER_FALLBACKS };

export const PROVER_ENDPOINTS: Record<Network, string> = {
  mainnet: getProverEndpoint('mainnet'),
  testnet4: getProverEndpoint('testnet4'),
  signet: getProverEndpoint('signet'),
  regtest: getProverEndpoint('regtest'),
};

export const DEFAULT_PROVER_CONFIG: ProverConfig = {
  endpoint: PROVER_ENDPOINTS.testnet4,
  timeout: 300000, // 5 minutes - ZK proofs can take significant time
  retries: 2,
  mock: false, // Use real ZK proofs with compiled app binary
};

export function serializeForJson(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') {
    // Convert to number if safe, otherwise string
    const num = Number(obj);
    if (Number.isSafeInteger(num)) {
      return num;
    }
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeForJson);
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeForJson(value);
    }
    return result;
  }

  return obj;
}

export function spellToJson(spell: Spell): SpellJson {
  const serialized = serializeForJson(spell) as Record<string, unknown>;

  return {
    version: serialized.version as number,
    apps: serialized.apps as Record<string, string>,
    ins: (serialized.ins as Array<Record<string, unknown>>).map(input => ({
      utxo_id: input.utxo_id as string,
      charms: input.charms as Record<string, unknown> | undefined,
    })),
    outs: (serialized.outs as Array<Record<string, unknown>>).map(output => ({
      address: output.address as string,
      sats: output.sats as number | undefined,
      charms: output.charms as Record<string, unknown> | undefined,
    })),
    public_args: serialized.public_args as Record<string, unknown> | undefined,
    private_args: serialized.private_args as Record<string, unknown> | undefined,
  };
}

export function createProveRequest(params: {
  spell: Spell;
  prevTxs: string[];
  fundingUtxo: { txid: string; vout: number };
  fundingUtxoValue: number;
  changeAddress: string;
  feeRate?: number;
  binaries?: Record<string, string>;
  chain?: "bitcoin" | "cardano";
}): ProveRequest {
  return {
    spell: spellToJson(params.spell),
    binaries: params.binaries || {},
    // Wrap each transaction hex in { bitcoin: "..." } format
    prev_txs: params.prevTxs.map(txHex => ({ bitcoin: txHex })),
    funding_utxo: `${params.fundingUtxo.txid}:${params.fundingUtxo.vout}`,
    funding_utxo_value: params.fundingUtxoValue,
    change_address: params.changeAddress,
    fee_rate: params.feeRate ?? 2.0,
    chain: params.chain || "bitcoin",
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateSpellLocally(spell: Spell): { valid: boolean; errors: string[] } {

  const { validateSpell } = require('../domain/spell');
  const result = validateSpell(spell);

  return {
    valid: result.valid,
    errors: result.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`),
  };
}

//

//

// - isProverAvailable() - HTTP health check

//
// Usage:
// ```typescript

//
// // Create service instance
// const prover = createProverService('remote', {
//   url: 'https://v8.charms.dev'
// });
//
// // Check availability
// const available = await prover.isAvailable();
//
// // Generate proof
// const result = await prover.prove({
//   spellYaml: JSON.stringify(spell),
//   prevTxs: ['...'],
//   fundingUtxo: 'txid:vout',
//   fundingUtxoValue: 100000,
//   changeAddress: 'tb1q...',
//   feeRate: 2.0,
// });
// ```
//
// For more details, see:

// - UTILS_CLEANUP_GUIDE.md - Migration guide

//

