#!/usr/bin/env node
/**
 * WASM Sync Script
 * 
 * Automates the WASM build and deployment process:
 * 1. Builds the WASM binary (optional, can skip if already built)
 * 2. Computes the VK (SHA256 hash)
 * 3. Archives old binary if VK changed
 * 4. Updates TypeScript (charm.ts) with new VK
 * 5. Copies WASM to client/public/wasm
 * 
 * Note: Rust migration.rs no longer needs VK whitelist updates.
 * Security is guaranteed by the Charms prover (must have binary to prove).
 * 
 * Usage:
 *   node scripts/sync-wasm.mjs [--skip-build] [--dry-run]
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Paths
const PATHS = {
  wasmSource: join(ROOT_DIR, 'charms-app/target/wasm32-wasip1/release/veil.wasm'),
  wasmDest: join(ROOT_DIR, 'client/public/wasm/veil.wasm'),
  wasmArchiveDir: join(ROOT_DIR, 'client/public/wasm'),
  charmTs: join(ROOT_DIR, 'client/src/domain/charm.ts'),
  charmsAppDir: join(ROOT_DIR, 'charms-app'),
};

// Parse CLI args
const args = process.argv.slice(2);
const skipBuild = args.includes('--skip-build');
const dryRun = args.includes('--dry-run');

function log(msg, type = 'info') {
  const prefix = {
    info: '📦',
    success: '✅',
    warn: '⚠️',
    error: '❌',
    step: '→',
  }[type] || '•';
  console.log(`${prefix} ${msg}`);
}

function computeVk(wasmPath) {
  const binary = readFileSync(wasmPath);
  const hash = createHash('sha256').update(binary).digest('hex');
  return hash;
}

function vkToRustBytes(vk) {
  const bytes = [];
  for (let i = 0; i < vk.length; i += 2) {
    bytes.push(`0x${vk.slice(i, i + 2)}`);
  }
  return `[${bytes.join(', ')}]`;
}

function getCurrentVkFromTs() {
  const content = readFileSync(PATHS.charmTs, 'utf8');
  const match = content.match(/export const VEIL_APP_VK = '([a-f0-9]{64})'/);
  return match ? match[1] : null;
}

function getPreviousVksFromTs() {
  const content = readFileSync(PATHS.charmTs, 'utf8');
  const match = content.match(/export const VEIL_PREVIOUS_VKS: string\[\] = \[([\s\S]*?)\];/);
  if (!match) return [];
  
  const vks = [];
  const regex = /'([a-f0-9]{64})'/g;
  let m;
  while ((m = regex.exec(match[1])) !== null) {
    vks.push(m[1]);
  }
  return vks;
}

function updateCharmTs(newVk, oldVk) {
  let content = readFileSync(PATHS.charmTs, 'utf8');
  
  // Update VEIL_APP_VK
  content = content.replace(
    /export const VEIL_APP_VK = '[a-f0-9]{64}'/,
    `export const VEIL_APP_VK = '${newVk}'`
  );
  
  // Add oldVk to VEIL_PREVIOUS_VKS if not already there
  const previousVks = getPreviousVksFromTs();
  if (oldVk && !previousVks.includes(oldVk)) {
    // Insert at the beginning of the array
    const insertPattern = /export const VEIL_PREVIOUS_VKS: string\[\] = \[/;
    content = content.replace(
      insertPattern,
      `export const VEIL_PREVIOUS_VKS: string[] = [\n  '${oldVk}',`
    );
  }
  
  if (!dryRun) {
    writeFileSync(PATHS.charmTs, content);
  }
  log(`Updated charm.ts: VEIL_APP_VK = ${newVk.slice(0, 16)}...`, 'step');
  if (oldVk) {
    log(`Added ${oldVk.slice(0, 16)}... to VEIL_PREVIOUS_VKS`, 'step');
  }
}

function archiveOldWasm(oldVk) {
  if (!oldVk) return;
  
  const vkPrefix = oldVk.slice(0, 16);
  const archivePath = join(PATHS.wasmArchiveDir, `veil-${vkPrefix}.wasm`);
  
  if (existsSync(archivePath)) {
    log(`Archive already exists: veil-${vkPrefix}.wasm`, 'step');
    return;
  }
  
  if (existsSync(PATHS.wasmDest)) {
    if (!dryRun) {
      copyFileSync(PATHS.wasmDest, archivePath);
    }
    log(`Archived old WASM to veil-${vkPrefix}.wasm`, 'step');
  }
}

function copyNewWasm() {
  if (!existsSync(dirname(PATHS.wasmDest))) {
    mkdirSync(dirname(PATHS.wasmDest), { recursive: true });
  }
  
  if (!dryRun) {
    copyFileSync(PATHS.wasmSource, PATHS.wasmDest);
  }
  log(`Copied new WASM to client/public/wasm/veil.wasm`, 'step');
}

function buildWasm() {
  log('Building WASM...', 'info');
  try {
    // Clean build with CARGO_INCREMENTAL=0 for reproducible binaries
    // Note: No longer need to worry about whitelist affecting VK since we removed it
    const env = { ...process.env, CARGO_INCREMENTAL: '0' };
    
    execSync('cargo build --release --target wasm32-wasip1', {
      cwd: PATHS.charmsAppDir,
      stdio: 'inherit',
      env,
    });
    log('WASM build complete', 'success');
  } catch (error) {
    log('WASM build failed', 'error');
    process.exit(1);
  }
}

// Main
async function main() {
  console.log('\n🔧 WASM Sync Script\n');
  
  if (dryRun) {
    log('DRY RUN - no files will be modified\n', 'warn');
  }
  
  // Step 1: Build WASM (optional)
  if (!skipBuild) {
    buildWasm();
  } else {
    log('Skipping WASM build (--skip-build)', 'step');
  }
  
  // Step 2: Verify WASM exists
  if (!existsSync(PATHS.wasmSource)) {
    log(`WASM not found at ${PATHS.wasmSource}`, 'error');
    log('Run without --skip-build or build manually first', 'error');
    process.exit(1);
  }
  
  // Step 3: Compute new VK
  const newVk = computeVk(PATHS.wasmSource);
  log(`New WASM VK: ${newVk}`, 'info');
  
  // Step 4: Get current VK from TypeScript
  const currentVk = getCurrentVkFromTs();
  log(`Current VK in code: ${currentVk || 'not found'}`, 'info');
  
  // Step 5: Check if VK changed
  if (currentVk === newVk) {
    log('\nVK unchanged - no updates needed', 'success');
    
    // Still copy/verify WASM in case it's missing or wrong
    if (!existsSync(PATHS.wasmDest)) {
      copyNewWasm();
    } else {
      // Verify the deployed WASM matches
      const deployedVk = computeVk(PATHS.wasmDest);
      if (deployedVk !== newVk) {
        log(`Deployed WASM has wrong VK (${deployedVk.slice(0, 16)}...), replacing...`, 'warn');
        copyNewWasm();
      } else {
        log('Deployed WASM verified ✓', 'step');
      }
    }
    return;
  }
  
  log(`\nVK changed! Updating files...`, 'warn');
  
  // Step 6: Archive old WASM (safe now - archives don't affect binary)
  archiveOldWasm(currentVk);
  
  // Step 7: Update TypeScript
  updateCharmTs(newVk, currentVk);
  
  // Step 8: Copy new WASM
  copyNewWasm();
  
  console.log('\n');
  log('WASM sync complete!', 'success');
  
  if (!dryRun) {
    console.log('\n📝 Next steps:');
    console.log('   1. Review changes in git');
    console.log('   2. Test the application');
    console.log('   3. Commit the changes');
  }
}

main().catch((err) => {
  log(err.message, 'error');
  process.exit(1);
});
