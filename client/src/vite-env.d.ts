/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BITCOIN_PROXY_URL?: string;
  readonly VITE_PROVER_URL?: string;
  readonly VITE_CHARMS_WASM_URL?: string;
  readonly VITE_PROVER_ENDPOINT?: string;
  readonly VITE_USE_MOCK_PROVER?: string;
  readonly VITE_DEMO_MODE?: string;
  readonly VITE_LOG_LEVEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
