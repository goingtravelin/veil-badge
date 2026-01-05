import { createEmptyBackingAggregates } from '../domain/types';
import type { BackingAggregates } from '../domain/types';

export type { BackingAggregates };

export function emptyBackingAggregates(): BackingAggregates {
  return createEmptyBackingAggregates();
}
