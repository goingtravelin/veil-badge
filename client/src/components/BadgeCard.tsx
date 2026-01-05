import React from 'react';
import {
  Shield,
  Activity,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Copy
} from 'lucide-react';
import { VeilBadge } from '../types';
import { TrustGauge } from './TrustGauge';
import { RiskFlagsDisplay } from './RiskFlags';
import { formatSats, formatBlockAge, truncateId } from '../utils/formatting';

interface BadgeCardProps {
  badge: VeilBadge;
  currentBlock: number;
  expanded?: boolean;
  onVouchClick?: () => void;
}

export function BadgeCard({ badge, currentBlock, expanded = false }: BadgeCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyId = async () => {
    await navigator.clipboard.writeText(badge.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute metrics inline
  const successRate = badge.tx_total > 0 
    ? Math.round((badge.tx_positive / badge.tx_total) * 100) 
    : 100;
  const avgValue = badge.tx_total > 0 
    ? Math.round(badge.volume_total / badge.tx_total) 
    : 0;
  const ageBlocks = currentBlock - badge.created_at;
  const networkScore = badge.vouches_in.reduce((sum, v) => sum + v.stake_percent, 0);
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Veil Badge</h3>
              <button 
                onClick={copyId}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <span className="font-mono">{truncateId(badge.id)}</span>
                <Copy className="w-3 h-3" />
                {copied && <span className="text-green-400 ml-1">Copied!</span>}
              </button>
            </div>
          </div>
          <TrustGauge trust={badge.trust} size="sm" showLabel={false} isNewBadge={badge.flags.new_badge} />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox
          icon={Activity}
          label="Transactions"
          value={badge.tx_total.toString()}
          subValue={`${successRate}% success`}
          color="blue"
        />
        <StatBox
          icon={TrendingUp}
          label="Volume"
          value={formatSats(badge.volume_total)}
          subValue={`avg ${formatSats(avgValue)}`}
          color="green"
        />
        <StatBox
          icon={Users}
          label="Network"
          value={`${networkScore}%`}
          subValue={`${badge.vouches_in.length} vouchers`}
          color="purple"
        />
        <StatBox
          icon={Clock}
          label="Age"
          value={formatBlockAge(ageBlocks)}
          subValue={`block ${badge.created_at}`}
          color="cyan"
        />
      </div>
      
      {expanded && (
        <>
          {/* Detailed Stats */}
          <div className="px-4 pb-4 border-t border-gray-800 pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Positive</span>
                </div>
                <span className="text-xl font-bold text-green-400">{badge.tx_positive}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-400">Negative</span>
                </div>
                <span className="text-xl font-bold text-red-400">{badge.tx_negative}</span>
              </div>
            </div>
            
            {/* Risk Flags */}
            <RiskFlagsDisplay flags={badge.flags} risk={badge.risk} />
          </div>
        </>
      )}
    </div>
  );
}

interface StatBoxProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subValue?: string;
  color: 'blue' | 'green' | 'purple' | 'cyan' | 'red';
}

function StatBox({ icon: Icon, label, value, subValue, color }: StatBoxProps) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    red: 'text-red-400 bg-red-500/10',
  };
  
  return (
    <div className="bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1 rounded ${colors[color]}`}>
          <Icon className={`w-3 h-3 ${colors[color].split(' ')[0]}`} />
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
      {subValue && (
        <div className="text-xs text-gray-500">{subValue}</div>
      )}
    </div>
  );
}

