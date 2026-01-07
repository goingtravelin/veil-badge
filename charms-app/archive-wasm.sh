#!/bin/bash
# Archive current WASM binary before rebuilding
# Run this BEFORE `cargo build` when making changes that will change the VK

set -e

WASM_SOURCE="./target/wasm32-wasip1/release/veil.wasm"
CLIENT_WASM_DIR="../client/public/wasm"

# Check if source exists
if [ ! -f "$WASM_SOURCE" ]; then
    echo "❌ No existing WASM found at $WASM_SOURCE"
    echo "   Run 'cargo build --release --target wasm32-wasip1' first"
    exit 1
fi

# Calculate VK (SHA256 of WASM)
VK=$(sha256sum "$WASM_SOURCE" | cut -d' ' -f1)
VK_PREFIX="${VK:0:16}"

echo "📦 Current WASM VK: $VK"

# Check if archive already exists
ARCHIVE_PATH="$CLIENT_WASM_DIR/veil-$VK_PREFIX.wasm"
if [ -f "$ARCHIVE_PATH" ]; then
    echo "✅ Archive already exists: $ARCHIVE_PATH"
    exit 0
fi

# Archive the current binary
cp "$WASM_SOURCE" "$ARCHIVE_PATH"
echo "✅ Archived to: $ARCHIVE_PATH"

# Update the VK list in charm.ts (informational)
echo ""
echo "📝 Remember to add this VK to VEIL_PREVIOUS_VKS in client/src/domain/charm.ts:"
echo "   '$VK',"
echo ""
echo "📝 And add to WHITELISTED_OLD_VKS in charms-app/src/handlers/migration.rs:"
echo "   // $VK"
echo "   [$(echo $VK | sed 's/../0x&, /g' | sed 's/, $//')]],"
