// Utils - UI helpers & formatters

// Formatting helpers
export * from './formatting';

// Proposal codec utilities
export {
  encodeProposal,
  decodeProposal,
  createProposalLink,
  extractProposalFromUrl,
  createUnsignedProposal,
  signProposal,
  validateProposalStructure,
  isProposalExpired,
  isIntendedCounterparty,
  isIntendedAddress,
  requiresBadgeCreation,
  generateProposalQR,
  type ProposalValidationResult,
} from './proposalCodec';

// Charms utilities
export * from './charms';

// Prover utilities  
export * from './prover';

// Logger
export { createLogger, LogLevel } from './logger';
