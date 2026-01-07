// Login Page - Seed phrase authentication

import { Shield, Activity, Users, Loader2, Key, ArrowRight, Bell } from 'lucide-react';
import { hasSeedPhrase } from '../services/TaprootKeyService';

interface LoginPageProps {
  onConnect: () => Promise<void>;
  onGoToSettings: () => void;
  loading: boolean;
  wasmReady: boolean;
  wasmError: string | null;
  walletError: string | null;
  pendingProposal?: boolean;
}

export function LoginPage({
  onConnect,
  onGoToSettings,
  loading,
  wasmReady,
  wasmError,
  walletError,
  pendingProposal,
}: LoginPageProps) {
  const hasSeed = hasSeedPhrase();
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-purple-600 rounded-2xl mb-4">
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Veil</h1>
          <p className="text-gray-400 text-center">Anonymous Reputation Protocol</p>
        </div>

        {/* Pending Proposal Banner */}
        {pendingProposal && (
          <div className="mb-6 p-4 bg-purple-900/30 border border-purple-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/30 rounded-lg">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 font-medium">Transaction Proposal Received!</p>
                <p className="text-purple-400/70 text-sm">
                  Import your seed phrase to view and accept this proposal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* WASM Error */}
        {wasmError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">
            <strong>WASM Error:</strong> {wasmError}
            <p className="mt-2 text-xs text-gray-400">
              Try refreshing the page. If the issue persists, the site may still be deploying.
            </p>
          </div>
        )}

        {/* Error */}
        {walletError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm">
            <strong>Error:</strong> {walletError}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-2 text-center">
            {hasSeed ? 'Ready to Enter' : 'Get Started'}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            {hasSeed 
              ? 'Your seed phrase is configured. Enter Veil to start building reputation.'
              : 'Import your seed phrase to sign transactions and mint badges.'
            }
          </p>

          {/* Seed Phrase Status */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg bg-gray-800/50">
            <Key className={`w-5 h-5 ${hasSeed ? 'text-green-400' : 'text-yellow-400'}`} />
            <span className={`text-sm font-medium ${hasSeed ? 'text-green-400' : 'text-yellow-400'}`}>
              {hasSeed ? '✓ Seed phrase configured' : 'Seed phrase required'}
            </span>
          </div>

          {hasSeed ? (
            // Has seed phrase - show Enter button
            <button
              onClick={onConnect}
              disabled={loading || !wasmReady}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entering...
                </>
              ) : !wasmReady ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Enter Veil
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            // No seed phrase - show Import button
            <button
              onClick={onGoToSettings}
              disabled={!wasmReady}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
            >
              {!wasmReady ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Import Seed Phrase
                </>
              )}
            </button>
          )}

          {hasSeed && (
            <button
              onClick={onGoToSettings}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-400 transition-colors"
            >
              Manage Seed Phrase
            </button>
          )}

          <p className="text-gray-500 text-xs mt-4 text-center">
            Your seed phrase is stored locally and used to sign transactions.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-8 space-y-3">
          <FeatureItem
            icon={Shield}
            title="Anonymous Reputation"
            description="Build trust without revealing your identity"
          />
          <FeatureItem
            icon={Activity}
            title="Private Transactions"
            description="Record deals with zero-knowledge proofs"
          />
          <FeatureItem
            icon={Users}
            title="Vouch Network"
            description="Stake your reputation on trusted peers"
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
      <div>
        <div className="text-white font-medium">{title}</div>
        <div className="text-gray-500">{description}</div>
      </div>
    </div>
  );
}
