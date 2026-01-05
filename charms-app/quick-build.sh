#!/bin/bash
# Quick build script for development
# Builds and verifies WASI imports are correct
set -e
BINARY=$(charms app build)
cp "$BINARY" ../client/public/charms/veil.wasm
echo "✅ Copied $BINARY to client!"
wasm-objdump -x ../client/public/charms/veil.wasm 2>&1 | grep "wasi_snapshot" || echo "✅ No WASI imports!"
