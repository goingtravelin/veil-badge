// Domain layer - core types and logic

// Types
export * from './types';

// Spell domain logic
export * from './spell';

// Charm domain logic
export * from './charm';

// Blockchain utilities
export * from './blockchain';

// Bitcoin utilities
export * from './bitcoin';

// Proposal domain (excluding duplicate type exports)
export {
  DEFAULT_WINDOW_BLOCKS,
  DEFAULT_REPORT_WINDOW_BLOCKS,
  DEFAULT_PROPOSAL_EXPIRY_BLOCKS,
  WINDOW_OPTIONS,
  type TxCategory,
  type ReportedOutcome,
  type Proposal,
  type CreateProposalInput,
  type ActiveTransaction,
} from './proposal';
