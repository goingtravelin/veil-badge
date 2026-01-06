// Mock Factories for Test Dependencies
// ============================================================================

import { vi } from 'vitest';
import type {
  IBitcoinPort,
  IProverPort,
  ICryptoPort,
  IStoragePort,
} from '../src/application/ports';
import { TEST_ADDRESSES, TEST_CURRENT_BLOCK } from './fixtures';

// Create mock Bitcoin port
export function createMockBitcoinPort(overrides: Partial<IBitcoinPort> = {}): IBitcoinPort {
  return {
    fetchUtxos: vi.fn().mockResolvedValue([]),
    fetchTransaction: vi.fn().mockResolvedValue('0200000001...'),
    broadcast: vi.fn().mockResolvedValue('c'.repeat(64)),
    getCurrentBlockHeight: vi.fn().mockResolvedValue(TEST_CURRENT_BLOCK),
    ...overrides,
  };
}

// Create mock Prover port
export function createMockProverPort(overrides: Partial<IProverPort> = {}): IProverPort {
  return {
    prove: vi.fn().mockResolvedValue({
      success: true,
      commitTx: '02000000commit...',
      spellTx: '02000000spell...',
      isMock: true,
    }),
    isAvailable: vi.fn().mockResolvedValue(true),
    ...overrides,
  };
}

// Create mock Crypto port
export function createMockCryptoPort(overrides: Partial<ICryptoPort> = {}): ICryptoPort {
  return {
    sha256Hex: vi.fn().mockResolvedValue('0'.repeat(64)),
    generateNonce: vi.fn().mockResolvedValue('nonce_' + '0'.repeat(58)),
    generateBadgeId: vi.fn().mockResolvedValue('badge_' + '0'.repeat(58)),
    ...overrides,
  };
}

// Create mock Storage port
export function createMockStoragePort(overrides: Partial<IStoragePort> = {}): IStoragePort {
  const burnedUtxos: { utxoId: string; burnedAt: number }[] = [];
  
  return {
    getBurnedUtxos: vi.fn().mockImplementation(() => burnedUtxos),
    addBurnedUtxo: vi.fn().mockImplementation((utxoId: string) => {
      burnedUtxos.push({ utxoId, burnedAt: Date.now() });
    }),
    isUtxoBurned: vi.fn().mockImplementation((utxoId: string) =>
      burnedUtxos.some(u => u.utxoId === utxoId)
    ),
    ...overrides,
  };
}

// Create full mock context for acceptProposal
export function createMockAcceptContext(overrides: {
  bitcoin?: Partial<IBitcoinPort>;
  prover?: Partial<IProverPort>;
  crypto?: Partial<ICryptoPort>;
  storage?: Partial<IStoragePort>;
  network?: 'mainnet' | 'testnet4' | 'signet' | 'regtest';
  onProgress?: (msg: string) => void;
} = {}) {
  const progressMessages: string[] = [];
  
  return {
    bitcoin: createMockBitcoinPort(overrides.bitcoin),
    prover: createMockProverPort(overrides.prover),
    crypto: createMockCryptoPort(overrides.crypto),
    storage: createMockStoragePort(overrides.storage),
    network: overrides.network ?? 'testnet4' as const,
    onProgress: overrides.onProgress ?? ((msg: string) => progressMessages.push(msg)),
    progressMessages,
  };
}

// Mock CharmsService for badge scanning
export function createMockCharmsService() {
  return {
    scanUtxoForBadge: vi.fn(),
    scanAddressForBadges: vi.fn(),
    isAvailable: vi.fn().mockReturnValue(true),
  };
}
