// Test Setup for Veil Client
// ============================================================================

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Initialize ECC library for bitcoinjs-lib before any tests run
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from '@bitcoinerlab/secp256k1';

// Use a global flag to ensure ECC is only initialized once
// @ts-expect-error - global augmentation for test environment
if (!globalThis.__VEIL_ECC_INITIALIZED__) {
  try {
    bitcoin.initEccLib(ecc, { DANGER_DO_NOT_VERIFY_ECCLIB: true });
    // @ts-expect-error
    globalThis.__VEIL_ECC_INITIALIZED__ = true;
  } catch {
    // Already initialized - that's fine
  }
}

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.crypto for tests
if (!globalThis.crypto) {
  globalThis.crypto = {
    // @ts-expect-error
    subtle: {
      digest: async () => new ArrayBuffer(32),
    },
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
  };
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Export mock utilities for use in tests
export { vi };
