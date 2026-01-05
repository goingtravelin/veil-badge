/**
 * SeedPhraseManager - UI component for managing seed phrase
 * 
 * Allows users to import their seed phrase for transaction signing.
 * WARNING: This stores the seed phrase in localStorage - not secure for production!
 */

import { useState, useEffect } from 'react';
import { 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Trash2,
  Copy,
  RefreshCw
} from 'lucide-react';
import {
  storeSeedPhrase,
  getSeedPhrase,
  hasSeedPhrase,
  clearSeedPhrase,
  validateSeedPhrase,
  generateSeedPhrase,
  getPrimaryAddress,
} from '../services/TaprootKeyService';

interface SeedPhraseManagerProps {
  onSeedPhraseChange?: (hasSeed: boolean) => void;
  isTestnet?: boolean;
  walletAddress?: string; // Connected wallet address for comparison
}

export function SeedPhraseManager({ 
  onSeedPhraseChange,
  isTestnet = true,
  walletAddress,
}: SeedPhraseManagerProps) {
  const [hasSeed, setHasSeed] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [seedInput, setSeedInput] = useState('');
  const [showSeed, setShowSeed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [derivedAddress, setDerivedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if seed phrase exists on mount
  useEffect(() => {
    const exists = hasSeedPhrase();
    setHasSeed(exists);
    if (exists) {
      loadDerivedAddress();
    }
  }, []);

  const loadDerivedAddress = async () => {
    const seed = getSeedPhrase();
    if (seed) {
      try {
        const address = await getPrimaryAddress(seed, isTestnet);
        setDerivedAddress(address);
      } catch (e) {
        console.error('Failed to derive address:', e);
      }
    }
  };

  const handleImport = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const trimmedSeed = seedInput.trim().toLowerCase();
      
      if (!validateSeedPhrase(trimmedSeed)) {
        setError('Invalid seed phrase. Please enter a valid 12 or 24 word BIP-39 mnemonic.');
        setLoading(false);
        return;
      }

      storeSeedPhrase(trimmedSeed);
      setHasSeed(true);
      setSeedInput('');
      setShowInput(false);
      
      const address = await getPrimaryAddress(trimmedSeed, isTestnet);
      setDerivedAddress(address);
      
      setSuccess('Seed phrase imported successfully!');
      onSeedPhraseChange?.(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import seed phrase');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const newSeed = generateSeedPhrase();
      setSeedInput(newSeed);
      setShowSeed(true);
      setSuccess('New seed phrase generated. SAVE IT SECURELY before importing!');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate seed phrase');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to remove your seed phrase? You will not be able to sign transactions until you import it again.')) {
      clearSeedPhrase();
      setHasSeed(false);
      setDerivedAddress(null);
      setSuccess('Seed phrase removed.');
      onSeedPhraseChange?.(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Key className="w-6 h-6 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Seed Phrase</h3>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-400">
          <strong>Security Warning:</strong> Your seed phrase is stored locally in your browser. 
          This is not secure for large amounts. Only use with testnet funds or small amounts.
        </div>
      </div>

      {hasSeed ? (
        // Seed phrase exists - show status
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Seed phrase imported - ready for signing</span>
          </div>

          {derivedAddress && (
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Primary Taproot Address (index 0)</div>
              <div className="flex items-center gap-2">
                <code className="text-sm text-purple-400 font-mono break-all">{derivedAddress}</code>
                <button
                  onClick={() => copyToClipboard(derivedAddress)}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              {/* Address mismatch warning */}
              {walletAddress && walletAddress !== derivedAddress && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-400">
                      <strong>Address Mismatch!</strong> Your connected wallet address is different from this seed phrase address. 
                      Either:
                      <ul className="mt-1 ml-3 list-disc">
                        <li>Import your wallet's seed phrase (from UniSat/Leather settings)</li>
                        <li>Or fund this address with testnet BTC instead</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {walletAddress && walletAddress === derivedAddress && (
                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">
                      ✓ Wallet address matches seed phrase - ready to mint!
                    </span>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                Fund this address on {isTestnet ? 'testnet4' : 'mainnet'} to mint badges.
              </div>
            </div>
          )}

          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove Seed Phrase
          </button>
        </div>
      ) : (
        // No seed phrase - show import form
        <div className="space-y-4">
          {!showInput ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowInput(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
              >
                <Key className="w-5 h-5" />
                Import Existing Seed Phrase
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                title="Generate new seed phrase"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Generate New
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Enter your 12 or 24 word seed phrase
                </label>
                <div className="relative">
                  <textarea
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                    placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
                    className={`w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-sm resize-none ${
                      showSeed ? '' : 'blur-sm hover:blur-none focus:blur-none'
                    }`}
                    rows={3}
                  />
                  <button
                    onClick={() => setShowSeed(!showSeed)}
                    className="absolute right-2 top-2 p-1 hover:bg-gray-700 rounded"
                    title={showSeed ? 'Hide' : 'Show'}
                  >
                    {showSeed ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  disabled={loading || !seedInput.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Importing...' : 'Import'}
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setSeedInput('');
                    setError(null);
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span className="text-sm text-green-400">{success}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="text-sm text-gray-400">
          <strong className="text-white">How it works:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-500">
            <li>Your seed phrase derives Taproot keys using BIP-86 path</li>
            <li>Keys are used to sign Charms commit and spell transactions</li>
            <li>Standard Taproot signing for Charms transactions</li>
            <li>Fund the derived Taproot address to mint badges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
