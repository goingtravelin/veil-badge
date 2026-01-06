import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  // Use /veil-badge/ for production (GitHub Pages), '/' for development
  base: process.env.NODE_ENV === 'production' ? '/veil-badge/' : '/',
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy Charms prover API requests to avoid CORS issues
      '/api/charms': {
        target: 'https://v8.charms.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/charms/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[vite-proxy] Error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('[vite-proxy] Proxying:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('[vite-proxy] Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - split large libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('bitcoinjs-lib') || id.includes('@bitcoinerlab/secp256k1')) {
              return 'bitcoin-vendor';
            }
            // All other node_modules go to vendor chunk
            return 'vendor';
          }
          // Charms service in separate chunk for lazy loading potential
          if (id.includes('/services/CharmsService')) {
            return 'charms';
          }
        },
      },
    },
  },
});
