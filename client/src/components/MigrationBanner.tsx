// Migration Banner Component
// Displays a warning when a badge needs to be migrated to the current VK version

import { AlertTriangle, ArrowRight } from 'lucide-react';
import { badgeNeedsMigration, VEIL_APP_VK } from '../domain/charm';

interface MigrationBannerProps {
  /** The verification key of the badge */
  badgeVk?: string;
  /** Callback when user clicks migrate button */
  onMigrate?: () => void;
  /** Optional custom message */
  message?: string;
  /** Whether to show compact version */
  compact?: boolean;
}

export function MigrationBanner({
  badgeVk,
  onMigrate,
  message,
  compact = false,
}: MigrationBannerProps) {
  // Don't show if no VK or badge doesn't need migration
  if (!badgeVk || !badgeNeedsMigration(badgeVk)) {
    return null;
  }

  const defaultMessage = compact
    ? 'Badge migration required'
    : 'Your badge is on an older version. Please migrate to continue using all features.';

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>{message || defaultMessage}</span>
        {onMigrate && (
          <button
            onClick={onMigrate}
            className="ml-auto flex items-center gap-1 px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded text-amber-400 text-xs font-medium transition-colors"
          >
            Migrate <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-400 mb-1">Migration Required</h3>
          <p className="text-sm text-gray-400 mb-3">
            {message || defaultMessage}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 text-xs text-gray-500">
            <span>Your badge VK: <code className="font-mono">{badgeVk.slice(0, 16)}...</code></span>
            <span className="hidden sm:inline">→</span>
            <span>Current VK: <code className="font-mono">{VEIL_APP_VK.slice(0, 16)}...</code></span>
          </div>

          {onMigrate && (
            <button
              onClick={onMigrate}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
            >
              Migrate Badge <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MigrationBanner;
