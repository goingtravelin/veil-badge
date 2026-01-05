interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs = 60000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  // Simple get - returns undefined if not cached or expired
  get(key: string): T | undefined;
  // Get with async loader - fetches if not cached
  get<R extends T>(key: string, loader: () => Promise<R>, ttlMs?: number): Promise<R>;
  get<R extends T>(key: string, loader?: () => Promise<R>, ttlMs?: number): T | undefined | Promise<R> {
    const entry = this.cache.get(key);
    
    // Check if we have a valid cached entry
    if (entry && Date.now() <= entry.expiresAt) {
      if (loader) {
        return Promise.resolve(entry.value as R);
      }
      return entry.value;
    }
    
    // If no loader, just return undefined
    if (!loader) {
      if (entry) this.cache.delete(key);
      return undefined;
    }
    
    // Fetch via loader and cache
    return loader().then((value) => {
      this.set(key, value, ttlMs);
      return value;
    });
  }

  set(key: string, value: T, ttlMs?: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Export cache instances used by services
export const utxoCache = new SimpleCache<UtxoInfo[]>(30000); // 30 seconds
export const txCache = new SimpleCache<string>(300000); // 5 minutes
export const blockHeightCache = new SimpleCache<number>(10000); // 10 seconds
export const addressInfoCache = new SimpleCache<AddressInfo>(60000); // 1 minute

// Types needed for cache
import type { UtxoInfo } from '../application/ports';

interface AddressInfo {
  address: string;
  pubkey: string;
  scriptPubKey?: string;
}
