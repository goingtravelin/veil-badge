
import { useState, useCallback, useEffect } from 'react';
import {
  WalletState,
  Network,
  VeilBadge,
  UtxoInfo,
  PubKey,
  Outcome,
  TxType,
} from '../types';
import { createWalletService, charmsService, createBitcoinService, createProverService, createCryptoService, createStorageService } from '../services';
import { createLogger } from '../utils/logger';
import { VEIL_APP_VK, VEIL_APP_IDENTITY } from '../domain';
import { hasSeedPhrase, getSeedPhrase, generateTaprootKeysForIndex, signMessageWithSeedPhrase } from '../services/TaprootKeyService';
import { mintBadge as mintBadgeUseCase } from '../application/mintBadge';
import { UseCaseContext } from '../application/ports';

const logger = createLogger('useWallet');

export interface UseWalletReturn {
  // Wallet connection
  wallet: WalletState;
  connect: (mode?: 'browser' | 'demo' | 'seed') => Promise<void>;
  disconnect: () => void;
  refreshUtxos: () => Promise<void>;
  refreshBadges: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  getPublicKey: () => Promise<PubKey>;

  mintBadge: () => Promise<string>;
  recordTransaction: (
    badge: VeilBadge,
    badgeUtxo: UtxoInfo,
    counterpartyPubkey: PubKey,
    counterpartySignature: string,
    outcome: Outcome,
    value: number,
    txType: TxType
  ) => Promise<string>;
  vouch: (
    myBadge: VeilBadge,
    myBadgeUtxo: UtxoInfo,
    targetBadgeId: string,
    stakePercent: number,
    lockBlocks: number
  ) => Promise<string>;
  unvouch: (
    myBadge: VeilBadge,
    myBadgeUtxo: UtxoInfo,
    targetBadgeId: string
  ) => Promise<string>;

  // Verification functions
  verifyTransaction: (txid: string) => Promise<VeilBadge | null>;
  verifyCounterpartyBadge: (txid: string, vout: number) => Promise<VeilBadge | null>;

  // State
  badges: VeilBadge[];
  badgeUtxos: Map<string, UtxoInfo>; 
  error: string | null;
  loading: boolean;
  txStatus: string | null;
  successMessage: string | null;
  clearSuccess: () => void;
}

const initialWalletState: WalletState = {
  connected: false,
  address: null,
  pubkey: null,
  network: 'testnet4',
  utxos: [],
};

const BADGES_STORAGE_KEY = 'veil_minted_badges';

function loadPersistedBadges(): VeilBadge[] {
  try {
    const stored = localStorage.getItem(BADGES_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((b: VeilBadge) => ({
      ...b,
      volume_sum_squares: BigInt(b.volume_sum_squares || 0),
    }));
  } catch {
    return [];
  }
}

function persistBadges(badges: VeilBadge[]): void {
  try {
    // Deduplicate badges by ID before persisting
    const badgeMap = new Map<string, VeilBadge>();
    for (const badge of badges) {
      badgeMap.set(badge.id, badge);
    }
    const uniqueBadges = Array.from(badgeMap.values());
    
    const serializable = uniqueBadges.map((b) => ({
      ...b,
      volume_sum_squares: b.volume_sum_squares.toString(),
    }));
    localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(serializable));
  } catch (err) {
    logger.error('[Veil] Failed to persist badges:', err);
  }
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [badges, setBadges] = useState<VeilBadge[]>([]);
  const [badgeUtxos, setBadgeUtxos] = useState<Map<string, UtxoInfo>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  useEffect(() => {
    const persisted = loadPersistedBadges();
    if (persisted.length > 0) {
      logger.debug('[Veil] Loaded', persisted.length, 'persisted badges');
      setBadges(persisted);
    }
  }, []);

  // AUTO-RECONNECT ON MOUNT

  useEffect(() => {
    const checkExistingConnection = async () => {
      const savedAddress = localStorage.getItem('veil_wallet_address');
      const savedPubkey = localStorage.getItem('veil_wallet_pubkey');
      const savedNetwork = (localStorage.getItem('veil_wallet_network') as Network) || 'testnet4';

      if (savedAddress && savedPubkey) {
        logger.debug('[Veil] Restoring wallet connection');
        setWallet({
          connected: true,
          address: savedAddress,
          pubkey: savedPubkey.length === 64 ? '02' + savedPubkey : savedPubkey, // Ensure compressed format
          network: savedNetwork,
          utxos: [],
        });

        // Fetch UTXOs for the restored wallet
        try {
          const bitcoinService = createBitcoinService('mempool');
          const utxos = await bitcoinService.fetchUtxos(savedAddress, savedNetwork);
          setWallet((prev) => ({ ...prev, utxos }));
          logger.debug('[Veil] Loaded', utxos.length, 'UTXOs');
        } catch (err) {
          logger.error('[Veil] Failed to fetch UTXOs on restore:', err);
        }
      }
    };

    checkExistingConnection();
  }, []);

  const connect = useCallback(async (mode: 'browser' | 'demo' | 'seed' = 'browser') => {
    setError(null);
    setConnectionLoading(true);

    try {
      // Seed phrase mode - use address derived from seed phrase
      if (mode === 'seed') {
        if (!hasSeedPhrase()) {
          throw new Error('No seed phrase configured. Please import your seed phrase first.');
        }
        
        const seedPhrase = getSeedPhrase()!;
        const network: Network = 'testnet4';
        const isTestnet = true;
        
        // Derive address and pubkey from seed phrase
        const keys = await generateTaprootKeysForIndex(seedPhrase, 0, isTestnet);
        const address = keys.address;
        // Convert x-only pubkey to compressed format (add 02 prefix)
        const pubkey = '02' + keys.xOnlyPubkey.toString('hex');
        
        logger.debug('[Veil] Connecting with seed phrase address:', address);
        
        // Update wallet state
        setWallet({
          connected: true,
          address,
          pubkey,
          network,
          utxos: [],
        });

        // Persist to localStorage
        localStorage.setItem('veil_wallet_address', address);
        localStorage.setItem('veil_wallet_pubkey', pubkey);
        localStorage.setItem('veil_wallet_network', network);
        localStorage.setItem('veil_wallet_mode', mode);

        // Fetch UTXOs
        const bitcoinService = createBitcoinService('mempool');
        const utxos = await bitcoinService.fetchUtxos(address, network);
        setWallet((prev) => ({ ...prev, utxos }));
        logger.debug('[Veil] Connected with', utxos.length, 'UTXOs');
        
        return;
      }

      const walletService = createWalletService('browser');
      const { address, pubkey } = await walletService.connect();

      const network: Network = 'testnet4';

      // Update wallet state
      setWallet({
        connected: true,
        address,
        pubkey: pubkey.length === 64 ? '02' + pubkey : pubkey, // Ensure compressed format
        network,
        utxos: [],
      });

      // Persist to localStorage
      localStorage.setItem('veil_wallet_address', address);
      localStorage.setItem('veil_wallet_pubkey', pubkey);
      localStorage.setItem('veil_wallet_network', network);
      localStorage.setItem('veil_wallet_mode', mode);

      // Fetch UTXOs
      const bitcoinService = createBitcoinService('mempool');
      const utxos = await bitcoinService.fetchUtxos(address, network);
      setWallet((prev) => ({ ...prev, utxos }));
      logger.debug('[Veil] Connected with', utxos.length, 'UTXOs');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      throw err;
    } finally {
      setConnectionLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem('veil_wallet_address');
    localStorage.removeItem('veil_wallet_pubkey');
    localStorage.removeItem('veil_wallet_network');
    localStorage.removeItem('veil_wallet_mode');
    localStorage.removeItem(BADGES_STORAGE_KEY);
    setWallet(initialWalletState);
    setBadges([]);
    setError(null);
    setSuccessMessage(null);
    setTxStatus(null);
    logger.debug('[Veil] Wallet disconnected');
  }, []);

  // REFRESH FUNCTIONS

  const refreshUtxos = useCallback(async () => {
    if (!wallet.connected || !wallet.address) return;

    try {
      const bitcoinService = createBitcoinService('mempool');
      const utxos = await bitcoinService.fetchUtxos(wallet.address, wallet.network);
      setWallet((prev) => ({ ...prev, utxos }));
      logger.debug('[Veil] Refreshed', utxos.length, 'UTXOs');
    } catch (err) {
      logger.error('[Veil] Failed to refresh UTXOs:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh UTXOs');
    }
  }, [wallet.connected, wallet.address, wallet.network]);

  const refreshBadges = useCallback(async () => {
    logger.debug(`[refreshBadges] Called. connected=${wallet.connected}, utxos=${wallet.utxos?.length || 0}`);
    if (!wallet.connected || !wallet.utxos) return;

    try {
      // Use VK-based discovery: any identity + our VK = Veil badge
      // Format: n/<any-identity>/<our-vk>
      // We use a dummy identity since hasVeilBadge now extracts and matches VK only
      const veilAppSpec = `n/${VEIL_APP_IDENTITY}/${VEIL_APP_VK}`;
      logger.debug(`[refreshBadges] Scanning ${wallet.utxos.length} UTXOs with veilAppSpec=${veilAppSpec}`);
      const discovered = await charmsService.discoverBadgesInUtxos(
        wallet.utxos,
        veilAppSpec,
        wallet.network
      );
      logger.debug(`[refreshBadges] Discovery complete. Found ${discovered.length} badges`);
      
      // Merge discovered badges with existing ones (deduplicate by ID)
      // Discovered badges take precedence as they have confirmed on-chain state
      setBadges(prev => {
        const badgeMap = new Map<string, VeilBadge>();
        // Add existing badges first
        for (const badge of prev) {
          badgeMap.set(badge.id, badge);
        }
        // Override with discovered badges (they have on-chain truth)
        for (const d of discovered) {
          badgeMap.set(d.badge.id, d.badge);
        }
        const merged = Array.from(badgeMap.values());
        persistBadges(merged);
        return merged;
      });
      
      // Store badge UTXO mappings from discovered badges
      const utxoMap = new Map<string, UtxoInfo>();
      for (const d of discovered) {
        // Find the full UTXO info from wallet UTXOs
        const fullUtxo = wallet.utxos.find(u => u.txid === d.txid && u.vout === d.vout);
        if (fullUtxo) {
          utxoMap.set(d.badge.id, fullUtxo);
        }
      }
      
      // For badges that have stored UTXO info (from minting), use that directly
      // This handles badges loaded from localStorage that weren't found by WASM discovery
      setBadges(prev => {
        logger.debug(`[refreshBadges] Processing ${prev.length} badges for stored UTXOs`);
        for (const badge of prev) {
          logger.debug(`[refreshBadges] Badge ${badge.id.slice(0,8)} - utxoMap.has=${utxoMap.has(badge.id)}, badge.utxo=${badge.utxo ? `${badge.utxo.txid.slice(0,8)}:${badge.utxo.vout}` : 'none'}`);
          if (!utxoMap.has(badge.id) && badge.utxo) {
            // Badge has stored UTXO info - look for it in wallet UTXOs
            const storedUtxo = wallet.utxos.find(
              u => u.txid === badge.utxo!.txid && u.vout === badge.utxo!.vout
            );
            if (storedUtxo) {
              logger.debug(`[refreshBadges] Found stored UTXO for badge ${badge.id.slice(0,8)}:`, storedUtxo.txid.slice(0,8), storedUtxo.vout);
              utxoMap.set(badge.id, storedUtxo);
            } else {
              logger.debug(`[refreshBadges] Stored UTXO NOT FOUND in wallet.utxos for badge ${badge.id.slice(0,8)}`);
            }
          }
          
          // Fallback: if still no UTXO, try to find by dust amount (legacy badges)
          if (!utxoMap.has(badge.id)) {
            const potentialBadgeUtxo = wallet.utxos.find(u => 
              u.value === 546 || // Standard Charms dust amount
              (u.value >= 330 && u.value <= 1000) // Or small dust range
            );
            if (potentialBadgeUtxo) {
              logger.debug(`[refreshBadges] Found potential UTXO for badge ${badge.id.slice(0,8)}:`, potentialBadgeUtxo.txid.slice(0,8));
              utxoMap.set(badge.id, potentialBadgeUtxo);
            }
          }
        }
        return prev;
      });
      
      setBadgeUtxos(utxoMap);
      
      // Log all entries in utxoMap
      for (const [badgeId, utxo] of utxoMap.entries()) {
        logger.debug(`[refreshBadges] utxoMap entry: badge=${badgeId.slice(0,8)}, utxo=${utxo.txid.slice(0,8)}:${utxo.vout}`);
      }
      
      logger.debug('[Veil] Refreshed badges, found', discovered.length, 'utxoMap size:', utxoMap.size);
    } catch (err) {
      // Badge discovery errors are expected when UTXOs don't contain badges
      logger.warn('[Veil] Badge discovery error (this is normal if you have no badges):', err);
      // Don't set error state for badge discovery failures - just log it
    }
  }, [wallet.connected, wallet.utxos, wallet.network]);

  useEffect(() => {
    if (wallet.connected && wallet.utxos.length > 0) {
      refreshBadges();
    }
  }, [wallet.connected, wallet.utxos, refreshBadges]);

  // WALLET OPERATIONS

  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!wallet.connected) {
        throw new Error('Wallet not connected');
      }

      // Use seed phrase signing if available, otherwise fall back to browser wallet
      if (hasSeedPhrase()) {
        logger.info('Signing message with seed phrase');
        const isTestnet = wallet.network !== 'mainnet';
        return signMessageWithSeedPhrase(message, isTestnet);
      }
      
      logger.info('Signing message with browser wallet');
      const walletService = createWalletService('browser');
      return walletService.signMessage(message);
    },
    [wallet.connected, wallet.network]
  );

  const getPublicKey = useCallback(async (): Promise<PubKey> => {
    if (!wallet.pubkey) {
      throw new Error('Wallet not connected');
    }
    return wallet.pubkey;
  }, [wallet.pubkey]);

  const mintBadge = useCallback(async (): Promise<string> => {
    if (!wallet.connected || !wallet.address || !wallet.pubkey) {
      throw new Error('Wallet not connected');
    }

    setTxStatus('Starting badge mint...');
    setError(null);

    try {
      // Create use case context with all required services
      const bitcoinService = createBitcoinService('mempool');
      const proverService = createProverService();
      const cryptoService = createCryptoService();
      const storageService = createStorageService();
      const walletService = createWalletService();

      const ctx: UseCaseContext = {
        bitcoin: bitcoinService,
        prover: proverService,
        crypto: cryptoService,
        storage: storageService,
        wallet: walletService,
        network: wallet.network,
        onProgress: (message: string) => {
          logger.info('[Mint]', message);
          setTxStatus(message);
        },
      };

      const result = await mintBadgeUseCase(
        { address: wallet.address, pubkey: wallet.pubkey },
        ctx
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Mint failed');
      }

      // Add the new badge to state
      const newBadge = result.data.badge;
      setBadges((prev) => {
        const updated = [...prev, newBadge];
        persistBadges(updated);
        return updated;
      });

      setTxStatus(null);
      setSuccessMessage(`Badge minted! TXID: ${result.data.txid.slice(0, 16)}...`);
      
      return result.data.txid;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[Mint] Failed:', errorMsg);
      setError(errorMsg);
      setTxStatus(null);
      throw err;
    }
  }, [wallet]);

  const recordTransaction = useCallback(
    async (
      _badge: VeilBadge,
      _badgeUtxo: UtxoInfo,
      _counterpartyPubkey: PubKey,
      _counterpartySignature: string,
      _outcome: Outcome,
      _value: number,
      _txType: TxType
    ): Promise<string> => {
      if (!wallet.connected || !wallet.address) {
        throw new Error('Wallet not connected');
      }

      throw new Error('Not implemented');
    },
    [wallet]
  );

  const vouch = useCallback(
    async (
      _myBadge: VeilBadge,
      _myBadgeUtxo: UtxoInfo,
      _targetBadgeId: string,
      _stakePercent: number,
      _lockBlocks: number
    ): Promise<string> => {
      if (!wallet.connected || !wallet.address) {
        throw new Error('Wallet not connected');
      }

      throw new Error('Not implemented');
    },
    [wallet]
  );

  const unvouch = useCallback(
    async (
      _myBadge: VeilBadge,
      _myBadgeUtxo: UtxoInfo,
      _targetBadgeId: string
    ): Promise<string> => {
      if (!wallet.connected || !wallet.address) {
        throw new Error('Wallet not connected');
      }

      throw new Error('Not implemented');
    },
    [wallet]
  );

  // VERIFICATION FUNCTIONS

  const verifyTransaction = useCallback(
    async (txid: string): Promise<VeilBadge | null> => {
      try {
        const bitcoinService = createBitcoinService('mempool');
        const txHex = await bitcoinService.fetchTransaction(txid, wallet.network);
        const spell = await charmsService.extractAndVerifySpell(txHex);

        if (!spell) {
          logger.warn('[Veil] No valid spell found in transaction');
          return null;
        }

        // Extract badge from spell outputs
        if (spell.tx?.outs) {
          for (const outputMap of spell.tx.outs) {
            if (outputMap instanceof Map) {
              for (const [, data] of outputMap) {
                // Check if data is a VeilBadge
                if (data && typeof data === 'object') {
                  return data as VeilBadge;
                }
              }
            }
          }
        }

        return null;
      } catch (err) {
        logger.error('[Veil] Failed to verify transaction:', err);
        return null;
      }
    },
    [wallet.network]
  );

  const verifyCounterpartyBadge = useCallback(
    async (txid: string, vout: number): Promise<VeilBadge | null> => {
      try {
        // VK-based discovery - matches any badge with our VK
        const veilAppSpec = `n/${VEIL_APP_IDENTITY}/${VEIL_APP_VK}`;
        return await charmsService.scanUtxoForBadge(txid, vout, veilAppSpec, wallet.network);
      } catch (err) {
        logger.error('[Veil] Failed to verify counterparty badge:', err);
        return null;
      }
    },
    [wallet.network]
  );

  // RETURN

  return {
    wallet,
    connect,
    disconnect,
    refreshUtxos,
    refreshBadges,
    signMessage,
    getPublicKey,
    mintBadge,
    recordTransaction,
    vouch,
    unvouch,
    verifyTransaction,
    verifyCounterpartyBadge,
    badges,
    badgeUtxos,
    error,
    loading: connectionLoading,
    txStatus,
    successMessage,
    clearSuccess: () => setSuccessMessage(null),
  };
}

export async function getCurrentBlockHeight(network: Network): Promise<number> {
  const endpoints: Record<Network, string> = {
    mainnet: 'https://blockstream.info/api/blocks/tip/height',
    testnet4: 'https://mempool.space/testnet4/api/blocks/tip/height',
    signet: 'https://mempool.space/signet/api/blocks/tip/height',
    regtest: 'http://localhost:3001/api/blockchain/height', // Via proxy
  };

  try {
    const response = await fetch(endpoints[network]);
    if (!response.ok) throw new Error('Failed to fetch block height');
    const height = await response.text();
    return parseInt(height, 10);
  } catch (err) {
    logger.warn('[Veil] Failed to get block height (using fallback):', err);
    return 870000; // Fallback testnet4 height
  }
}

export async function discoverBadges(
  address: string,
  network: Network
): Promise<VeilBadge[]> {
  // Ensure WASM is initialized
  if (!charmsService.isReady()) {
    try {
      await charmsService.initWasm();
    } catch (err) {
      logger.error('[Veil] Failed to initialize Charms WASM:', err);
      return [];
    }
  }

  // Fetch UTXOs for the address
  const bitcoinService = createBitcoinService('mempool');
  const utxos = await bitcoinService.fetchUtxos(address, network);
  logger.debug('[Veil] Scanning', utxos.length, 'UTXOs for badges');

  if (utxos.length === 0) return [];

  try {
    // VK-based discovery - finds all badges with our VK regardless of identity
    const veilAppSpec = `n/${VEIL_APP_IDENTITY}/${VEIL_APP_VK}`;
    const badgeResults = await charmsService.discoverBadgesInUtxos(
      utxos.map(u => ({ txid: u.txid, vout: u.vout })),
      veilAppSpec,
      network
    );
    logger.debug('[Veil] Found', badgeResults.length, 'badges');
    return badgeResults.map(r => r.badge);
  } catch (err) {
    logger.error('[Veil] Badge discovery failed:', err);
    return [];
  }
}
