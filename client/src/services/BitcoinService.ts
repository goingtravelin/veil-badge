

import { IBitcoinPort, Network, UtxoInfo } from '../application/ports';
import { utxoCache, txCache, blockHeightCache, addressInfoCache } from '../utils/cache';

export interface IBitcoinService extends IBitcoinPort {
  getAddressInfo(address: string): Promise<AddressInfo>;
}

export interface AddressInfo {
  address: string;
  pubkey: string;
  scriptPubKey?: string;
}

// MEMPOOL.SPACE IMPLEMENTATION

const MEMPOOL_ENDPOINTS: Record<Network, string> = {
  mainnet: 'https://mempool.space/api',
  testnet4: 'https://mempool.space/testnet4/api',
  signet: 'https://mempool.space/signet/api',
  regtest: 'http://localhost:3001/api', // Via proxy
};

export class MempoolBitcoinService implements IBitcoinService {
  async fetchUtxos(address: string, network: Network): Promise<UtxoInfo[]> {
    const cacheKey = `utxos:${network}:${address}`;

    return utxoCache.get(cacheKey, async () => {
      const baseUrl = MEMPOOL_ENDPOINTS[network];
      const response = await fetch(`${baseUrl}/address/${address}/utxo`);

      if (!response.ok) {
        throw new Error(`Failed to fetch UTXOs: ${response.statusText}`);
      }

      const utxos = await response.json();
      return utxos.map((utxo: any) => ({
        txid: utxo.txid,
        vout: utxo.vout,
        value: utxo.value,
      }));
    });
  }
  
  async fetchTransaction(txid: string, network: Network): Promise<string> {
    const cacheKey = `tx:${network}:${txid}`;

    return txCache.get(cacheKey, async () => {
      const baseUrl = MEMPOOL_ENDPOINTS[network];
      const response = await fetch(`${baseUrl}/tx/${txid}/hex`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }

      return response.text();
    }, 300000); // 5 minutes - transactions are immutable once confirmed
  }
  
  async broadcast(txHex: string, network: Network): Promise<string> {
    const baseUrl = MEMPOOL_ENDPOINTS[network];
    const response = await fetch(`${baseUrl}/tx`, {
      method: 'POST',
      body: txHex,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Broadcast failed: ${error}`);
    }
    
    return response.text(); // Returns txid
  }
  
  async getCurrentBlockHeight(network: Network): Promise<number> {
    const cacheKey = `blockHeight:${network}`;

    return blockHeightCache.get(cacheKey, async () => {
      const baseUrl = MEMPOOL_ENDPOINTS[network];
      const response = await fetch(`${baseUrl}/blocks/tip/height`);

      if (!response.ok) {
        throw new Error(`Failed to fetch block height: ${response.statusText}`);
      }

      return parseInt(await response.text(), 10);
    }, 30000); // 30 seconds - balance between freshness and API calls
  }
  
  async getAddressInfo(_address: string): Promise<AddressInfo> {
    // Mempool.space doesn't provide pubkey info
    throw new Error('getAddressInfo not supported by Mempool.space');
  }
}

export class ProxyBitcoinService implements IBitcoinService {
  constructor(private proxyUrl: string = 'http://localhost:3001') {}

  async fetchUtxos(address: string, _network: Network): Promise<UtxoInfo[]> {
    const cacheKey = `utxos:proxy:${address}`;

    return utxoCache.get(cacheKey, async () => {
      const response = await fetch(`${this.proxyUrl}/api/wallet/utxos?address=${address}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch UTXOs: ${response.statusText}`);
      }

      return response.json();
    });
  }
  
  async fetchTransaction(txid: string, _network: Network): Promise<string> {
    const cacheKey = `tx:proxy:${txid}`;

    return txCache.get(cacheKey, async () => {
      const response = await fetch(`${this.proxyUrl}/api/tx/${txid}/hex`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }

      return response.text();
    }, 300000); // 5 minutes - transactions are immutable
  }
  
  async broadcast(txHex: string, _network: Network): Promise<string> {
    const response = await fetch(`${this.proxyUrl}/api/tx/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txHex }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Broadcast failed: ${error}`);
    }
    
    const result = await response.json();
    return result.txid;
  }
  
  async getCurrentBlockHeight(_network: Network): Promise<number> {
    const cacheKey = `blockHeight:proxy`;

    return blockHeightCache.get(cacheKey, async () => {
      const response = await fetch(`${this.proxyUrl}/api/blockchain/height`);

      if (!response.ok) {
        throw new Error(`Failed to fetch block height: ${response.statusText}`);
      }

      const result = await response.json();
      return result.height;
    }, 30000); // 30 seconds
  }
  
  async getAddressInfo(address: string): Promise<AddressInfo> {
    const cacheKey = `addressInfo:proxy:${address}`;

    return addressInfoCache.get(cacheKey, async () => {
      const response = await fetch(`${this.proxyUrl}/api/wallet/address/${address}/info`);

      if (!response.ok) {
        throw new Error(`Failed to get address info: ${response.statusText}`);
      }

      return response.json();
    }, 300000); // 5 minutes
  }
  
  async getNewAddress(label: string = 'veil'): Promise<string> {
    const response = await fetch(
      `${this.proxyUrl}/api/wallet/address?label=${label}&type=bech32m`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get new address: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.address;
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.proxyUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export function createBitcoinService(
  mode: 'mempool' | 'proxy',
  proxyUrl?: string
): IBitcoinService {
  if (mode === 'proxy') {
    return new ProxyBitcoinService(proxyUrl);
  }
  return new MempoolBitcoinService();
}

// Default instance for convenience
export const bitcoinService = new MempoolBitcoinService();
export const proxyBitcoinService = new ProxyBitcoinService();
