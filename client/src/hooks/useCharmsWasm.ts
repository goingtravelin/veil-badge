// Hook for lazy WASM initialization

import { useState, useEffect, useCallback } from 'react';
import { charmsService } from '../services/CharmsService';
import { createLogger } from '../utils/logger';

const logger = createLogger('useCharmsWasm');

interface UseCharmsWasmResult {
  wasmReady: boolean;
  wasmError: string | null;
  initWasm: () => Promise<void>;
}

export function useCharmsWasm(autoInit = false): UseCharmsWasmResult {
  const [wasmReady, setWasmReady] = useState(false);
  const [wasmError, setWasmError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initWasm = useCallback(async () => {
    // Already ready - no-op
    if (wasmReady) return;

    // Already initializing - prevent duplicate calls
    if (isInitializing) return;

    setIsInitializing(true);
    setWasmError(null);

    try {
      logger.debug('[useCharmsWasm] Initializing WASM module...');
      await charmsService.initWasm();
      setWasmReady(true);
      logger.debug('[useCharmsWasm] WASM ready:', charmsService.isReady());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('[useCharmsWasm] Failed to initialize WASM:', message);
      setWasmError(message);
      setWasmReady(false);
    } finally {
      setIsInitializing(false);
    }
  }, [wasmReady, isInitializing]);

  useEffect(() => {
    if (autoInit) {
      initWasm();
    }
  }, [autoInit, initWasm]);

  return {
    wasmReady,
    wasmError,
    initWasm,
  };
}
