
// ProposeTransaction Component

import { useState, useCallback } from 'react';
import { Send, Copy, Check, Info } from 'lucide-react';
import type { Proposal, CreateProposalInput, TxCategory, B32 } from '../domain/proposal';
import { WINDOW_OPTIONS, formatSats, blocksToTime } from '../domain/proposal';
import {
  createUnsignedProposal,
  signProposal,
  createProposalLink,
  generateProposalQR,
} from '../utils/proposalCodec';

interface ProposeTransactionProps {
  /** Current user's badge ID */
  myBadgeId: B32;
  /** Current user's badge UTXO (for atomic proposals) */
  myBadgeUtxo: { txid: string; vout: number };
  /** Current block height */
  currentBlock: number;
  /** Function to sign a message with wallet */
  signMessage: (message: string) => Promise<string>;
  /** Callback when proposal is created */
  onProposalCreated?: (proposal: Proposal) => void;
}

type Step = 'form' | 'signing' | 'share';

export function ProposeTransaction({
  myBadgeId,
  myBadgeUtxo,
  currentBlock,
  signMessage,
  onProposalCreated,
}: ProposeTransactionProps) {
  // Form state
  const [counterpartyId, setCounterpartyId] = useState('');
  const [counterpartyAddress, setCounterpartyAddress] = useState('');
  const [useAddress, setUseAddress] = useState(false); // Toggle between badge ID and address
  const [value, setValue] = useState<number>(0);
  const [category, setCategory] = useState<TxCategory>('Trade');
  const [windowBlocks, setWindowBlocks] = useState<number>(WINDOW_OPTIONS[2].blocks); // 7 days
  const [memo, setMemo] = useState('');
  
  // UI state
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Result
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  // HANDLERS

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate - require either badge ID or address
    if (!useAddress) {
      if (!counterpartyId || counterpartyId.length !== 64) {
        setError('Please enter a valid 64-character badge ID or use address instead');
        return;
      }
      if (counterpartyId === myBadgeId) {
        setError('Cannot transact with yourself');
        return;
      }
    } else {
      if (!counterpartyAddress) {
        setError('Please enter a Bitcoin address');
        return;
      }
      // Basic Bitcoin address validation
      const addressPattern = /^(bc1|tb1|bcrt1|[13mn2])[a-zA-HJ-NP-Z0-9]{25,62}$/;
      if (!addressPattern.test(counterpartyAddress)) {
        setError('Please enter a valid Bitcoin address');
        return;
      }
    }
    
    if (value <= 0) {
      setError('Value must be greater than 0');
      return;
    }
    
    setStep('signing');
    
    try {
      // Create unsigned proposal
      const input: CreateProposalInput = {
        proposerBadgeId: myBadgeId,
        proposerBadgeUtxo: myBadgeUtxo,
        counterpartyBadgeId: useAddress ? undefined : counterpartyId,
        counterpartyAddress: useAddress ? counterpartyAddress : undefined,
        value,
        category,
        windowBlocks,
        memo: memo || undefined,
      };
      
      const unsigned = await createUnsignedProposal(input, currentBlock);
      
      // Sign with wallet
      const signed = await signProposal(unsigned, signMessage);
      
      // Generate share link and QR
      const link = createProposalLink(signed);
      let qr: string | null = null;
      try {
        qr = await generateProposalQR(signed);
      } catch {
        // QR generation optional
      }
      
      setProposal(signed);
      setShareLink(link);
      setQrCode(qr);
      setStep('share');
      
      onProposalCreated?.(signed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create proposal');
      setStep('form');
    }
  }, [useAddress, counterpartyId, counterpartyAddress, myBadgeId, value, category, windowBlocks, memo, currentBlock, signMessage, onProposalCreated]);

  const handleCopyLink = useCallback(async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareLink]);

  const handleReset = useCallback(() => {
    setCounterpartyId('');
    setCounterpartyAddress('');
    setUseAddress(false);
    setValue(0);
    setCategory('Trade');
    setWindowBlocks(WINDOW_OPTIONS[2].blocks);
    setMemo('');
    setStep('form');
    setError(null);
    setProposal(null);
    setShareLink(null);
    setQrCode(null);
  }, []);

  // RENDER: SIGNING STEP

  if (step === 'signing') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Creating Proposal</h3>
        <p className="text-gray-400">
          Please sign the proposal in your wallet...
        </p>
      </div>
    );
  }

  // RENDER: SHARE STEP

  if (step === 'share' && proposal) {
    const windowOption = WINDOW_OPTIONS.find(w => w.blocks === proposal.windowBlocks);
    
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-green-500/10">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Proposal Created
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Share this with your counterparty to accept
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Summary */}
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Value</span>
              <span className="text-white font-medium">{formatSats(proposal.value)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Category</span>
              <span className="text-white">{proposal.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Settlement Window</span>
              <span className="text-white">{windowOption?.label || blocksToTime(proposal.windowBlocks)}</span>
            </div>
            {proposal.memo && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Memo</span>
                <span className="text-white truncate ml-4">{proposal.memo}</span>
              </div>
            )}
          </div>
          
          {/* QR Code */}
          {qrCode && (
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-lg">
                <img src={qrCode} alt="Proposal QR Code" className="w-48 h-48" />
              </div>
            </div>
          )}
          
          {/* Share Link */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Or share this link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareLink || ''}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p>
                This proposal expires in ~24 hours. Once your counterparty accepts,
                the settlement window begins and you'll both have{' '}
                {windowOption?.label || blocksToTime(proposal.windowBlocks)} to complete the transaction
                before reporting outcomes.
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: FORM STEP

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-purple-400" />
          Propose Transaction
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Create a proposal to send to your counterparty
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Counterparty Input - Badge ID or Address */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">
              Counterparty {useAddress ? 'Bitcoin Address' : 'Badge ID'}
            </label>
            <button
              type="button"
              onClick={() => {
                setUseAddress(!useAddress);
                setCounterpartyId('');
                setCounterpartyAddress('');
                setError(null);
              }}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              {useAddress ? 'Use Badge ID instead' : "They don't have a badge yet"}
            </button>
          </div>
          
          {useAddress ? (
            <>
              <input
                type="text"
                value={counterpartyAddress}
                onChange={(e) => setCounterpartyAddress(e.target.value.trim())}
                placeholder="tb1q... or bc1q..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>They'll be prompted to create a badge when accepting</span>
              </p>
            </>
          ) : (
            <input
              type="text"
              value={counterpartyId}
              onChange={(e) => setCounterpartyId(e.target.value.toLowerCase())}
              placeholder="Enter 64-character hex ID..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 font-mono text-sm"
            />
          )}
        </div>
        
        {/* Value */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Transaction Value (sats)
          </label>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => setValue(parseInt(e.target.value) || 0)}
            placeholder="100000"
            min="1"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
          />
          {value > 0 && (
            <p className="text-xs text-gray-500 mt-1">{formatSats(value)}</p>
          )}
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Transaction Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TxCategory)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          >
            <option value="Trade">Trade</option>
            <option value="Loan">Loan</option>
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* Settlement Window */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Settlement Window
          </label>
          <select
            value={windowBlocks}
            onChange={(e) => setWindowBlocks(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          >
            {WINDOW_OPTIONS.map((opt) => (
              <option key={opt.blocks} value={opt.blocks}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Time for the real-world transaction to complete before reporting outcomes
          </p>
        </div>
        
        {/* Memo (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Memo <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="e.g., For the vintage guitar"
            maxLength={100}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
          />
        </div>
        
        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Sign & Create Proposal
        </button>
      </form>
    </div>
  );
}

export default ProposeTransaction;
