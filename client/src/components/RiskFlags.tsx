import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Wallet,
  Users,
  Sparkles,
  Activity,
  Clock
} from 'lucide-react';
import { RiskFlags as RiskFlagsType, RISK_WEIGHTS } from '../types';
import { getRiskLevel } from '../utils/formatting';

interface RiskFlagsProps {
  flags: RiskFlagsType;
  risk: number;
  compact?: boolean;
}

const flagConfig = {
  acceleration: {
    icon: TrendingUp,
    label: 'Acceleration',
    description: 'Recent activity velocity exceeds historical average by 3x',
    weight: RISK_WEIGHTS.acceleration,
  },
  extraction: {
    icon: Wallet,
    label: 'Extraction',
    description: 'Proposed value exceeds 10x average transaction',
    weight: RISK_WEIGHTS.extraction,
  },
  isolated: {
    icon: Users,
    label: 'Isolated',
    description: 'Low network score from incoming vouches',
    weight: RISK_WEIGHTS.isolated,
  },
  too_clean: {
    icon: Sparkles,
    label: 'Too Clean',
    description: 'High transaction count with zero negative outcomes',
    weight: RISK_WEIGHTS.too_clean,
  },
  erratic: {
    icon: Activity,
    label: 'Erratic',
    description: 'High variance in transaction values (CV > 2.0)',
    weight: RISK_WEIGHTS.erratic,
  },
  new_badge: {
    icon: Clock,
    label: 'New Badge',
    description: 'Account age less than 90 days',
    weight: RISK_WEIGHTS.new_badge,
  },
};

const riskColors = {
  minimal: 'text-green-400 bg-green-500/10 border-green-500/20',
  low: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  moderate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export const RiskFlagsDisplay = React.memo(function RiskFlagsDisplay({ flags, risk, compact = false }: RiskFlagsProps) {
  const riskLevel = getRiskLevel(risk);
  const activeFlags = Object.entries(flags).filter(([_, active]) => active);
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md border ${riskColors[riskLevel]}`}>
          <AlertTriangle className="w-3 h-3" />
          <span className="text-xs font-medium">{risk}</span>
        </div>
        <div className="flex gap-1">
          {activeFlags.map(([key]) => {
            const config = flagConfig[key as keyof RiskFlagsType];
            const Icon = config.icon;
            return (
              <div
                key={key}
                className="p-1 rounded bg-gray-800 text-gray-400"
                title={config.label}
              >
                <Icon className="w-3 h-3" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {/* Risk Score Header */}
      <div className={`flex items-center justify-between p-3 rounded-lg border ${riskColors[riskLevel]}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Risk Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{risk}</span>
          <span className="text-xs uppercase tracking-wide opacity-75">{riskLevel}</span>
        </div>
      </div>
      
      {/* Flag Grid */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(flagConfig).map(([key, config]) => {
          const active = flags[key as keyof RiskFlagsType];
          const Icon = config.icon;
          
          return (
            <div
              key={key}
              className={`
                p-3 rounded-lg border transition-all
                ${active 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-500'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                <span className="text-xs opacity-75">+{config.weight}</span>
              </div>
              <p className="text-xs opacity-60 line-clamp-2">
                {config.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

