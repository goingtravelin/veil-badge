

import { createLogger } from './logger';
import { VEIL_APP_VK } from '../domain/charm';

const logger = createLogger('AppBinary');

const WASM_VERSION = '2026-01-06-migration';

let cachedBinaries: Map<string, string> = new Map();

export function clearBinaryCache(): void {
  cachedBinaries.clear();
}

/**
 * Convert Uint8Array to base64 string safely.
 * Uses a chunked approach to avoid stack overflow with large arrays.
 */
function uint8ArrayToBase64(bytes: Uint8Array): string {
  // Use smaller chunks to avoid call stack issues with spread operator
  const CHUNK_SIZE = 1024;
  let binary = '';
  
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    // Convert each byte individually to avoid spread operator issues
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  
  return btoa(binary);
}

async function loadWasmBinary(path: string): Promise<string> {
  const response = await fetch(`${import.meta.env.BASE_URL}${path}?v=${WASM_VERSION}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to load WASM binary: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  logger.info(`[AppBinary] Loaded WASM: ${bytes.length} bytes, first 4 bytes: ${bytes[0]},${bytes[1]},${bytes[2]},${bytes[3]}`);

  // Verify WASM magic number (0x00 0x61 0x73 0x6d = "\0asm")
  if (bytes.length < 4 || bytes[0] !== 0x00 || bytes[1] !== 0x61 || bytes[2] !== 0x73 || bytes[3] !== 0x6d) {
    logger.error(`[AppBinary] Invalid WASM file - bad magic number: ${bytes[0]},${bytes[1]},${bytes[2]},${bytes[3]}`);
    throw new Error('Invalid WASM file: missing magic number. File may be corrupted or wrong format.');
  }

  const base64 = uint8ArrayToBase64(bytes);
  
  // Log base64 info for debugging
  logger.info(`[AppBinary] Base64 encoded: ${base64.length} chars, starts with: ${base64.substring(0, 20)}`);
  
  return base64;
}

export async function loadVeilAppBinary(forceReload = false): Promise<string> {
  if (forceReload) {
    cachedBinaries.delete(VEIL_APP_VK);
  }

  const cached = cachedBinaries.get(VEIL_APP_VK);
  if (cached) {
    return cached;
  }

  try {
    const base64 = await loadWasmBinary('wasm/veil.wasm');
    cachedBinaries.set(VEIL_APP_VK, base64);
    return base64;
  } catch (error) {
    logger.error('[AppBinary] Failed to load Veil app binary:', error);
    throw new Error('Failed to load Charms app binary. Ensure veil.wasm is in public/wasm/');
  }
}

export async function loadBinaryForVk(vk: string): Promise<string> {
  const cached = cachedBinaries.get(vk);
  if (cached) {
    return cached;
  }

  if (vk === VEIL_APP_VK) {
    return loadVeilAppBinary();
  }

  // For old VKs, try to load from versioned path
  // Old binaries should be stored as: public/wasm/veil-{vk-prefix}.wasm
  const vkPrefix = vk.slice(0, 16);
  const oldWasmPath = `wasm/veil-${vkPrefix}.wasm`;
  
  try {
    const base64 = await loadWasmBinary(oldWasmPath);
    cachedBinaries.set(vk, base64);
    return base64;
  } catch (error) {
    logger.error(`[AppBinary] Failed to load old WASM for VK ${vkPrefix}:`, error);
    throw new Error(`Old WASM binary not found for VK ${vkPrefix}. Store it at public/${oldWasmPath}`);
  }
}

export async function getVeilAppBinaries(vk: string): Promise<Record<string, string>> {
  const binaryBase64 = await loadBinaryForVk(vk);
  return {
    [vk]: binaryBase64,
  };
}

export async function getBinariesForMultipleVks(vks: string[]): Promise<Record<string, string>> {
  const binaries: Record<string, string> = {};
  
  for (const vk of vks) {
    binaries[vk] = await loadBinaryForVk(vk);
  }
  
  return binaries;
}
