

//
// This service provides:
// - WASM module initialization and lifecycle
// - Spell extraction and verification via WASM FFI
// - Badge discovery from UTXOs
// - Transaction scanning with rate limiting

import type { VeilBadge } from '../domain/types';
import type { Network } from '../application/ports';
import { createBitcoinService } from './BitcoinService';
import { hasVeilBadge, extractVeilBadge } from '../utils/charms';
import { createLogger } from '../utils/logger';

const logger = createLogger('CharmsService');

export interface CharmsApp {
  tag: 'n' | 't';
  identity: string; // hex-encoded 32 bytes
  vk: string; // hex-encoded 32 bytes
}

export interface ParsedSpell {
  version: number;
  tx: {
    ins: string[]; // UTXO IDs: "txid:vout"
    outs: Map<number, unknown>[]; // Output index -> charm data
  };
  app_public_inputs: Map<string, unknown>; // App spec string -> public inputs
}

export interface CharmOutput {
  appSpec: string; // "tag/identity/vk"
  data: VeilBadge | number | unknown; // NFT data, token amount, or raw data
}

export interface CharmScanResult {
  hasCharms: boolean;
  charms: CharmOutput[];
  rawSpell?: ParsedSpell;
}

export interface ICharmsService {
  /**
   * Initialize the WASM module
   */
  initWasm(wasmPath?: string): Promise<void>;

  /**
   * Check if WASM is ready
   */
  isReady(): boolean;

  /**
   * Extract and verify a spell from a Bitcoin transaction
   */
  extractAndVerifySpell(txHex: string, mock?: boolean): Promise<ParsedSpell | null>;

  /**
   * Scan a UTXO for badges
   */
  scanUtxoForBadge(
    txid: string,
    vout: number,
    veilAppId: string,
    network: Network
  ): Promise<VeilBadge | null>;

  /**
   * Discover badges in multiple UTXOs with rate limiting
   */
  discoverBadgesInUtxos(
    utxos: Array<{ txid: string; vout: number }>,
    veilAppId: string,
    network: Network,
    onProgress?: (current: number, total: number) => void
  ): Promise<Array<{ txid: string; vout: number; badge: VeilBadge }>>;
}

let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;
let wasmBindings: any = null;

export class WasmCharmsService implements ICharmsService {
  async initWasm(): Promise<void> {
    if (wasmInitialized) return;

    if (wasmInitPromise) {
      return wasmInitPromise;
    }

    wasmInitPromise = (async () => {
      try {
        console.log('[CharmsService] Initializing WASM...');
        
        const base = import.meta.env.BASE_URL || '/';
        const jsPath = `${base}wasm/charms_lib.js`;
        const wasmPath = `${base}wasm/charms_lib_bg.wasm`;
        
        console.log('[CharmsService] Loading JS from:', jsPath);
        console.log('[CharmsService] Loading WASM from:', wasmPath);
        
        // Fetch and execute the JS bindings
        const jsResponse = await fetch(jsPath);
        if (!jsResponse.ok) throw new Error(`Failed to load ${jsPath}: ${jsResponse.status}`);
        const jsCode = await jsResponse.text();
        
        // Create a blob URL for the JS module
        const blob = new Blob([jsCode], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Import the module
        const module = await import(/* @vite-ignore */ blobUrl);
        URL.revokeObjectURL(blobUrl);
        
        // Fetch the WASM file
        const wasmResponse = await fetch(wasmPath);
        if (!wasmResponse.ok) throw new Error(`Failed to load ${wasmPath}: ${wasmResponse.status}`);
        const wasmBytes = await wasmResponse.arrayBuffer();
        
        // Initialize WASM with the bytes
        await module.default(wasmBytes);
        
        wasmBindings = module;
        wasmInitialized = true;
        console.log('[CharmsService] WASM initialized successfully');
      } catch (error) {
        wasmInitPromise = null;
        console.error('[CharmsService] Failed to initialize WASM:', error);
        throw error;
      }
    })();

    return wasmInitPromise;
  }

  isReady(): boolean {
    return wasmInitialized;
  }

  async extractAndVerifySpell(txHex: string, mock = false): Promise<ParsedSpell | null> {
    if (!wasmBindings) {
      throw new Error('WASM module not initialized. Call initWasm() first.');
    }

    try {
      logger.debug('[extractSpell] Attempting extraction, txHex length:', txHex.length, 'first 20 chars:', txHex.slice(0, 20));
      const result = wasmBindings.extractAndVerifySpell(txHex, mock);
      logger.debug('[extractSpell] Result:', result ? 'spell found' : 'null');
      return result as ParsedSpell;
    } catch (error) {
      // Log ALL errors for debugging
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.debug('[extractSpell] Error:', errorMsg.slice(0, 200));
      return null;
    }
  }

  async scanUtxoForBadge(
    txid: string,
    vout: number,
    veilAppId: string,
    network: Network
  ): Promise<VeilBadge | null> {
    try {
      // Fetch transaction using BitcoinService
      const bitcoinService = createBitcoinService('mempool');

      // Fetch the transaction hex
      const txHex = await bitcoinService.fetchTransaction(txid, network);
      logger.debug(`[scanUtxo] Scanning ${txid.slice(0,8)}:${vout}`);

      const spell = await this.extractAndVerifySpell(txHex, false);
      if (!spell) {
        logger.debug(`[scanUtxo] No spell found in ${txid.slice(0,8)}`);
        return null;
      }
      
      logger.debug(`[scanUtxo] Spell found! outs=${spell.tx.outs.length}, app_public_inputs keys:`, 
        spell.app_public_inputs ? [...spell.app_public_inputs.keys()] : 'none');

      // Check if this output has a charm for our app
      const charmData = spell.tx.outs[vout];
      if (!charmData) {
        logger.debug(`[scanUtxo] No charm data at vout ${vout}`);
        return null;
      }
      
      logger.debug(`[scanUtxo] Charm data at vout ${vout}:`, charmData);

      // Verify it's a Veil badge
      if (!hasVeilBadge(spell, veilAppId)) {
        logger.debug(`[scanUtxo] hasVeilBadge returned false. Looking for veilAppId=${veilAppId}`);
        return null;
      }

      const badge = extractVeilBadge(spell, veilAppId, vout);
      logger.debug(`[scanUtxo] extractVeilBadge returned:`, badge);
      return badge;
    } catch (error) {

      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.warn('Error scanning UTXO', txid.slice(0, 8), ':', errorMsg.slice(0, 100));
      return null;
    }
  }

  async discoverBadgesInUtxos(
    utxos: Array<{ txid: string; vout: number }>,
    veilAppId: string,
    network: Network,
    onProgress?: (current: number, total: number) => void
  ): Promise<Array<{ txid: string; vout: number; badge: VeilBadge }>> {
    logger.debug(`[discoverBadges] Starting discovery with ${utxos.length} UTXOs, veilAppId=${veilAppId}, network=${network}`);
    
    const results: Array<{ txid: string; vout: number; badge: VeilBadge }> = [];

    const BATCH_SIZE = 10;

    const RATE_LIMIT_MS = 100;

    for (let i = 0; i < utxos.length; i += BATCH_SIZE) {
      const batch = utxos.slice(i, i + BATCH_SIZE);

      // Process batch in parallel
      const batchResults = await Promise.all(
        batch.map(async (utxo) => {
          const badge = await this.scanUtxoForBadge(utxo.txid, utxo.vout, veilAppId, network);
          return badge ? { ...utxo, badge } : null;
        })
      );

      // Add successful results
      results.push(...batchResults.filter((r): r is { txid: string; vout: number; badge: VeilBadge } => r !== null));

      // Report progress
      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, utxos.length), utxos.length);
      }

      // Rate limiting between batches
      if (i + BATCH_SIZE < utxos.length) {
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
      }
    }

    return results;
  }
}

export class MockCharmsService implements ICharmsService {
  private ready = false;

  async initWasm(): Promise<void> {
    console.log('[MockCharmsService] Mock WASM initialization');
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async extractAndVerifySpell(_txHex: string, _mock?: boolean): Promise<ParsedSpell | null> {
    console.log('[MockCharmsService] Mock spell extraction');
    return null;
  }

  async scanUtxoForBadge(): Promise<VeilBadge | null> {
    console.log('[MockCharmsService] Mock UTXO scan');
    return null;
  }

  async discoverBadgesInUtxos(): Promise<Array<{ txid: string; vout: number; badge: VeilBadge }>> {
    console.log('[MockCharmsService] Mock badge discovery');
    return [];
  }
}

export function createCharmsService(mode: 'wasm' | 'mock' = 'wasm'): ICharmsService {
  if (mode === 'mock') {
    return new MockCharmsService();
  }
  return new WasmCharmsService();
}

// Default instance for convenience
export const charmsService = new WasmCharmsService();
