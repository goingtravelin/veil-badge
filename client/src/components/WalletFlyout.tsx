

import { useEffect, useRef, useState } from 'react';
import { WalletState } from '../types';

interface WalletFlyoutProps {
  wallet: WalletState;
  onDisconnect: () => void;
  onClose: () => void;
}

export function WalletFlyout({ wallet, onDisconnect, onClose }: WalletFlyoutProps) {
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (wallet.address) {
      try {
        // Modern clipboard API (works on most mobile browsers)
        await navigator.clipboard.writeText(wallet.address);
        setCopied(true);
      } catch {
        // Fallback for older browsers/mobile
        const textArea = document.createElement('textarea');
        textArea.value = wallet.address;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
        } catch {
          console.error('Failed to copy address');
        }
        document.body.removeChild(textArea);
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Add event listener after a brief delay to avoid immediate close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleDisconnect = () => {
    onDisconnect();
    onClose();
  };

  return (
    <div
      ref={flyoutRef}
      className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50"
    >
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-white mb-3">Wallet</h3>

        <WalletInfoRow label="Status">
          <span className="text-green-400">Connected</span>
        </WalletInfoRow>

        <WalletInfoRow label="Network">
          <span className="text-white capitalize">{wallet.network}</span>
        </WalletInfoRow>

        <WalletInfoRow label="Address">
          <div className="flex items-center gap-2">
            <code className="text-purple-400 text-xs font-mono">
              {wallet.address?.slice(0, 12)}...{wallet.address?.slice(-8)}
            </code>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Copy address"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </WalletInfoRow>

        <WalletInfoRow label="Public Key">
          <code className="text-gray-500 text-xs font-mono">
            {wallet.pubkey?.slice(0, 12)}...
          </code>
        </WalletInfoRow>

        <WalletInfoRow label="UTXOs">
          <span className="text-white">{wallet.utxos.length}</span>
        </WalletInfoRow>

        <button
          onClick={handleDisconnect}
          className="w-full mt-4 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}

interface WalletInfoRowProps {
  label: string;
  children: React.ReactNode;
}

function WalletInfoRow({ label, children }: WalletInfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-400">{label}</span>
      {children}
    </div>
  );
}
