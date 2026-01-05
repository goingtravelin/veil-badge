#!/bin/bash
# Build and optimize the Veil Charms app
# Uses official 'charms app build' for correct target and optimization

set -e

echo "Building Veil Charms app using 'charms app build'..."
BINARY=$(charms app build)
echo "Built: $BINARY"

# Get verification key (if available)
VK=$(charms app vk "$BINARY" 2>/dev/null || echo "N/A (older SDK version)")
echo "Verification Key: $VK"

# Copy to client
echo "Copying to client..."
# Handle both absolute and relative paths
if [[ -f "$BINARY" ]]; then
  BINARY_PATH="$BINARY"
elif [[ -f "./$BINARY" ]]; then
  BINARY_PATH="./$BINARY"
else
  echo "Error: Cannot find binary at $BINARY"
  exit 1
fi

cp "$BINARY_PATH" ../client/public/charms/veil.wasm
cp "$BINARY_PATH" ../client/dist/charms/veil.wasm 2>/dev/null || true

# Print info
echo ""
echo "Done! Binary sizes:"
ls -lh "$BINARY"

echo ""
echo "✅ Build complete!"
echo "   Binary: client/public/charms/veil.wasm"
echo "   VK:     $VK"
echo ""
echo "⚠️  If VK changed, update VEIL_APP_VK in client/src/domain/charm.ts"
