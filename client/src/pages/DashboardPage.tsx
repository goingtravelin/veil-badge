// Dashboard Page - Main badge view and onboarding

import { Shield, Loader2, Plus, Activity, Users } from 'lucide-react';
import { VeilBadge, WalletState } from '../types';
import { BadgeCard, TrustGauge } from '../components';

interface DashboardPageProps {
  wallet: WalletState;
  badge?: VeilBadge;
  currentBlock: number;
  loading: boolean;
  onMintBadge: () => Promise<string>;
  onConnect: () => Promise<void>;
}

export function DashboardPage({
  wallet,
  badge,
  currentBlock,
  loading,
  onMintBadge,
}: DashboardPageProps) {
  const hasBadge = badge !== undefined;

  // No badge - show onboarding
  if (!hasBadge) {
    return <OnboardingView 
      wallet={wallet}
      loading={loading}
      onMintBadge={onMintBadge}
    />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Badge</h2>
      </div>

      {badge && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BadgeCard badge={badge} currentBlock={currentBlock} expanded />
          </div>
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Trust Score</h3>
              <div className="flex justify-center">
                <TrustGauge trust={badge.trust} size="lg" isNewBadge={badge.flags.new_badge} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENTS

interface OnboardingViewProps {
  wallet: WalletState;
  loading: boolean;
  onMintBadge: () => Promise<string>;
}

function OnboardingView({ wallet, loading, onMintBadge }: OnboardingViewProps) {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome to Veil</h2>
        <p className="text-gray-400">Create your anonymous reputation badge to get started</p>
      </div>

      {/* Mint Badge CTA */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-purple-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Mint Your Badge</h3>
          <p className="text-gray-300">
            Your badge is your anonymous identity on Veil. It tracks your reputation without revealing your transaction history.
          </p>
        </div>

        <button
          onClick={onMintBadge}
          disabled={loading || wallet.utxos.length === 0}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-xl font-medium transition-colors text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Minting Badge...
            </>
          ) : (
            <>
              <Plus className="w-6 h-6" />
              Mint Badge (546 sats)
            </>
          )}
        </button>

        {wallet.utxos.length === 0 && (
          <p className="text-yellow-400 text-sm mt-4 text-center">
            ⚠️ No UTXOs found. Fund your wallet with testnet4 bitcoin first.
          </p>
        )}
      </div>

      {/* What You Get */}
      <FeatureGrid />
    </>
  );
}

function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
      <FeatureCard
        icon={Activity}
        title="Record Transactions"
        description="Build reputation through private transaction records"
        color="purple"
      />
      <FeatureCard
        icon={Users}
        title="Vouch Network"
        description="Stake reputation on trusted peers and earn network bonuses"
        color="cyan"
      />
      <FeatureCard
        icon={Shield}
        title="Anonymous Trust"
        description="Prove your reputation without revealing your history"
        color="green"
      />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  color: 'purple' | 'cyan' | 'green';
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const colorClass = {
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    green: 'text-green-400',
  }[color];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
      <Icon className={`w-8 h-8 ${colorClass} mx-auto mb-3`} />
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
