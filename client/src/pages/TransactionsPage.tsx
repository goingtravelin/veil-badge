// Transactions Page - Proposal and settlement flow

import { useState, useEffect } from 'react';
import { Plus, Inbox, Clock, AlertCircle } from 'lucide-react';
import { ProposeTransaction } from '../components/ProposeTransaction';
import { AcceptProposal } from '../components/AcceptProposal';
import { extractProposalFromUrl } from '../utils/proposalCodec';
import { createLogger } from '../utils/logger';
import type { VeilBadge, BadgeWithUtxo, WalletState } from '../types';
import type { Proposal, ActiveTransaction } from '../domain/proposal';
import { acceptProposal } from '../application/acceptProposal';
import { createBitcoinService, createProverService, createCryptoService, createStorageService } from '../services';

const logger = createLogger('TransactionsPage');

interface TransactionsPageProps {
  myBadge: BadgeWithUtxo;
  currentBlock: number;
  signMessage: (message: string) => Promise<string>;
  onBadgeUpdate?: (badge: VeilBadge) => void;
  wallet: WalletState;
}

type View = 'inbox' | 'propose' | 'accept';

export function TransactionsPage({
  myBadge,
  currentBlock,
  signMessage,
  onBadgeUpdate,
  wallet,
}: TransactionsPageProps) {
  const [view, setView] = useState<View>('propose');
  const [incomingProposal, setIncomingProposal] = useState<Proposal | null>(null);

  // Check URL for incoming proposal on mount
  useEffect(() => {
    const url = window.location.href;
    const proposal = extractProposalFromUrl(url);
    if (proposal) {
      logger.info('Found proposal in URL:', proposal.id);
      setIncomingProposal(proposal);
      setView('accept');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleProposalCreated = (proposal: Proposal) => {
    logger.info('Proposal created:', proposal.id);
  };

  const handleAccept = async (proposal: Proposal, signature: string): Promise<ActiveTransaction> => {
    logger.info('Accepting proposal:', proposal.id);
    logger.info('myBadge.vk for accept:', myBadge.vk ? myBadge.vk.slice(0, 16) + '...' : 'UNDEFINED - will use default VK');
    logger.info('Full myBadge object:', { 
      badgeId: myBadge.badge.id.slice(0, 16),
      utxo: `${myBadge.utxo.txid.slice(0, 8)}:${myBadge.utxo.vout}`,
      vk: myBadge.vk || 'NOT SET'
    });
    
    if (!wallet.address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Create service instances
      const bitcoinService = createBitcoinService('mempool');
      const proverService = createProverService('remote');
      const cryptoService = createCryptoService();
      const storageService = createStorageService();

      // Call the actual acceptProposal use case
      const result = await acceptProposal(
        {
          proposal,
          myBadge: myBadge.badge,
          myBadgeUtxo: myBadge.utxo,
          availableUtxos: wallet.utxos,
          myAddress: wallet.address,
          mySignature: signature,
          network: wallet.network,
          acceptorVk: myBadge.vk, // Pass acceptor's VK for cross-version checking
        },
        {
          bitcoin: bitcoinService,
          prover: proverService,
          crypto: cryptoService,
          storage: storageService,
          network: wallet.network,
          onProgress: (msg) => logger.info('Progress:', msg),
        }
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to accept proposal');
      }

      // Update badge with the new state
      onBadgeUpdate?.(result.data.updatedBadge);
      
      setIncomingProposal(null);
      setView('inbox');
      
      return result.data.activeTransaction;
    } catch (error) {
      logger.error('Failed to accept proposal:', error);
      throw error;
    }
  };

  const handleDecline = () => {
    setIncomingProposal(null);
    setView('inbox');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setView('propose')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              view === 'propose'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            Propose
          </button>
          <button
            onClick={() => setView('inbox')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              view === 'inbox'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Inbox
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {view === 'inbox' && (
            <TransactionInbox 
              activeTransactions={myBadge.badge.active_transactions}
              currentBlock={currentBlock}
            />
          )}

          {view === 'propose' && (
            <ProposeTransaction
              myBadgeId={myBadge.badge.id}
              myBadgeUtxo={myBadge.utxo}
              currentBlock={currentBlock}
              signMessage={signMessage}
              onProposalCreated={handleProposalCreated}
            />
          )}

          {view === 'accept' && incomingProposal && (
            <AcceptProposal
              proposal={incomingProposal}
              myBadgeId={myBadge.badge.id}
              currentBlock={currentBlock}
              signMessage={signMessage}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <HowItWorksCard />
        </div>
      </div>
    </div>
  );
}

// Simple inline inbox component
function TransactionInbox({ 
  activeTransactions, 
  currentBlock 
}: { 
  activeTransactions: ActiveTransaction[]; 
  currentBlock: number;
}) {
  if (activeTransactions.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Active Transactions</h3>
        <p className="text-gray-400">
          Create a proposal or accept one from a counterparty to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeTransactions.map((tx) => {
        const blocksRemaining = tx.window_ends_at - currentBlock;
        const isExpired = blocksRemaining <= 0;
        
        return (
          <div 
            key={tx.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isExpired ? (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-400" />
                )}
                <span className="font-medium text-white">
                  {tx.category} Transaction
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {tx.value.toLocaleString()} sats
              </span>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>ID: {tx.id.slice(0, 16)}...</p>
              <p>Counterparty: {tx.counterparty_badge_id.slice(0, 16)}...</p>
              {!isExpired && (
                <p className="text-blue-400">
                  {blocksRemaining} blocks remaining (~{Math.round(blocksRemaining * 10 / 60)} hours)
                </p>
              )}
              {isExpired && (
                <p className="text-yellow-400">Ready to report outcome</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HowItWorksCard() {
  const steps = [
    { title: 'Propose', description: 'Create a proposal with transaction details' },
    { title: 'Accept', description: 'Counterparty reviews and accepts' },
    { title: 'Settle', description: 'Complete your transaction' },
    { title: 'Report', description: 'Both parties report the outcome' },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="font-medium text-white mb-4">How It Works</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
              {index + 1}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{step.title}</p>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsPage;
