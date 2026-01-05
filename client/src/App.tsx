import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Shield,
  Activity,
  Users,
  Settings,
  Wallet,
  Menu,
  X,
  RefreshCw,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useCharmsWasm } from './hooks/useCharmsWasm';
import { useWallet, getCurrentBlockHeight } from './hooks/useWallet';
import { WalletFlyout } from './components';
import { emptyBackingAggregates } from './utils/backing';
import { WalletState } from './types';
import { createLogger } from './utils/logger';

const logger = createLogger('App');
import {
  LoginPage,
  DashboardPage,
  TransactionsPage,
  VouchPage,
  NetworkPage,
  SettingsPage,
} from './pages';

// Demo mode - defaults to false if not configured
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const USE_MOCK_PROVER = import.meta.env.VITE_USE_MOCK_PROVER === 'true';

type View = 'dashboard' | 'transactions' | 'vouch' | 'network' | 'settings';

const NAV_ITEMS: { id: View; icon: React.FC<{ className?: string }>; label: string }[] = [
  { id: 'dashboard', icon: Shield, label: 'Dashboard' },
  { id: 'transactions', icon: Activity, label: 'Transactions' },
  { id: 'vouch', icon: Users, label: 'Vouch' },
  { id: 'network', icon: RefreshCw, label: 'Network' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

// Check for proposal in URL on page load
function getInitialView(): View {
  const search = window.location.search;
  
  // Check if URL contains proposal param
  if (search.includes('proposal=')) {
    return 'transactions';
  }
  return 'dashboard';
}

function App() {
  // View state - initialize based on URL for deep links
  const [view, setView] = useState<View>(getInitialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Block height
  const [currentBlock, setCurrentBlock] = useState(0);

  // Only auto-init WASM if not using mock prover (mock prover doesn't need CharmsService WASM)
  const { wasmReady, wasmError, initWasm } = useCharmsWasm(!USE_MOCK_PROVER);

  // Wallet hook
  const {
    wallet,
    connect,
    disconnect,
    badges,
    badgeUtxos,
    refreshBadges,
    refreshUtxos,
    mintBadge,
    signMessage,
    error: walletError,
    loading: walletLoading,
    txStatus,
    successMessage,
    clearSuccess,
  } = useWallet();
  

  const demoBadge = useMemo(() => {
    if (!DEMO_MODE || badges.length > 0) return null;

    return {
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
    };
  }, [badges.length]);

  const badge = badges[0] || demoBadge || undefined;
  const hasBadge = badges.length > 0 || (DEMO_MODE && demoBadge !== null);
  const isDemo = DEMO_MODE && badges.length === 0;
  
  // Fetch block height
  useEffect(() => {
    async function fetchBlock() {
      try {
        const height = await getCurrentBlockHeight(wallet.network);
        setCurrentBlock(height);
      } catch (err) {
        logger.warn('[App] Failed to fetch block height, will retry:', err);
        // Don't show error to user - will retry on next interval
      }
    }
    fetchBlock();
    const interval = setInterval(fetchBlock, 60000);
    return () => clearInterval(interval);
  }, [wallet.network]);
  
  // Refresh badges on connect
  useEffect(() => {
    if (wallet.connected) {
      refreshBadges();
    }
  }, [wallet.connected, refreshBadges]);

  useEffect(() => {
    if (wallet.connected && !hasBadge && !isDemo && view !== 'dashboard') {
      setView('dashboard');
    }
  }, [wallet.connected, hasBadge, isDemo, view]);

  // Handlers
  const handleConnect = useCallback(async () => {

    // Only init WASM if not using mock prover and not in demo mode
    if (!DEMO_MODE && !USE_MOCK_PROVER && !wasmReady) {
      await initWasm();
    }

    // Use seed phrase mode - no browser wallet needed
    await connect('seed');
  }, [connect, initWasm, wasmReady]);

  // Not connected - show login or settings
  if (!wallet.connected) {
    // Allow settings view for seed phrase setup before connecting
    if (view === 'settings') {
      return (
        <div className="min-h-screen bg-gray-950 text-white p-4">
          <div className="max-w-2xl mx-auto">
            <SettingsPage
              wallet={wallet}
              badge={badge}
              loading={walletLoading}
              wasmReady={USE_MOCK_PROVER ? true : wasmReady}
              wasmError={DEMO_MODE || USE_MOCK_PROVER ? null : wasmError}
              onConnect={handleConnect}
              onDisconnect={disconnect}
              onBack={() => setView('dashboard')}
              onSeedPhraseChange={() => {}}
            />
          </div>
        </div>
      );
    }
    
    return (
      <LoginPage
        onConnect={handleConnect}
        onGoToSettings={() => setView('settings')}
        loading={walletLoading}
        wasmReady={USE_MOCK_PROVER ? true : wasmReady}
        wasmError={DEMO_MODE || USE_MOCK_PROVER ? null : wasmError}
        walletError={DEMO_MODE ? null : walletError}
        isDemo={DEMO_MODE}
      />
    );
  }
  
  // Render current page
  const renderPage = () => {
    switch (view) {
      case 'dashboard':
        return (
          <DashboardPage
            wallet={wallet}
            badge={badge}
            currentBlock={currentBlock}
            loading={walletLoading}
            isDemo={isDemo}
            onMintBadge={mintBadge}
            onConnect={handleConnect}
          />
        );
      case 'transactions': {
        if (!badge) {
          return (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Badge Found</h3>
              <p className="text-gray-400 mb-4">
                You need a Veil Badge to record transactions. Go to the Dashboard to mint your badge.
              </p>
              <button
                onClick={() => setView('dashboard')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          );
        }
        
        // Get the UTXO for this badge, or create a mock one for demo mode
        const myBadgeUtxo = badgeUtxos.get(badge.id) || (DEMO_MODE ? {
          txid: '0000000000000000000000000000000000000000000000000000000000000001',
          vout: 0,
          value: 10000,
          scriptPubKey: '',
        } : undefined);
        
        if (!myBadgeUtxo) {
          logger.warn('[App] No UTXO found for badge', badge.id);
          return (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-600/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading Badge Data</h3>
              <p className="text-gray-400 mb-4">
                Looking for your badge's UTXO on the blockchain...
              </p>
              <button
                onClick={() => refreshBadges()}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          );
        }
        
        return (
          <TransactionsPage
            myBadge={badge}
            myBadgeId={badge.id}
            myBadgeUtxo={myBadgeUtxo}
            availableUtxos={wallet.utxos}
            myAddress={wallet.address || ''}
            network={wallet.network}
            currentBlock={currentBlock}
            signMessage={DEMO_MODE ? async (_message: string) => {
              return '0'.repeat(128); // Mock 64-byte signature for demo
            } : signMessage}
            onBadgeUpdate={(updatedBadge) => {
              logger.debug('[App] Badge updated:', updatedBadge.id);
              refreshBadges();
            }}
          />
        );
      }
      case 'vouch':
        return <VouchPage />;
      case 'network':
        return <NetworkPage />;
      case 'settings':
        return (
          <SettingsPage
            wallet={wallet}
            badge={badge}
            loading={walletLoading}
            wasmReady={USE_MOCK_PROVER ? true : wasmReady}
            wasmError={USE_MOCK_PROVER ? null : wasmError}
            onConnect={handleConnect}
            onDisconnect={disconnect}
            onRefreshUtxos={refreshUtxos}
            onSeedPhraseChange={() => {}}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <Header
        view={view}
        setView={setView}
        currentBlock={currentBlock}
        wallet={wallet}
        walletLoading={walletLoading}
        hasBadge={hasBadge}
        isDemo={isDemo}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onConnect={handleConnect}
        onDisconnect={disconnect}
      />
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        {isDemo && (
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl text-yellow-300 flex items-center gap-3">
            <span className="text-2xl"></span>
            <div>
              <strong>Demo Mode</strong>
            </div>
          </div>
        )}
        
        {/* Error Banner */}
        {walletError && !wallet.connected && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400">
            <strong>Error:</strong> {walletError}
          </div>
        )}
        
        {/* Success Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl text-green-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
            <button 
              onClick={clearSuccess}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Status Banner */}
        {txStatus && (
          <div className="mb-6 p-4 bg-purple-900/30 border border-purple-700 rounded-xl text-purple-300 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            {txStatus}
          </div>
        )}
        
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Veil Protocol - Built with Charms on Bitcoin</p>
          <p className="mt-1 text-xs">Prove everything. Reveal nothing.</p>
        </div>
      </footer>
    </div>
  );
}

interface HeaderProps {
  view: View;
  setView: (view: View) => void;
  currentBlock: number;
  wallet: WalletState;
  walletLoading: boolean;
  hasBadge: boolean;
  isDemo: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
}

function Header({
  view,
  setView,
  currentBlock,
  wallet,
  walletLoading,
  hasBadge,
  isDemo,
  mobileMenuOpen,
  setMobileMenuOpen,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  const [walletFlyoutOpen, setWalletFlyoutOpen] = useState(false);

  const getNavButtonClass = (id: View) => {
    const base = 'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors';
    return view === id
      ? `${base} bg-purple-600 text-white`
      : `${base} text-gray-400 hover:text-white hover:bg-gray-800`;
  };

  const getMobileNavButtonClass = (id: View) => {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors';
    return view === id
      ? `${base} bg-purple-600 text-white`
      : `${base} text-gray-400 hover:text-white hover:bg-gray-800`;
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Veil</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Anonymous Reputation</p>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {(hasBadge || isDemo) && NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={getNavButtonClass(id)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
          {!hasBadge && !isDemo && (
            <div className="text-sm text-gray-500 px-4">
              Mint a badge to unlock all features
            </div>
          )}
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Block height */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-400">Block</span>
            <span className="font-mono text-white">{currentBlock.toLocaleString()}</span>
          </div>
          
          {/* Wallet status */}
          {wallet.connected ? (
            <div className="relative">
              <button
                onClick={() => setWalletFlyoutOpen(!walletFlyoutOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-900/50 border border-green-700 rounded-lg hover:bg-green-900/70 transition-colors cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 hidden sm:inline">
                  {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-4)}
                </span>
                <span className="text-sm text-green-400 sm:hidden">Connected</span>
              </button>
              {walletFlyoutOpen && (
                <WalletFlyout
                  wallet={wallet}
                  onDisconnect={onDisconnect}
                  onClose={() => setWalletFlyoutOpen(false)}
                />
              )}
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={walletLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 rounded-lg transition-colors"
            >
              {walletLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              <span className="text-sm font-medium hidden sm:inline">
                {walletLoading ? 'Connecting...' : 'Connect'}
              </span>
            </button>
          )}
          
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 p-4">
          {(hasBadge || isDemo) ? (
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => { setView(id); setMobileMenuOpen(false); }}
                  className={getMobileNavButtonClass(id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              Mint a badge to unlock all features
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export { App };
