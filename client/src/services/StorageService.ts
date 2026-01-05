// Minimal storage service for burned UTXO tracking

import { IStoragePort } from '../application/ports';

const BURNED_UTXOS_KEY = 'veil_burned_utxos';

class LocalStorageService implements IStoragePort {
  getBurnedUtxos(): { utxoId: string; burnedAt: number }[] {
    try {
      const stored = localStorage.getItem(BURNED_UTXOS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addBurnedUtxo(utxoId: string): void {
    const burned = this.getBurnedUtxos();
    if (!burned.some(b => b.utxoId === utxoId)) {
      burned.push({ utxoId, burnedAt: Date.now() });
      localStorage.setItem(BURNED_UTXOS_KEY, JSON.stringify(burned));
    }
  }

  isUtxoBurned(utxoId: string): boolean {
    return this.getBurnedUtxos().some(b => b.utxoId === utxoId);
  }
}

export const storageService = new LocalStorageService();

export function createStorageService(): IStoragePort {
  return new LocalStorageService();
}
