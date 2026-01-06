
// AcceptProposal Component

import { useState, useCallback, useEffect } from 'react';
import { FileCheck, AlertTriangle, Clock, Check, X, Shield, User } from 'lucide-react';
import type { Proposal, ActiveTransaction, B32 } from '../domain/proposal';
import {
  formatSats,
  blocksToTime,
  truncateBadgeId,
  getBlocksRemaining,
} from '../domain/proposal';
import {
  validateProposalStructure,
  isProposalExpired,
  isIntendedCounterparty,
  decodeProposal,
} from '../utils/proposalCodec';

interface AcceptProposalProps {
  /** The proposal to accept (can be encoded string or Proposal object) */
  proposal: Proposal | string;
  /** Current user's badge ID */
  myBadgeId: B32;
  /** Current block height */
  currentBlock: number;
  /** Proposer's trust score (if known) */
  proposerTrust?: number;
  /** Function to sign a message with wallet */
  signMessage: (message: string) => Promise<string>;
  /** Callback when proposal is accepted */
  onAccept: (proposal: Proposal, signature: string) => Promise<ActiveTransaction>;
  /** Callback when proposal is declined */
  onDecline?: () => void;
  /** Callback on error */
  onError?: (error: string) => void;
}

type Step = 'review' | 'signing' | 'accepted' | 'error';

export function AcceptProposal({
  proposal: proposalInput,
  myBadgeId,
  currentBlock,
  proposerTrust,
  signMessage,
  onAccept,
  onDecline,
  onError,
}: AcceptProposalProps) {
  // Parse proposal if needed
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  
  // UI state
  const [step, setStep] = useState<Step>('review');
  const [error, setError] = useState<string | null>(null);
  
  // Result
  const [activeTx, setActiveTx] = useState<ActiveTransaction | null>(null);

  // PARSE PROPOSAL

  useEffect(() => {
    if (typeof proposalInput === 'string') {
      try {
        const decoded = decodeProposal(proposalInput);
        setProposal(decoded);
        setParseError(null);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : 'Invalid proposal');
        setProposal(null);
      }
    } else {
      setProposal(proposalInput);
      setParseError(null);
    }
  }, [proposalInput]);

  // VALIDATION

  const validationIssues: string[] = [];
  
  if (proposal) {
    const structureResult = validateProposalStructure(proposal);
    if (!structureResult.valid) {
      validationIssues.push(structureResult.error!);
    }
    
    if (isProposalExpired(proposal, currentBlock)) {
      validationIssues.push('This proposal has expired');
    }
    
    // Only check badge ID match if proposal has counterpartyBadgeId
    // Address-based proposals are handled by AcceptProposalWithBadgeCreation
    if (proposal.counterpartyBadgeId && !isIntendedCounterparty(proposal, myBadgeId)) {
      validationIssues.push('You are not the intended counterparty for this proposal');
    }
  }

  const isValid = proposal && validationIssues.length === 0;
  const blocksUntilExpiry = proposal ? getBlocksRemaining(proposal.expiresAt, currentBlock) : 0;

  // HANDLERS

  const handleAccept = useCallback(async () => {
    if (!proposal || !isValid) return;
    
    setStep('signing');
    setError(null);
    
    try {

      const signature = await signMessage(proposal.id);
      
      // Call onAccept to create the active transaction
      const active = await onAccept(proposal, signature);
      
      setActiveTx(active);
      setStep('accepted');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to accept proposal';
      setError(errorMsg);
      setStep('error');
      onError?.(errorMsg);
    }
  }, [proposal, isValid, signMessage, onAccept, onError]);

  const handleDecline = useCallback(() => {
    onDecline?.();
  }, [onDecline]);

  // RENDER: LOADING

  if (!proposal && !parseError) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading proposal...</p>
      </div>
    );
  }

  // RENDER: PARSE ERROR

  if (parseError) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Invalid Proposal</h3>
            <p className="text-gray-400">{parseError}</p>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: SIGNING

  if (step === 'signing') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Accepting Proposal</h3>
        <p className="text-gray-400">
          Please sign to accept in your wallet...
        </p>
      </div>
    );
  }

  // RENDER: ERROR

  if (step === 'error') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Acceptance Failed</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => setStep('review')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: ACCEPTED

  if (step === 'accepted' && activeTx) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-green-500/10">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Proposal Accepted
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            The transaction is now active on both badges
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Value</span>
              <span className="text-white font-medium">{formatSats(activeTx.value)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Category</span>
              <span className="text-white">{activeTx.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Settlement Ends</span>
              <span className="text-white">
                Block {activeTx.window_ends_at.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Report Deadline</span>
              <span className="text-white">
                Block {activeTx.report_deadline.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-200">
            <p>
              Complete your transaction within the settlement window. After it closes,
              you'll both have {blocksToTime(activeTx.report_deadline - activeTx.window_ends_at)} to
              report the outcome.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: REVIEW STEP

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-purple-400" />
          Incoming Proposal
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Review this proposal before accepting
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Proposer Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-400">From</p>
            <p className="text-white font-mono text-sm truncate">
              {truncateBadgeId(proposal!.proposerBadgeId, 12)}
            </p>
          </div>
          {proposerTrust !== undefined && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Trust</p>
              <p className="text-white font-medium">{proposerTrust}</p>
            </div>
          )}
        </div>
        
        {/* Proposal Details */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Value</span>
            <span className="text-white font-semibold text-lg">{formatSats(proposal!.value)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Category</span>
            <span className="text-white">{proposal!.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Settlement Window</span>
            <span className="text-white">{blocksToTime(proposal!.windowBlocks)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Report Window</span>
            <span className="text-white">{blocksToTime(proposal!.reportWindowBlocks)}</span>
          </div>
          {proposal!.memo && (
            <div className="pt-2 border-t border-gray-700">
              <p className="text-gray-400 text-sm">Memo</p>
              <p className="text-white">{proposal!.memo}</p>
            </div>
          )}
        </div>
        
        {/* Expiry Warning */}
        {blocksUntilExpiry > 0 && blocksUntilExpiry < 72 && ( 
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm">
              Expires in ~{blocksToTime(blocksUntilExpiry)}
            </span>
          </div>
        )}
        
        {/* Validation Issues */}
        {validationIssues.length > 0 && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium">Cannot Accept</span>
            </div>
            <ul className="text-red-300 text-sm space-y-1">
              {validationIssues.map((issue, i) => (
                <li key={i}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* How It Works */}
        {isValid && (
          <div className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400">
            <p className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-gray-300">How it works</span>
            </p>
            <ol className="space-y-1 ml-6 list-decimal">
              <li>Accept to start the settlement window</li>
              <li>Complete your transaction off-chain</li>
              <li>Both parties report the outcome</li>
              <li>Your badges update based on reports</li>
            </ol>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={!isValid}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default AcceptProposal;
