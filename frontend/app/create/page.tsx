'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import { getLotteryContract } from '@/lib/lottery';
import tokenList from '@/lib/tokenList'; // includes $TOBY, $PATIENCE, etc.

type Token = {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  decimals: number;
  coingeckoId?: string;
};

const MIN_USD = 0.50;
const MAX_USD = 10.0;

export default function CreatePage() {
  const { data: walletClient } = useWalletClient();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [entryAmount, setEntryAmount] = useState('');
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTokens(tokenList);
  }, []);

  useEffect(() => {
    async function fetchPrice() {
      if (!selectedToken?.coingeckoId) return setUsdPrice(null);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedToken.coingeckoId}&vs_currencies=usd`
        );
        const json = await res.json();
        const price = json[selectedToken.coingeckoId]?.usd;
        setUsdPrice(price);
      } catch (e) {
        console.warn('Failed to fetch price', e);
        setUsdPrice(null);
      }
    }
    fetchPrice();
  }, [selectedToken]);

  const handleCreate = async () => {
    if (!walletClient || !selectedToken) return;

    const parsedAmount = parseFloat(entryAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return setError('Please enter a valid amount.');
    }

    if (usdPrice) {
      const totalUSD = parsedAmount * usdPrice;
      if (totalUSD < MIN_USD || totalUSD > MAX_USD) {
        return setError(`Amount must be between $${MIN_USD} and $${MAX_USD} USD.`);
      }
    }

    setCreating(true);
    setError('');

    try {
      const signer = new ethers.providers.Web3Provider(walletClient).getSigner();
      const contract = getLotteryContract(signer);

      const decimals = selectedToken.decimals;
      const amountInWei = ethers.utils.parseUnits(entryAmount, decimals);
      const tx = await contract.createPool(selectedToken.address, amountInWei);
      await tx.wait();
      alert('Pool created!');
      setEntryAmount('');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to create pool.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-slate-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-white">Create a Lottery Pool</h1>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-white">Select Token</label>
        <select
          className="w-full bg-slate-900 text-white p-2 rounded"
          onChange={(e) => {
            const token = tokens.find((t) => t.address === e.target.value);
            setSelectedToken(token || null);
          }}
          value={selectedToken?.address || ''}
        >
          <option value="" disabled>
            Choose token
          </option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-white">Entry Amount</label>
        <input
          type="number"
          step="any"
          className="w-full bg-slate-900 text-white p-2 rounded"
          value={entryAmount}
          onChange={(e) => setEntryAmount(e.target.value)}
          placeholder={`e.g. 10 ${selectedToken?.symbol || ''}`}
        />
        {usdPrice && entryAmount && (
          <p className="text-sm text-slate-300 mt-1">
            ≈ ${(parseFloat(entryAmount || '0') * usdPrice).toFixed(2)} USD
          </p>
        )}
      </div>

      {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

      <button
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleCreate}
        disabled={!selectedToken || creating}
      >
        {creating ? 'Creating...' : 'Create Pool'}
      </button>
    </div>
  );
}
