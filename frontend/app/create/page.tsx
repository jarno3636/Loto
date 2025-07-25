// app/create/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getLotteryContract } from '@/utils/lottery';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import TOKENS from '@/utils/tokenList';
import toast from 'react-hot-toast';

export default function CreatePage() {
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();

  const [selectedToken, setSelectedToken] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchPrices() {
      try {
        const ids = TOKENS.map(t => t.coingeckoId).join(',');
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        const data = await res.json();
        const prices: Record<string, number> = {};
        TOKENS.forEach(t => {
          if (data[t.coingeckoId]) {
            prices[t.address.toLowerCase()] = data[t.coingeckoId].usd;
          }
        });
        setPriceMap(prices);
      } catch (err) {
        console.error('Error fetching prices:', err);
      }
    }
    fetchPrices();
  }, []);

  useEffect(() => {
    if (selectedToken && entryAmount && priceMap[selectedToken.toLowerCase()]) {
      const price = priceMap[selectedToken.toLowerCase()];
      const usd = parseFloat(entryAmount) * price;
      setUsdValue(usd);
    } else {
      setUsdValue(null);
    }
  }, [selectedToken, entryAmount, priceMap]);

  const handleCreatePool = async () => {
    if (!walletClient || !isConnected) return;
    if (!selectedToken || !entryAmount) return toast.error('Please select token and amount');

    const usd = usdValue ?? 0;

    if (usd < 1) {
      return toast.error('Minimum $1 for Small Pool');
    } else if (usd > 1000) {
      return toast.error('Max $1000 for any pool');
    }

    try {
      const signer = new ethers.providers.Web3Provider(walletClient).getSigner();
      const contract = getLotteryContract(signer);

      const tokenContract = new ethers.Contract(selectedToken, [
        'function approve(address spender, uint256 amount) public returns (bool)',
      ], signer);

      const amountInWei = ethers.utils.parseUnits(entryAmount, 18);

      await tokenContract.approve(contract.address, amountInWei);
      const tx = await contract.createPool(selectedToken, amountInWei);
      await tx.wait();

      toast.success('Pool created!');
      setEntryAmount('');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to create pool');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Create a Pool</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Token</label>
        <select
          value={selectedToken}
          onChange={e => setSelectedToken(e.target.value)}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white"
        >
          <option value="">Select Token</option>
          {TOKENS.map(token => (
            <option key={token.address} value={token.address}>
              {token.symbol} ({token.name})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Entry Amount</label>
        <input
          type="number"
          placeholder="Amount"
          value={entryAmount}
          onChange={e => setEntryAmount(e.target.value)}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white"
        />
        {usdValue !== null && (
          <p className="text-sm mt-1 text-slate-400">
            ≈ ${usdValue.toFixed(2)} USD
          </p>
        )}
      </div>

      <button
        onClick={handleCreatePool}
        disabled={!isConnected}
        className="w-full mt-4 bg-violet-600 hover:bg-violet-700 py-3 rounded font-bold disabled:opacity-50"
      >
        Create Pool
      </button>
    </div>
  );
}
