
// PROVER SERVICE - Implements IProverPort

// Provides ZK proof generation for Charms spells.

//
// Enhanced with:
// - Retry logic with exponential backoff
// - Timeout handling with AbortController
// - Progress callbacks for long-running proofs
// - Network-based endpoint selection
// - Fallback endpoints for resilience

import { IProverPort, ProveParams, ProveResult } from '../application/ports';
import { Network } from '../types';
import { PROVER_ENDPOINTS, DEFAULT_PROVER_CONFIG, PROVER_FALLBACKS, sleep } from '../utils/prover';
import type { ProverConfig } from '../utils/prover';
import * as yaml from 'js-yaml';
import { createLogger } from '../utils/logger';

const logger = createLogger('ProverService');

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface IProverServiceExtended extends IProverPort {
  validate?(proof: string): Promise<ValidationResult>;
  getVersion?(): Promise<string>;
}

// Enhanced prove options with progress callback
export interface EnhancedProveParams extends ProveParams {
  onProgress?: (message: string) => void;
}

export class RemoteProverService implements IProverPort {
  private config: ProverConfig;
  private network: Network;

  constructor(
    network: Network = 'testnet4',
    config: Partial<ProverConfig> = {}
  ) {
    this.network = network;
    this.config = { ...DEFAULT_PROVER_CONFIG, ...config };
  }

  /**
   * Generate ZK proof with retry logic and progress tracking
   * Tries fallback endpoints if the primary endpoint has connection issues
   */
  async prove(
    params: ProveParams,
    options?: { onProgress?: (message: string) => void }
  ): Promise<ProveResult> {
    const onProgress = options?.onProgress;

    // Get list of endpoints to try (primary + fallbacks for non-local networks)
    const endpoints = this.network === 'regtest' 
      ? [PROVER_ENDPOINTS[this.network]]
      : PROVER_FALLBACKS;

    let lastError: Error | null = null;
    let currentEndpointIndex = 0;

    // Try each endpoint with retries
    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      const endpoint = endpoints[currentEndpointIndex];
      
      try {
        const endpointName = new URL(endpoint).hostname;
        onProgress?.(
          `Submitting to prover (${endpointName})${attempt > 0 ? ` - attempt ${attempt + 1}/${this.config.retries}` : ''}...`
        );

        // Setup timeout with AbortController
        const controller = new AbortController();
        const timeoutMs = this.config.timeout;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        // Progress timer for long proof generation
        let elapsed = 0;
        let aborted = false;
        const progressInterval = setInterval(() => {
          if (aborted) return;
          elapsed += 5;
          const timeoutSec = Math.floor(timeoutMs / 1000);

          if (elapsed < 30) {
            onProgress?.(`Generating ZK proof... (${elapsed}s)`);
          } else if (elapsed < 60) {
            onProgress?.(`Still generating proof... this can take 1-3 minutes (${elapsed}s)`);
          } else if (elapsed < timeoutSec) {
            onProgress?.(
              `Proof generation in progress... please wait (${elapsed}s / ${timeoutSec}s timeout)`
            );
          } else {
            onProgress?.(`Waiting for prover response... (${elapsed}s - may have timed out)`);
          }
        }, 5000);

        let response: Response;
        try {
          // Parse YAML string to JSON object
          const spellJson = yaml.load(params.spellYaml);

          let binaries: Record<string, string>;
          if (this.config.mock) {
            binaries = { '0000000000000000000000000000000000000000000000000000000000000000': '' };
          } else {
            onProgress?.('Loading app binaries...');

            // Extract all unique VKs from all apps in the spell
            const apps = (spellJson as any)?.apps;
            if (!apps || typeof apps !== 'object') {
              throw new Error('Invalid spell: missing apps section');
            }

            const vks = new Set<string>();
            for (const [key, appSpec] of Object.entries(apps)) {
              if (typeof appSpec !== 'string') {
                throw new Error(`Invalid app spec for ${key}: expected string`);
              }
              const parts = appSpec.split('/');
              if (parts.length !== 3) {
                throw new Error(`Invalid app spec format for ${key}: ${appSpec}. Expected "n/appId/vk"`);
              }
              vks.add(parts[2]);
            }

            // Load binaries for all VKs
            const { getBinariesForMultipleVks } = await import('../utils/appBinary');
            binaries = await getBinariesForMultipleVks([...vks]);
          }

          const requestBody: Record<string, any> = {
            spell: spellJson,
            binaries,
            prev_txs: params.prevTxs?.map((txHex) => ({ bitcoin: txHex })) || [],
            funding_utxo: `${params.fundingUtxo.txid}:${params.fundingUtxo.vout}`,
            funding_utxo_value: params.fundingUtxoValue,
            change_address: params.changeAddress,
            fee_rate: params.feeRate || 2.0,
            chain: 'bitcoin',
          };
          
          // If signing pubkey is provided, include it so the prover can derive
          // the commit output address from our pubkey (for web wallet compatibility)
          if (params.signingPubkey) {
            requestBody.signing_pubkey = params.signingPubkey;
            logger.info('Including signing_pubkey in prover request for web wallet compatibility');
          }

          // Log the full request for debugging
          logger.info('Sending prove request:', {
            endpoint,
            spell: JSON.stringify(spellJson, null, 2).substring(0, 1000),
            binaryVKs: Object.keys(binaries),
            binarySizes: Object.entries(binaries).map(([vk, b64]) => ({
              vk: vk.substring(0, 16) + '...',
              sizeBytes: Math.round((b64.length * 3) / 4), // Base64 to bytes
              sizeKB: Math.round((b64.length * 3) / 4 / 1024),
              // Log first/last 50 chars of base64 to verify encoding
              b64Start: b64.substring(0, 50),
              b64End: b64.substring(b64.length - 50),
            })),
            prevTxCount: params.prevTxs?.length || 0,
            fundingUtxo: requestBody.funding_utxo,
            fundingValue: requestBody.funding_utxo_value,
            changeAddress: requestBody.change_address,
            feeRate: requestBody.fee_rate,
          });

          // DEBUG: Save full request for manual curl testing
          const requestBodyStr = JSON.stringify(requestBody);
          try {
            // Remove binary from saved request to keep it small
            const debugRequest = { ...requestBody, binaries: { ...requestBody.binaries } };
            for (const vk of Object.keys(debugRequest.binaries)) {
              debugRequest.binaries[vk] = `[${requestBody.binaries[vk].length} chars base64]`;
            }
            localStorage.setItem('lastProverRequest', JSON.stringify(debugRequest, null, 2));
            logger.info('DEBUG: Full request saved to localStorage.lastProverRequest (run: copy(localStorage.lastProverRequest) in console)');
            
            // Also save the SPELL JSON separately (most useful for debugging)
            localStorage.setItem('lastProverSpell', JSON.stringify(requestBody.spell, null, 2));
            logger.info('DEBUG: Spell JSON saved to localStorage.lastProverSpell');
          } catch (e) {
            logger.info('DEBUG: Could not save request to localStorage:', e);
          }

          response = await fetch(`${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: requestBodyStr,
            signal: controller.signal,
          });

          // Debug: Log first part of binary in actual request
          const binMatch = requestBodyStr.match(/"f27666[^"]+":"([^"]{100})/);
          logger.info('Request body binary start:', binMatch?.[1] || 'not found');
        } catch (fetchErr) {
          aborted = true;
          clearInterval(progressInterval);
          clearTimeout(timeoutId);

          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
            throw new Error(`Prover request timed out after ${timeoutMs / 1000}s`);
          }
          throw fetchErr;
        }

        aborted = true;
        clearInterval(progressInterval);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Prover request failed:', {
            status: response.status,
            statusText: response.statusText,
            endpoint,
            responseBody: errorText,
            headers: Object.fromEntries(response.headers.entries()),
          });

          // Try to parse as JSON for structured errors
          let errorDetail = errorText;
          let userFriendlyMessage = '';

          try {
            const errorJson = JSON.parse(errorText);
            errorDetail = errorJson.error || errorJson.message || JSON.stringify(errorJson);

            // Check for specific error types and provide user-friendly messages
            if (errorJson.suggestion) {
              userFriendlyMessage = ` ${errorJson.suggestion}`;
            }
          } catch {
            // Keep raw text if not JSON
            // Provide user-friendly messages for common HTTP errors
            if (response.status === 502) {
              userFriendlyMessage = ' The Charms prover service appears to be down. Please try again in a few minutes.';
            } else if (response.status === 503) {
              userFriendlyMessage = ' The prover service is temporarily unavailable. Please try again shortly.';
            } else if (response.status === 504) {
              userFriendlyMessage = ' The prover service timed out. It may be experiencing heavy load.';
            }
          }

          throw new Error(
            `Prover error (${response.status} ${response.statusText}): ${errorDetail || 'No error details provided'}${userFriendlyMessage}`
          );
        }

        // Response format can be either:
        // 1. Array of hex strings: ["commit_tx_hex", "spell_tx_hex"]
        // 2. Array of chain objects: [{"bitcoin":"commit_tx_hex"}, {"bitcoin":"spell_tx_hex"}]
        const result = await response.json();

        if (!Array.isArray(result) || result.length !== 2) {
          throw new Error(
            `Invalid prover response: expected array of 2 transactions, got ${JSON.stringify(result)}`
          );
        }

        // Handle both response formats
        let commitTx: string;
        let spellTx: string;
        
        if (typeof result[0] === 'string') {
          // Format 1: Array of hex strings
          [commitTx, spellTx] = result;
        } else if (typeof result[0] === 'object' && result[0] !== null) {
          // Format 2: Array of chain objects ({"bitcoin": "hex..."} or {"cardano": "hex..."})
          commitTx = result[0].bitcoin || result[0].cardano || '';
          spellTx = result[1].bitcoin || result[1].cardano || '';
        } else {
          throw new Error(
            `Invalid prover response format: ${JSON.stringify(result)}`
          );
        }

        // Log for debugging
        logger.info('Prover response parsed:', {
          commitTxLength: commitTx?.length || 0,
          spellTxLength: spellTx?.length || 0,
          commitTxPreview: commitTx?.substring(0, 50) || 'empty',
          spellTxPreview: spellTx?.substring(0, 50) || 'empty',
        });

        if (!spellTx || spellTx.length === 0) {
          throw new Error('Prover returned empty spell transaction');
        }

        onProgress?.('Proof generated successfully!');

        return {
          success: true,
          commitTx,
          spellTx,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        
        const isConnectionError = lastError.message.includes('Failed to fetch') ||
          lastError.message.includes('ERR_CONNECTION') ||
          lastError.message.includes('NetworkError') ||
          lastError.message.includes('Network request failed');
        
        logger.error(`Prover attempt ${attempt + 1}/${this.config.retries} failed:`, {
          error: lastError.message,
          stack: lastError.stack,
          endpoint,
          attempt: attempt + 1,
          isConnectionError,
        });

        // If connection error and we have more endpoints to try, switch to next endpoint
        if (isConnectionError && currentEndpointIndex < endpoints.length - 1) {
          currentEndpointIndex++;
          const nextEndpoint = endpoints[currentEndpointIndex];
          logger.info(`Connection failed, trying fallback endpoint: ${nextEndpoint}`);
          onProgress?.(`Primary prover unavailable, trying fallback...`);
          // Don't count this as a retry, reset attempt counter for new endpoint
          attempt = -1;
          await sleep(1000);
          continue;
        }

        if (attempt < this.config.retries - 1) {
          // Check for Retry-After header on 429 responses
          let delay = Math.min(1000 * Math.pow(2, attempt), 10000);

          if (err && typeof err === 'object' && 'status' in err && err.status === 429) {
            // Extract Retry-After header if available
            const retryAfter = err && typeof err === 'object' && 'headers' in err
              ? (err as any).headers?.get?.('Retry-After')
              : null;

            if (retryAfter) {
              const retrySeconds = parseInt(retryAfter, 10);
              if (!isNaN(retrySeconds)) {
                delay = retrySeconds * 1000;
              }
            }
          }

          onProgress?.(`Prover request failed, retrying in ${delay / 1000}s...`);
          await sleep(delay);
        }
      }
    }

    // Build error message with endpoint info
    const triedEndpoints = endpoints.slice(0, currentEndpointIndex + 1).map(e => {
      try { return new URL(e).hostname; } catch { return e; }
    }).join(', ');

    return {
      success: false,
      error: `${lastError?.message || 'Unknown prover error'} (tried: ${triedEndpoints})`,
    };
  }

  async isAvailable(): Promise<boolean> {
    const endpoint = PROVER_ENDPOINTS[this.network] || this.config.endpoint;

    try {

      const response = await fetch(endpoint.replace('/spells/prove', '/ready'), {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async validate(proof: string): Promise<ValidationResult> {
    const endpoint = PROVER_ENDPOINTS[this.network] || this.config.endpoint;

    try {
      const response = await fetch(endpoint.replace('/spells/prove', '/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { valid: false, error };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getVersion(): Promise<string> {
    const endpoint = PROVER_ENDPOINTS[this.network] || this.config.endpoint;

    try {
      const response = await fetch(endpoint.replace('/spells/prove', '/version'));
      if (!response.ok) return 'unknown';
      const result = await response.json();
      return result.version ?? 'unknown';
    } catch {
      return 'unknown';
    }
  }

  // Configuration management
  getNetwork(): Network {
    return this.network;
  }

  setNetwork(network: Network): void {
    this.network = network;
  }

  getConfig(): ProverConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ProverConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export class WasmProverService implements IProverPort {
  private wasmModule: any = null;

  async initialize(): Promise<void> {
    if (this.wasmModule) return;

    try {
      // Dynamic import of the WASM module
      const wasm = await import('../../public/wasm/charms_lib.js');
      await wasm.default();
      this.wasmModule = wasm;
    } catch (error) {
      logger.error('Failed to initialize WASM prover:', error);
      throw error;
    }
  }

  async prove(params: ProveParams): Promise<ProveResult> {
    await this.initialize();

    try {
      const result = this.wasmModule.prove(
        params.spellYaml,
        params.prevTxs,
        params.fundingUtxo,
        params.fundingUtxoValue,
        params.changeAddress,
        params.feeRate
      );

      return {
        success: true,
        commitTx: result.commit_tx,
        spellTx: result.spell_tx,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'WASM proving failed',
      };
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.initialize();
      return true;
    } catch {
      return false;
    }
  }

  async validate(proof: string): Promise<ValidationResult> {
    await this.initialize();

    try {
      const valid = this.wasmModule.validate(proof);
      return { valid };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'WASM validation failed',
      };
    }
  }

  async getVersion(): Promise<string> {
    try {
      await this.initialize();
      return this.wasmModule.version?.() ?? 'wasm-local';
    } catch {
      return 'unavailable';
    }
  }
}

export class MockProverService implements IProverPort {
  private shouldFail = false;
  private delay = 100; // Configurable delay

  setFailMode(fail: boolean): void {
    this.shouldFail = fail;
  }

  setDelay(ms: number): void {
    this.delay = ms;
  }

  async prove(
    params: ProveParams,
    options?: { onProgress?: (message: string) => void }
  ): Promise<ProveResult> {
    const onProgress = options?.onProgress;

    // Simulate proof generation with progress updates
    onProgress?.('Generating mock proof...');
    await sleep(this.delay);

    if (this.delay > 1000) {
      onProgress?.('Mock proof generation in progress...');
      await sleep(this.delay);
    }

    if (this.shouldFail) {
      return { success: false, error: 'Mock prover failure' };
    }

    // Generate valid minimal Bitcoin transactions
    const fundingTxid = params.fundingUtxo?.txid || '00'.repeat(32);
    const fundingVout = params.fundingUtxo?.vout.toString() || '0';

    // Commit transaction: version 2, 1 input, 1 output, locktime 0
    const mockCommitTx = [
      '02000000', // version
      '01', // 1 input
      fundingTxid.match(/.{2}/g)?.reverse().join('') || '00'.repeat(32), // prev txid (reversed)
      parseInt(fundingVout || '0')
        .toString(16)
        .padStart(8, '0')
        .match(/.{2}/g)
        ?.reverse()
        .join('') || '00000000', // prev vout
      '00', // scriptSig length (0 = unsigned)
      'ffffffff', // sequence
      '01', // 1 output
      '2202000000000000', // 546 sats (little endian)
      '16', // scriptPubKey length (22 bytes for P2WPKH)
      '0014' + '00'.repeat(20), // P2WPKH scriptPubKey
      '00000000', // locktime
    ].join('');

    // Spell transaction: similar structure
    const mockSpellTx = [
      '02000000', // version
      '01', // 1 input (references commit tx)
      '00'.repeat(32), // placeholder prev txid
      '00000000', // prev vout 0
      '00', // scriptSig length (0 = unsigned)
      'ffffffff', // sequence
      '01', // 1 output
      '2202000000000000', // 546 sats
      '16', // scriptPubKey length
      '0014' + '00'.repeat(20), // P2WPKH scriptPubKey
      '00000000', // locktime
    ].join('');

    onProgress?.('Mock proof complete!');

    return {
      success: true,
      commitTx: mockCommitTx,
      spellTx: mockSpellTx,
      isMock: true, // Flag to prevent real broadcast
    };
  }

  async isAvailable(): Promise<boolean> {
    return !this.shouldFail;
  }

  async validate(_proof: string): Promise<ValidationResult> {
    await sleep(50);

    if (this.shouldFail) {
      return { valid: false, error: 'Mock validation failure' };
    }

    return { valid: true };
  }

  async getVersion(): Promise<string> {
    return 'mock-1.0.0';
  }
}

export type ProverType = 'remote' | 'wasm' | 'mock';

export function createProverService(
  type: ProverType = 'remote',
  options?: {
    network?: Network;
    config?: Partial<ProverConfig>;
    mockDelay?: number;
  }
): IProverPort {
  switch (type) {
    case 'wasm':
      return new WasmProverService();
    case 'mock': {
      const mock = new MockProverService();
      if (options?.mockDelay) {
        mock.setDelay(options.mockDelay);
      }
      return mock;
    }
    case 'remote':
    default:
      return new RemoteProverService(options?.network, options?.config);
  }
}

// Default instance for convenience
export const proverService = new RemoteProverService('testnet4');
