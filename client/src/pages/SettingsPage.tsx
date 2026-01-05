import { Settings, Github, ExternalLink, Wallet, LogOut, ArrowLeft } from 'lucide-react';
import { WalletState } from '../types';
import { SeedPhraseManager } from '../components/SeedPhraseManager';

interface SettingsPageProps {
  wallet: WalletState;
  loading?: boolean;
  wasmReady?: boolean;
  wasmError?: string | null;
  onConnect?: () => Promise<void>;
  onDisconnect: () => void;
  onRefreshUtxos?: () => Promise<void>;
  onBack?: () => void;
  onSeedPhraseChange?: (hasSeed: boolean) => void;
}

export function SettingsPage({
  wallet,
  onDisconnect,
  onBack,
  onSeedPhraseChange,
}: SettingsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>
      
      <div className="max-w-2xl space-y-4">
        {/* Seed Phrase Manager */}
        <SeedPhraseManager 
          onSeedPhraseChange={onSeedPhraseChange}
          isTestnet={wallet.network !== 'mainnet'}
          walletAddress={wallet.address || undefined}
        />

        {/* Wallet Info */}
        {wallet.connected && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-medium text-white mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connected Wallet
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Address</span>
                <p className="text-sm text-gray-300 font-mono break-all mt-1">
                  {wallet.address}
                </p>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Network</span>
                <p className="text-sm text-gray-300 mt-1 capitalize">
                  {wallet.network || 'testnet4'}
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">UTXOs</span>
                <p className="text-sm text-gray-300 mt-1">
                  {wallet.utxos?.length || 0} available
                </p>
              </div>

              <button
                onClick={onDisconnect}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors mt-4"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-medium text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            About Veil Badge
          </h3>
          
          <p className="text-sm text-gray-400 mb-4">
            Privacy-preserving reputation on Bitcoin. Build trust without revealing your identity.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/goingtravelin/veil-badge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <a
              href="https://charms.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
            >
              Charms Protocol
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
