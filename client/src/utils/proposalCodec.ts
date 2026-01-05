

import type { Proposal, CreateProposalInput, B32, Signature } from '../domain/proposal';
import {
  DEFAULT_WINDOW_BLOCKS,
  DEFAULT_REPORT_WINDOW_BLOCKS,
  DEFAULT_PROPOSAL_EXPIRY_BLOCKS,
} from '../domain/proposal';

// ENCODING/DECODING

export function encodeProposal(proposal: Proposal): string {
  const json = JSON.stringify(proposal);

  return btoa(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeProposal(encoded: string): Proposal {

  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  const json = atob(base64);
  const proposal = JSON.parse(json) as Proposal;

  // Validate required fields
  if (!proposal.id || !proposal.proposerBadgeId) {
    throw new Error('Invalid proposal: missing required fields');
  }
  

  if (!proposal.counterpartyBadgeId && !proposal.counterpartyAddress) {
    throw new Error('Invalid proposal: must specify counterparty badge ID or address');
  }

  return proposal;
}

export function createProposalLink(proposal: Proposal, baseUrl?: string): string {
  const encoded = encodeProposal(proposal);
  // Use origin + pathname (without trailing slash) to get correct base for GitHub Pages subpath
  const base = baseUrl || `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '');
  return `${base}?proposal=${encoded}`;
}

export function createProposalDeepLink(proposal: Proposal): string {
  const encoded = encodeProposal(proposal);
  return `veil://proposal/${encoded}`;
}

export function extractProposalFromUrl(url: string): Proposal | null {
  try {
    // Try deep link format: veil://proposal/ENCODED
    if (url.startsWith('veil://proposal/')) {
      const encoded = url.replace('veil://proposal/', '');
      return decodeProposal(encoded);
    }

    // Try query param format: ?proposal=ENCODED
    const urlObj = new URL(url);
    const encoded = urlObj.searchParams.get('proposal');
    if (encoded) {
      return decodeProposal(encoded);
    }

    return null;
  } catch {
    return null;
  }
}

export async function computeProposalId(
  proposal: Omit<Proposal, 'id' | 'proposerSignature'>
): Promise<B32> {
  const canonical = getCanonicalBytes(proposal);

  const buffer = new ArrayBuffer(canonical.byteLength);
  new Uint8Array(buffer).set(canonical);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function getCanonicalBytes(
  proposal: Omit<Proposal, 'id' | 'proposerSignature'>
): Uint8Array {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];

  // proposer_badge_id (32 bytes)
  parts.push(hexToBytes(proposal.proposerBadgeId));

  if (proposal.counterpartyBadgeId) {
    parts.push(hexToBytes(proposal.counterpartyBadgeId));
  } else if (proposal.counterpartyAddress) {
    // Hash the address to create a deterministic 32-byte value
    const addressBytes = encoder.encode(proposal.counterpartyAddress);
    parts.push(sha256Sync(addressBytes));
  } else {
    // Should never happen if validation passes
    parts.push(new Uint8Array(32));
  }

  parts.push(uint64ToLeBytes(proposal.value));

  // category (1 byte)
  parts.push(new Uint8Array([categoryToByte(proposal.category)]));

  parts.push(uint32ToLeBytes(proposal.windowBlocks));

  parts.push(uint32ToLeBytes(proposal.reportWindowBlocks));

  parts.push(uint32ToLeBytes(proposal.createdAt));

  parts.push(uint32ToLeBytes(proposal.expiresAt));

  // memo (if present)
  if (proposal.memo) {
    parts.push(encoder.encode(proposal.memo));
  }

  // Concatenate all parts
  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}

export async function createUnsignedProposal(
  input: CreateProposalInput,
  currentBlock: number
): Promise<Omit<Proposal, 'proposerSignature'>> {
  const expiresAt = currentBlock + DEFAULT_PROPOSAL_EXPIRY_BLOCKS;

  const proposalData = {
    proposerBadgeId: input.proposerBadgeId,
    counterpartyBadgeId: input.counterpartyBadgeId,
    value: input.value,
    category: input.category,
    windowBlocks: input.windowBlocks ?? DEFAULT_WINDOW_BLOCKS,
    reportWindowBlocks: input.reportWindowBlocks ?? DEFAULT_REPORT_WINDOW_BLOCKS,
    createdAt: currentBlock,
    expiresAt,
    memo: input.memo,
  };

  const id = await computeProposalId(proposalData);

  return {
    id,
    ...proposalData,
  };
}

export async function signProposal(
  proposal: Omit<Proposal, 'proposerSignature'>,
  signMessage: (message: string) => Promise<string>
): Promise<Proposal> {

  const signature = await signMessage(proposal.id);

  return {
    ...proposal,
    proposerSignature: signature as Signature,
  };
}

export interface ProposalValidationResult {
  valid: boolean;
  error?: string;
}

export function validateProposalStructure(proposal: Proposal): ProposalValidationResult {
  if (!proposal.id || proposal.id.length !== 64) {
    return { valid: false, error: 'Invalid proposal ID' };
  }

  if (!proposal.proposerBadgeId || proposal.proposerBadgeId.length !== 64) {
    return { valid: false, error: 'Invalid proposer badge ID' };
  }

  const hasBadgeId = proposal.counterpartyBadgeId && proposal.counterpartyBadgeId.length === 64;
  const hasAddress = proposal.counterpartyAddress && proposal.counterpartyAddress.length > 0;
  
  if (!hasBadgeId && !hasAddress) {
    return { valid: false, error: 'Must provide either counterparty badge ID or Bitcoin address' };
  }

  if (hasBadgeId && proposal.proposerBadgeId === proposal.counterpartyBadgeId) {
    return { valid: false, error: 'Cannot transact with yourself' };
  }

  if (hasAddress && proposal.counterpartyAddress) {
    const addressPattern = /^(bc1|tb1|bcrt1|[13mn2])[a-zA-HJ-NP-Z0-9]{25,62}$/;
    if (!addressPattern.test(proposal.counterpartyAddress)) {
      return { valid: false, error: 'Invalid Bitcoin address format' };
    }
  }

  if (!proposal.value || proposal.value <= 0) {
    return { valid: false, error: 'Value must be greater than 0' };
  }

  if (!proposal.windowBlocks || proposal.windowBlocks <= 0) {
    return { valid: false, error: 'Settlement window must be greater than 0' };
  }

  if (!proposal.reportWindowBlocks || proposal.reportWindowBlocks <= 0) {
    return { valid: false, error: 'Report window must be greater than 0' };
  }

  if (!proposal.proposerSignature || proposal.proposerSignature.length < 64) {
    return { valid: false, error: 'Invalid signature' };
  }

  return { valid: true };
}

export function isProposalExpired(proposal: Proposal, currentBlock: number): boolean {
  return currentBlock > proposal.expiresAt;
}

export function isIntendedCounterparty(proposal: Proposal, myBadgeId: B32): boolean {
  return proposal.counterpartyBadgeId === myBadgeId;
}

export function isIntendedAddress(proposal: Proposal, myAddress: string): boolean {
  return proposal.counterpartyAddress === myAddress;
}

export function requiresBadgeCreation(proposal: Proposal): boolean {
  return !proposal.counterpartyBadgeId && !!proposal.counterpartyAddress;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function uint32ToLeBytes(value: number): Uint8Array {
  const bytes = new Uint8Array(4);
  bytes[0] = value & 0xff;
  bytes[1] = (value >> 8) & 0xff;
  bytes[2] = (value >> 16) & 0xff;
  bytes[3] = (value >> 24) & 0xff;
  return bytes;
}

function uint64ToLeBytes(value: number): Uint8Array {
  const bytes = new Uint8Array(8);

  bytes[0] = value & 0xff;
  bytes[1] = (value >> 8) & 0xff;
  bytes[2] = (value >> 16) & 0xff;
  bytes[3] = (value >> 24) & 0xff;

  const high = Math.floor(value / 0x100000000);
  bytes[4] = high & 0xff;
  bytes[5] = (high >> 8) & 0xff;
  bytes[6] = (high >> 16) & 0xff;
  bytes[7] = (high >> 24) & 0xff;
  return bytes;
}

function categoryToByte(category: string): number {
  switch (category) {
    case 'Trade': return 0;
    case 'Loan': return 1;
    case 'Service': return 2;
    case 'Other': return 3;
    default: return 3;
  }
}

function sha256Sync(data: Uint8Array): Uint8Array {

  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i];
    hash = hash & hash; // Convert to 32bit integer
  }
  

  const result = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    result[i] = (hash >> (i % 4) * 8) & 0xff;
    hash = ((hash << 5) - hash) ^ data[i % data.length];
  }
  
  return result;
}

export async function generateProposalQR(proposal: Proposal): Promise<string | null> {
  try {
    // Dynamic import to avoid bundling QR library if not used
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const QRCode = await import('qrcode' as any);
    const link = createProposalDeepLink(proposal);
    return QRCode.toDataURL(link, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 256,
    });
  } catch {
    // qrcode library not installed
    console.warn('QR code generation requires: npm install qrcode @types/qrcode');
    return null;
  }
}

export async function generateProposalQRSvg(proposal: Proposal): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const QRCode = await import('qrcode' as any);
    const link = createProposalDeepLink(proposal);
    return QRCode.toString(link, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 2,
    });
  } catch {
    // qrcode library not installed
    return null;
  }
}
