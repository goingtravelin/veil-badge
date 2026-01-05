import { CONSTANTS } from '../domain/types';
import type { VeilBadge } from '../domain/types';

export function formatSats(sats: number): string {
  if (sats >= 100_000_000) {
    return `${(sats / 100_000_000).toFixed(4)} BTC`;
  } else if (sats >= 1_000_000) {
    return `${(sats / 1_000_000).toFixed(2)}M sats`;
  } else if (sats >= 1_000) {
    return `${(sats / 1_000).toFixed(1)}k sats`;
  }
  return `${sats} sats`;
}

export function formatBlockAge(blocks: number): string {
  const days = blocks / 144;
  if (days < 1) {
    const hours = Math.round(blocks / 6);
    return `${hours}h`;
  } else if (days < 30) {
    return `${Math.round(days)}d`;
  } else if (days < 365) {
    return `${Math.round(days / 30)}mo`;
  }
  return `${(days / 365).toFixed(1)}y`;
}

export function truncateId(id: string, chars: number = 8): string {
  if (id.length <= chars * 2 + 2) return id;
  return `${id.slice(0, chars)}...${id.slice(-chars)}`;
}

export function getTrustLevel(trust: number, isNewBadge?: boolean): 'new' | 'critical' | 'low' | 'medium' | 'high' | 'excellent' {
  const { CRITICAL_MAX, LOW_MAX, MEDIUM_MAX, HIGH_MAX } = CONSTANTS.TRUST_LEVELS;

  if (isNewBadge && trust < CRITICAL_MAX) return 'new';

  if (trust < CRITICAL_MAX) return 'critical';
  if (trust < LOW_MAX) return 'low';
  if (trust < MEDIUM_MAX) return 'medium';
  if (trust < HIGH_MAX) return 'high';
  return 'excellent';
}

export function getRiskLevel(risk: number): 'minimal' | 'low' | 'moderate' | 'high' | 'critical' {
  const { MINIMAL_MAX, LOW_MAX, MODERATE_MAX, HIGH_MAX } = CONSTANTS.RISK_LEVELS;
  if (risk < MINIMAL_MAX) return 'minimal';
  if (risk < LOW_MAX) return 'low';
  if (risk < MODERATE_MAX) return 'moderate';
  if (risk < HIGH_MAX) return 'high';
  return 'critical';
}

export function badgeToJson(badge: VeilBadge): string {
  return JSON.stringify(badge, (_key, value) => {
    // Convert BigInt to string for JSON serialization
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
}

export function badgeFromJson(json: string): VeilBadge {
  const parsed = JSON.parse(json);

  // Restore BigInt field
  if (parsed.volume_sum_squares !== undefined) {
    parsed.volume_sum_squares = BigInt(parsed.volume_sum_squares);
  }

  return parsed as VeilBadge;
}
