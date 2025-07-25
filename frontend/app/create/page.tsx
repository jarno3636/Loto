'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import { getLotteryContract } from '@/utils/lottery';
import TOKENS from '@/utils/tokens';
import { getUsdPrice } from '@/utils/prices';
import { toast } from 'sonner';

export default function CreatePage() {
  const { data: walletClient } = useWalletClient();
  const [selectedToken, setSelectedToken] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch price when token changes
  useEffect(() => {
    if (selectedToken) {
      getUsdPrice(selectedToken)
        .then((price) => setUsdPrice(price))
        .catch(() => setUsdPrice(null));
    }
  }, [selectedToken]);

  // Calculate USD value when amount or price changes
  useEffect(() => {
    if (entryAmount && usdPrice) {
      const value = parseFloat(entryAmount) * usdPrice;
      setUsdValue(parseFloat(value.toFixed(2)));
    } else {
      setUsdValue(null);
    }
  }, [entryAmount, usdPrice]);

  const validateEntry = () => {
    if (!selectedToken) return 'Please select a token.';
    if (!entryAmount || parseFloat(entryAmount) <= 0) return 'Enter a valid entry amount.';
    if (usdValue === null) return 'Unable to calculate USD value.';
    if (usdValue < 1) return 'Minimum entry is $1.';
    return '';
  };

  const handleSubmit = async () => {
    const validation = validateEntry();
    if (validation) {
      setError(validation);
      return;
    }

    if (!walletClient) {
      toast.error('Please connect your wallet.');
      return;
    }

    try {
      setIsSubmitting(true);
      const signer = new ethers.BrowserProvider(window.ethereum).getSigner();
      const contract = getLotteryContract(await signer);

      const tokenInfo = TOKENS.find((t) => t.address === selectedToken);
      const amount = ethers.parseUnits(entryAmount, tokenInfo?.decimals || 18);
      const tokenContract = new ethers.Contract(selectedToken, ['function approve(address,uint256) public returns(bool)'], await signer);

      await tokenContract.approve(contract.target, amount);
      const tx = await contract.createPool(selectedToken, amount);
      await tx.wait();

      toast.success('Pool created!');
      setEntryAmount('');
      setSelectedToken('');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to create pool.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-slate-900 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Create a Pool</h1>

      <label className="block text-sm mb-1 text-white">Select Token</label>
      <select
        className="w-full p-2 bg-slate-800 rounded mb-4"
        value={selectedToken}
        onChange={(e) => setSelectedToken(e.target.value)}
      >
        <option value="">-- Choose a token --</option>
        {TOKENS.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol} ({token.name})
          </option>
        ))}
      </select>

      <label className="block text-sm mb-1 text-white">Entry Amount</label>
      <input
        type="number"
        placeholder="0.0"
        className="w-full p-2 bg-slate-800 rounded mb-2"
        value={entryAmount}
        onChange={(e) => {
          setEntryAmount(e.target.value);
          setError('');
        }}
      />

      {usdValue !== null && (
        <p className="text-sm text-gray-300 mb-2">
          ≈ ${usdValue} USD
        </p>
      )}

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded font-semibold"
      >
        {isSubmitting ? 'Creating...' : 'Create Pool'}
      </button>
    </div>
  );
}
