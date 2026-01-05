
// WALLET SERVICE - Implements IWalletPort

import { IWalletPort } from '../application/ports';
import { PubKey } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('WalletService');

interface BitcoinProvider {
  requestAccounts: () => Promise<string[]>;
  getPublicKey: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  signPsbt: (psbtHex: string, options?: any) => Promise<string>;
  getNetwork?: () => Promise<string>;
}

// UniSat-specific interface
interface UnisatProvider {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  getPublicKey: () => Promise<string>;
  signMessage: (message: string, type?: string) => Promise<string>;
  signPsbt: (psbtHex: string, options?: { autoFinalized?: boolean; toSignInputs?: Array<{ index: number; address?: string; publicKey?: string; sighashTypes?: number[] }> }) => Promise<string>;
  getNetwork: () => Promise<string>;
  switchNetwork: (network: string) => Promise<void>;
  getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>;
}

interface XverseProvider {
  request: (method: string, params?: any) => Promise<any>;
}

interface XverseProviders {
  BitcoinProvider?: XverseProvider;
}

declare global {
  interface Window {
    unisat?: UnisatProvider;
    xverse?: BitcoinProvider;
    leather?: BitcoinProvider;
    bitcoin?: BitcoinProvider;
    XverseProviders?: XverseProviders;
    BitcoinProvider?: any;
  }
}

// UniSat Wallet Adapter - handles UniSat's specific API
class UnisatAdapter implements BitcoinProvider {
  constructor(private unisatProvider: UnisatProvider) {}

  async requestAccounts(): Promise<string[]> {
    logger.debug('[UnisatAdapter] Requesting accounts...');
    try {
      const accounts = await this.unisatProvider.requestAccounts();
      logger.debug('[UnisatAdapter] Got accounts:', accounts);
      
      // UniSat returns Taproot addresses by default when in Taproot mode
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        logger.info('[UnisatAdapter] Connected address:', address);
        
        // Check if it's a Taproot address
        if (address.startsWith('tb1p') || address.startsWith('bc1p')) {
          logger.info('[UnisatAdapter] ✅ Taproot address detected - compatible with Charms');
        } else if (address.startsWith('tb1q') || address.startsWith('bc1q')) {
          logger.warn('[UnisatAdapter] ⚠️ SegWit address detected. For Charms, switch to Taproot in UniSat settings.');
          throw new Error(
            'Charms requires a Taproot address (bc1p.../tb1p...).\n\n' +
            'To switch to Taproot in UniSat:\n' +
            '1. Click on your address at the top of UniSat\n' +
            '2. Select "Taproot (P2TR)" address type\n' +
            '3. Reconnect your wallet\n\n' +
            `Current address: ${address}`
          );
        }
      }
      
      return accounts;
    } catch (err) {
      logger.error('[UnisatAdapter] Failed to get accounts:', err);
      throw err;
    }
  }

  async getPublicKey(): Promise<string> {
    logger.debug('[UnisatAdapter] Getting public key...');
    try {
      const pubkey = await this.unisatProvider.getPublicKey();
      logger.debug('[UnisatAdapter] Got public key:', pubkey);
      return pubkey;
    } catch (err) {
      logger.error('[UnisatAdapter] Failed to get public key:', err);
      throw err;
    }
  }

  async signMessage(message: string): Promise<string> {
    logger.debug('[UnisatAdapter] Signing message...');
    try {
      // UniSat uses 'bip322-simple' for Taproot signing by default
      const signature = await this.unisatProvider.signMessage(message, 'bip322-simple');
      logger.debug('[UnisatAdapter] Message signed');
      return signature;
    } catch (err) {
      logger.error('[UnisatAdapter] Failed to sign message:', err);
      throw err;
    }
  }

  async signPsbt(psbtHex: string, signInputs?: Record<string, number[]>): Promise<string> {
    logger.debug('[UnisatAdapter] Signing PSBT...', {
      psbtLength: psbtHex.length,
      signInputs: signInputs || 'all inputs',
    });
    
    try {
      // UniSat expects hex format for PSBT
      // Convert from base64 to hex if needed
      let psbtToSign = psbtHex;
      
      // Check if it's base64 (contains non-hex chars or ends with =)
      if (!/^[0-9a-fA-F]+$/.test(psbtHex)) {
        logger.debug('[UnisatAdapter] Converting PSBT from base64 to hex');
        const binary = atob(psbtHex);
        psbtToSign = Array.from(binary, (char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      }
      
      // Build UniSat-specific options
      const options: any = {
        autoFinalized: false, // Don't auto-finalize so we can control the process
      };
      
      // If specific inputs are specified, convert to UniSat format
      if (signInputs) {
        const toSignInputs: Array<{ index: number; address?: string }> = [];
        for (const [address, indexes] of Object.entries(signInputs)) {
          for (const index of indexes) {
            toSignInputs.push({ index, address });
          }
        }
        if (toSignInputs.length > 0) {
          options.toSignInputs = toSignInputs;
        }
      }
      
      logger.debug('[UnisatAdapter] Calling signPsbt with options:', options);
      const signedPsbtHex = await this.unisatProvider.signPsbt(psbtToSign, options);
      logger.debug('[UnisatAdapter] PSBT signed, length:', signedPsbtHex.length);
      
      // UniSat returns hex, but our code expects base64
      // Convert back to base64
      const bytes = new Uint8Array(signedPsbtHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const base64 = btoa(String.fromCharCode(...bytes));
      
      logger.debug('[UnisatAdapter] Converted signed PSBT to base64');
      return base64;
    } catch (err) {
      logger.error('[UnisatAdapter] Failed to sign PSBT:', err);
      throw err;
    }
  }

  async getNetwork(): Promise<string> {
    try {
      return await this.unisatProvider.getNetwork();
    } catch {
      return 'unknown';
    }
  }
}

class XverseAdapter implements BitcoinProvider {
  constructor(private xverseProvider: any) {}

  async requestAccounts(): Promise<string[]> {
    logger.debug('[XverseAdapter] Requesting accounts with wallet_requestPermissions...');
    try {
      // First, request permissions/connection
      logger.debug('[XverseAdapter] Calling wallet_requestPermissions...');
      const permissionResponse = await this.xverseProvider.request('wallet_requestPermissions');
      logger.debug('[XverseAdapter] Permission response:', permissionResponse);

      // Then get addresses
      logger.debug('[XverseAdapter] Calling getAddresses...');
      const response = await this.xverseProvider.request('getAddresses', {
        purposes: ['payment', 'ordinals'],
      });
      logger.debug('[XverseAdapter] getAddresses response:', response);

      // Check for error in response
      if (response?.error) {
        throw new Error(`Xverse error: ${response.error.message}`);
      }

      // Extract addresses from the result
      // Prefer ordinals (Taproot) address for Charms compatibility
      if (response?.result?.addresses && Array.isArray(response.result.addresses)) {
        // Log all addresses for debugging
        response.result.addresses.forEach((addr: any, i: number) => {
          logger.debug(`[XverseAdapter] Address ${i}:`, {
            address: addr.address,
            purpose: addr.purpose,
            addressType: addr.addressType,
          });
        });
        
        // Find the ordinals/Taproot address (tb1p...) - needed for Charms
        const ordinalsAddr = response.result.addresses.find(
          (addr: any) => addr.purpose === 'ordinals' || addr.address?.startsWith('tb1p') || addr.address?.startsWith('bc1p')
        );
        
        // For Charms, we NEED a Taproot address - fail if not found
        if (!ordinalsAddr) {
          logger.error('[XverseAdapter] ⚠️ NO TAPROOT ADDRESS FOUND!');
          logger.error('[XverseAdapter] Charms requires a Taproot (bc1p.../tb1p...) address');
          logger.error('[XverseAdapter] Available addresses:', response.result.addresses.map((a: any) => a.address));
          
          // Provide clear instructions based on what we received
          const availableAddrs = response.result.addresses.map((a: any) => a.address).join(', ');
          const hasPaymentOnly = response.result.addresses.every(
            (a: any) => a.address?.startsWith('tb1q') || a.address?.startsWith('bc1q')
          );
          
          if (hasPaymentOnly) {
            throw new Error(
              'Charms requires a Taproot (bc1p.../tb1p...) address, but your wallet only provided SegWit addresses.\n\n' +
              'To enable Taproot addresses in Xverse:\n' +
              '1. Open Xverse wallet settings\n' +
              '2. Enable "Bitcoin" and "Ordinals & BRC-20"\n' +
              '3. Disconnect and reconnect your wallet\n\n' +
              `Current addresses: ${availableAddrs}`
            );
          } else {
            throw new Error(
              'No Taproot address found. Charms requires a Taproot (bc1p.../tb1p...) address.\n\n' +
              'Please ensure your wallet supports Taproot/Ordinals and try reconnecting.\n\n' +
              `Available addresses: ${availableAddrs}`
            );
          }
        }
        
        // Use the ordinals/Taproot address
        const selectedAddr = ordinalsAddr;
        logger.info('[XverseAdapter] ✅ Using ordinals/Taproot address for Charms:', selectedAddr.address);
        
        return [selectedAddr.address];
      }

      // Fallback for different response format
      if (Array.isArray(response)) {
        return response.map((account: any) => account.address || account);
      }

      logger.error('[XverseAdapter] Unexpected response format:', response);
      throw new Error('Unexpected response format from Xverse wallet');
    } catch (err) {
      logger.error('[XverseAdapter] Failed to get accounts:', err);
      throw err;
    }
  }

  async getPublicKey(): Promise<string> {
    logger.debug('[XverseAdapter] Getting public key...');
    try {
      const response = await this.xverseProvider.request('getAddresses', {
        purposes: ['payment', 'ordinals'],
      });
      logger.debug('[XverseAdapter] getAddresses for pubkey:', response);

      if (response?.error) {
        throw new Error(`Xverse error: ${response.error.message}`);
      }

      if (response?.result?.addresses && Array.isArray(response.result.addresses)) {
        // Use ordinals/Taproot address's pubkey for Charms compatibility
        const ordinalsAddr = response.result.addresses.find(
          (addr: any) => addr.purpose === 'ordinals' || addr.address?.startsWith('tb1p') || addr.address?.startsWith('bc1p')
        );
        
        // For Charms, we NEED a Taproot pubkey - fail if not found
        if (!ordinalsAddr) {
          throw new Error(
            'Charms requires a Taproot (bc1p.../tb1p...) address, but your wallet only provided SegWit addresses.\n\n' +
            'To enable Taproot addresses in Xverse:\n' +
            '1. Open Xverse wallet settings\n' +
            '2. Enable "Bitcoin" and "Ordinals & BRC-20"\n' +
            '3. Disconnect and reconnect your wallet'
          );
        }
        
        const pubkey = ordinalsAddr.publicKey || ordinalsAddr.pubkey;
        logger.debug('[XverseAdapter] Extracted pubkey from ordinals address:', {
          purpose: ordinalsAddr.purpose,
          address: ordinalsAddr.address,
          pubkey,
        });
        return pubkey;
      }

      if (Array.isArray(response)) {
        return response[0].publicKey || response[0].pubkey;
      }

      throw new Error('Could not extract public key from response');
    } catch (err) {
      logger.error('[XverseAdapter] Failed to get public key:', err);
      throw err;
    }
  }

  async signMessage(message: string): Promise<string> {
    const response = await this.xverseProvider.request('signMessage', {
      message,
      address: '' // Will need to be filled in with current address
    });

    if (response?.error) {
      throw new Error(`Xverse error: ${response.error.message}`);
    }

    return response?.result?.signature || response?.signature || response;
  }

  async signPsbt(psbtBase64: string, signInputs?: Record<string, number[]>): Promise<string> {
    logger.debug('[XverseAdapter] Signing PSBT:', {
      psbtLength: psbtBase64.length,
      signInputs: signInputs || 'all inputs',
    });
    
    const requestParams: any = {
      psbt: psbtBase64,
      broadcast: false,
    };
    
    // If signInputs is specified, only sign those specific inputs
    // This is critical for spell transactions where we must preserve the prover's witness
    if (signInputs) {
      requestParams.signInputs = signInputs;
    }
    
    const response = await this.xverseProvider.request('signPsbt', requestParams);

    if (response?.error) {
      throw new Error(`Xverse error: ${response.error.message}`);
    }

    return response?.result?.psbt || response?.psbt || response;
  }
}

export class BrowserWalletService implements IWalletPort {
  private provider: BitcoinProvider | null = null;
  private currentAddress: string | null = null;
  private currentPubkey: PubKey | null = null;

  /**
   * Connect to a browser wallet (Unisat, Xverse, Leather, etc.).
   *
   * @returns Address and pubkey from the connected wallet
   * @throws Error if no wallet found or connection fails
   */
  async connect(): Promise<{ address: string; pubkey: PubKey }> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(
        'No Bitcoin wallet found. Please install Unisat, Xverse, or Leather.'
      );
    }

    const accounts = await provider.requestAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from wallet');
    }

    const address = accounts[0];
    const pubkey = await provider.getPublicKey();

    this.provider = provider;
    this.currentAddress = address;
    this.currentPubkey = pubkey;

    return { address, pubkey };
  }

  /**
   * Disconnect from the wallet.
   */
  disconnect(): void {
    this.provider = null;
    this.currentAddress = null;
    this.currentPubkey = null;
  }

  /**
   * Sign a message with the wallet's private key.
   *
   * @param message - Message to sign
   * @returns Signature as hex string
   * @throws Error if wallet not connected
   */
  async signMessage(message: string): Promise<string> {
    // Auto-connect if not connected
    if (!this.provider) {
      logger.debug('[WalletService] Auto-connecting before signMessage...');
      await this.connect();
    }
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }
    return this.provider.signMessage(message);
  }

  /**
   * Sign a PSBT (Partially Signed Bitcoin Transaction).
   *
   * @param psbtBase64 - PSBT in base64 format
   * @param signInputs - Optional: map of address -> input indexes to sign.
   *                     If not provided, all inputs will be signed.
   *                     Use this to selectively sign specific inputs while
   *                     preserving existing witnesses on other inputs.
   * @returns Signed PSBT in base64 format
   * @throws Error if wallet not connected or doesn't support PSBT signing
   */
  async signPsbt(psbtBase64: string, signInputs?: Record<string, number[]>): Promise<string> {
    // Auto-connect if not connected
    if (!this.provider) {
      logger.debug('[WalletService] Auto-connecting before signPsbt...');
      await this.connect();
    }
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }
    if (!this.provider.signPsbt) {
      throw new Error('Wallet does not support PSBT signing');
    }
    // Pass through signInputs if the provider supports it (XverseAdapter does)
    return (this.provider as any).signPsbt(psbtBase64, signInputs);
  }

  /**
   * Get the current public key.
   *
   * @returns Public key as hex string
   * @throws Error if wallet not connected
   */
  async getPublicKey(): Promise<PubKey> {
    // Auto-connect if not connected
    if (!this.currentPubkey) {
      logger.debug('[WalletService] Auto-connecting before getPublicKey...');
      await this.connect();
    }
    if (!this.currentPubkey) {
      throw new Error('Wallet not connected');
    }
    return this.currentPubkey;
  }

  /**
   * Check if wallet is currently connected.
   */
  isConnected(): boolean {
    return this.provider !== null && this.currentAddress !== null;
  }

  /**
   * Get the first available Bitcoin wallet provider.
   *
   * @returns Provider or null if none found
   */
  private getProvider(): BitcoinProvider | null {
    if (typeof window === 'undefined') return null;

    // Debug: Log what wallet providers are available
    logger.debug('[WalletService] Checking for wallet providers:', {
      unisat: !!window.unisat,
      xverse: !!window.xverse,
      leather: !!window.leather,
      bitcoin: !!window.bitcoin,
      // Check for alternative Xverse API locations
      XverseProviders: !!window.XverseProviders,
      BitcoinProvider: !!window.BitcoinProvider,
    });

    if (window.unisat) {
      logger.debug('[WalletService] Using Unisat wallet');
      return new UnisatAdapter(window.unisat);
    }

    // Try Xverse - might be under different property
    if (window.xverse) {
      logger.debug('[WalletService] Using Xverse wallet (window.xverse)');
      return window.xverse;
    }

    // Xverse also exposes via XverseProviders.BitcoinProvider
    if (window.XverseProviders?.BitcoinProvider) {
      logger.debug('[WalletService] Using Xverse wallet (XverseProviders)');
      logger.debug('[WalletService] XverseProviders object:', window.XverseProviders);
      logger.debug('[WalletService] BitcoinProvider object:', window.XverseProviders.BitcoinProvider);
      return new XverseAdapter(window.XverseProviders.BitcoinProvider);
    }

    if (window.leather) {
      logger.debug('[WalletService] Using Leather wallet');
      return window.leather;
    }

    if (window.bitcoin) {
      logger.debug('[WalletService] Using generic bitcoin provider');
      return window.bitcoin;
    }

    logger.error('[WalletService] No Bitcoin wallet provider found');
    return null;
  }
}

export class MockWalletService implements IWalletPort {
  private connected = false;
  private readonly mockAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
  private readonly mockPubkey: PubKey = '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';

  async connect(): Promise<{ address: string; pubkey: PubKey }> {
    this.connected = true;
    return { address: this.mockAddress, pubkey: this.mockPubkey };
  }

  disconnect(): void {
    this.connected = false;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return `mock_signature_${message.slice(0, 16)}`;
  }

  async signPsbt(psbtHex: string): Promise<string> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return psbtHex;
  }

  async getPublicKey(): Promise<PubKey> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }
    return this.mockPubkey;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export function createWalletService(mode: 'browser' | 'mock' = 'browser'): IWalletPort {
  return mode === 'mock' ? new MockWalletService() : new BrowserWalletService();
}
