

import { createLogger } from './logger';
import { VEIL_APP_VK } from '../domain/charm';

const logger = createLogger('AppBinary');

const WASM_VERSION = '2026-01-06-migration';

let cachedBinaries: Map<string, string> = new Map();

export function clearBinaryCache(): void {
  cachedBinaries.clear();
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

  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
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
