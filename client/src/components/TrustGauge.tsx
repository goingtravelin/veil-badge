import React from 'react';
import { getTrustLevel } from '../utils/formatting';

interface TrustGaugeProps {
  trust: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  isNewBadge?: boolean;
}

const sizeConfig = {
  sm: { width: 80, strokeWidth: 6, fontSize: 'text-lg' },
  md: { width: 120, strokeWidth: 8, fontSize: 'text-2xl' },
  lg: { width: 160, strokeWidth: 10, fontSize: 'text-4xl' },
};

const levelColors = {
  new: { stroke: '#8b5cf6', bg: 'bg-purple-500/10', text: 'text-purple-500' },
  critical: { stroke: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-500' },
  low: { stroke: '#f97316', bg: 'bg-orange-500/10', text: 'text-orange-500' },
  medium: { stroke: '#eab308', bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
  high: { stroke: '#22c55e', bg: 'bg-green-500/10', text: 'text-green-500' },
  excellent: { stroke: '#06b6d4', bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
};

export const TrustGauge = React.memo(function TrustGauge({ trust, size = 'md', showLabel = true, isNewBadge = false }: TrustGaugeProps) {
  const config = sizeConfig[size];
  const level = getTrustLevel(trust, isNewBadge);
  const colors = levelColors[level];
  
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (trust / 100) * circumference;
  const offset = circumference - progress;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={config.width} height={config.width}>
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-gray-700"
          />
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.fontSize} ${colors.text}`}>
            {trust}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${colors.bg} ${colors.text}`}>
          {level}
        </div>
      )}
    </div>
  );
});

