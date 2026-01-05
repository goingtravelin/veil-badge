

import { createLogger } from './logger';

const logger = createLogger('AppBinary');

const WASM_VERSION = '2026-01-05-vk-fix';

let cachedBinary: string | null = null;

// Force clear on module load to ensure fresh binary
cachedBinary = null;

export function clearBinaryCache(): void {
  cachedBinary = null;
}

export async function loadVeilAppBinary(forceReload = false): Promise<string> {
  if (forceReload) {
    clearBinaryCache();
  }

  if (cachedBinary) {
    return cachedBinary;
  }

  try {
    // Add version parameter to invalidate cache when WASM changes
    const response = await fetch(`${import.meta.env.BASE_URL}charms/veil.wasm?v=${WASM_VERSION}`, {
      cache: 'no-store', // Disable HTTP cache
    });
    if (!response.ok) {
      throw new Error(`Failed to load app binary: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    logger.info(`[AppBinary] Loaded WASM: ${bytes.length} bytes, first 4 bytes: ${bytes[0]},${bytes[1]},${bytes[2]},${bytes[3]}`);

    // Convert to base64 in chunks to avoid stack overflow
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    const base64 = btoa(binary);

    cachedBinary = base64;
    return base64;
  } catch (error) {
    logger.error('[AppBinary] Failed to load Veil app binary:', error);
    throw new Error('Failed to load Charms app binary. Ensure veil.wasm is in public/charms/');
  }
}

export async function getVeilAppBinaries(vk: string): Promise<Record<string, string>> {
  const binaryBase64 = await loadVeilAppBinary();

  return {
    [vk]: binaryBase64,
  };
}
