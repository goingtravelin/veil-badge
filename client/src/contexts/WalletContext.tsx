

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { VeilBadge, WalletState } from '../types';
import { useWallet as useWalletHook, UseWalletReturn } from '../hooks/useWallet';
import { emptyBackingAggregates } from '../utils/backing';

export interface WalletContextValue {
  // Wallet state
  wallet: WalletState;
  badges: VeilBadge[];
  loading: boolean;
  error: string | null;
  txStatus: string | null;

  // Connection
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  
  // Badge operations
  currentBadge: VeilBadge | undefined;
  hasBadge: boolean;
  mintBadge: () => Promise<string>;
  refreshBadges: () => Promise<void>;
  
  // Transaction operations
  recordTransaction: UseWalletReturn['recordTransaction'];
  
  // Vouch operations
  vouch: UseWalletReturn['vouch'];
  unvouch: UseWalletReturn['unvouch'];
}

const WalletContext = createContext<WalletContextValue | null>(null);

interface WalletProviderProps {
  children: React.ReactNode;
  demoMode?: boolean;
}

// Demo badge for demo mode
const createDemoBadge = (): VeilBadge => ({
  id: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f60001',
  created_at: 800000,
  pubkey: '02a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
  tx_total: 47,
  tx_positive: 45,
  tx_negative: 2,
  volume_total: 15_000_000,
  volume_sum_squares: BigInt('10000000000000000'),
  window_tx_count: 8,
  window_volume: 2_500_000,
  window_start: 855000,
  counterparty_count: 23,
  backing: emptyBackingAggregates(),
  vouches_out: [
    { badge_id: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', stake_percent: 25, created_at: 850000, unlock_at: 860000 },
    { badge_id: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', stake_percent: 15, created_at: 852000, unlock_at: 870000 },
  ],
  vouches_in: [
    { badge_id: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', stake_percent: 30, created_at: 848000, unlock_at: 865000 },
    { badge_id: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', stake_percent: 20, created_at: 849000, unlock_at: 868000 },
    { badge_id: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1', stake_percent: 10, created_at: 851000, unlock_at: 872000 },
  ],
  cascade_damage: 3,
  trust: 72,
  risk: 20,
  flags: {
    acceleration: false,
    extraction: false,
    isolated: false,
    too_clean: false,
    erratic: false,
    new_badge: false,
  },
  // Transaction flow fields
  active_transactions: [],
  reporting_transactions: [],
  outcomes: {
    mutualPositive: 12,
    mutualNegative: 1,
    contestedIPositive: 2,
    contestedINegative: 1,
    timeout: 0,
    mutualTimeout: 0,
  },
  last_nonce: '0000000000000000000000000000000000000000000000000000000000000001',
  last_update: 856000,
});

export function WalletProvider({ children, demoMode = false }: WalletProviderProps) {
  const walletHook = useWalletHook();
  

  const currentBadge = walletHook.badges[0] || (demoMode ? createDemoBadge() : undefined);
  const hasBadge = walletHook.badges.length > 0;
  
  // Memoize the connect function
  const connect = useCallback(async () => {
    await walletHook.connect();
  }, [walletHook.connect]);
  
  const value = useMemo<WalletContextValue>(() => ({
    // State
    wallet: walletHook.wallet,
    badges: walletHook.badges,
    loading: walletHook.loading,
    error: walletHook.error,
    txStatus: walletHook.txStatus,
    
    // Connection
    connect,
    disconnect: walletHook.disconnect,
    isConnected: walletHook.wallet.connected,
    
    // Badge
    currentBadge,
    hasBadge,
    mintBadge: walletHook.mintBadge,
    refreshBadges: walletHook.refreshBadges,
    
    // Operations
    recordTransaction: walletHook.recordTransaction,
    vouch: walletHook.vouch,
    unvouch: walletHook.unvouch,
  }), [
    walletHook.wallet,
    walletHook.badges,
    walletHook.loading,
    walletHook.error,
    walletHook.txStatus,
    connect,
    walletHook.disconnect,
    currentBadge,
    hasBadge,
    walletHook.mintBadge,
    walletHook.refreshBadges,
    walletHook.recordTransaction,
    walletHook.vouch,
    walletHook.unvouch,
  ]);
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}

// Alias for cleaner imports
export { useWalletContext as useWallet };
