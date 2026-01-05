
// CRYPTO SERVICE - Implements ICryptoPort

import { ICryptoPort } from '../application/ports';
import { B32 } from '../types';

export class WebCryptoService implements ICryptoPort {
  /**
   * Compute SHA-256 hash of a string and return as hex-encoded string.
   *
   * @param data - Input string to hash
   * @returns Hex-encoded 32-byte hash (64 hex characters)
   */
  async sha256Hex(data: string): Promise<B32> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
   * Generate a cryptographically secure random 32-byte value.
   *
   * @returns Hex-encoded 32-byte nonce (64 hex characters)
   */
  async generateNonce(): Promise<B32> {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    const hexArray = Array.from(buffer).map(b => b.toString(16).padStart(2, '0'));
    return hexArray.join('');
  }

  /**
   * Generate a deterministic badge ID from a UTXO string.
   *
   * Badge ID is the SHA-256 hash of the UTXO string (format: "txid:vout").
   * This ensures each badge has a unique, reproducible identifier.
   *
   * @param utxoString - UTXO identifier in format "txid:vout"
   * @returns Hex-encoded 32-byte badge ID (64 hex characters)
   */
  async generateBadgeId(utxoString: string): Promise<B32> {
    return this.sha256Hex(utxoString);
  }
}

export class MockCryptoService implements ICryptoPort {
  private nonceCounter = 0;

  async sha256Hex(data: string): Promise<B32> {
    // Deterministic mock: return repeated pattern based on data
    const code = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const byte = (code % 256).toString(16).padStart(2, '0');
    return byte.repeat(32);
  }

  async generateNonce(): Promise<B32> {
    // Deterministic mock: increment counter
    const counter = this.nonceCounter++;
    const hex = counter.toString(16).padStart(64, '0');
    return hex;
  }

  async generateBadgeId(utxoString: string): Promise<B32> {
    return this.sha256Hex(utxoString);
  }

  reset(): void {
    this.nonceCounter = 0;
  }
}

export function createCryptoService(mode: 'web' | 'mock' = 'web'): ICryptoPort {
  return mode === 'mock' ? new MockCryptoService() : new WebCryptoService();
}
