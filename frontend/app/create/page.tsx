'use client';

import { useState, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { isSupportedNetwork } from '@/lib/lottery';
import { parseUnits } from 'viem';
import TokenSelector from '@/components/TokenSelector';
import { getLotteryContract } from '@/lib/lottery';
import { tokens } from '@/lib/tokenList';
import { toast } from 'sonner';

export default function CreatePage() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [entryAmount, setEntryAmount] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const isValidEntry =
    entryAmount &&
    !isNaN(Number(entryAmount)) &&
    Number(entryAmount) >= selectedToken.min &&
    Number(entryAmount) <= selectedToken.max;

  const handleCreate = async () => {
    if (!address || !chain || !isSupportedNetwork(String(chain.id))) {
      toast.error('Unsupported network.');
      return;
    }

    if (!isValidEntry) {
      toast.error(`Entry must be between ${selectedToken.min} and ${selectedToken.max} USD`);
      return;
    }

    try {
      setIsCreating(true);
      const contract = getLotteryContract();

      const tx = await contract.createPool(
        selectedToken.address,
        parseUnits(entryAmount, selectedToken.decimals)
      );

      await tx.wait();
      toast.success('Pool created!');
      setEntryAmount('');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Error creating pool');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Create a New Pool</h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-slate-300">Select Token</label>
          <TokenSelector selected={selectedToken} onSelect={setSelectedToken} />
        </div>

        <div>
          <label className="block mb-1 font-medium text-slate-300">
            Entry Amount (in USD)
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
            placeholder={`Min: ${selectedToken.min}, Max: ${selectedToken.max}`}
            className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring focus:ring-violet-500"
          />
          <p className="text-xs mt-1 text-slate-400">
            Allowed range: <strong>${selectedToken.min}</strong> – <strong>${selectedToken.max}</strong>
          </p>
        </div>

        <button
          onClick={handleCreate}
          disabled={!isValidEntry || isCreating}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded disabled:opacity-50 transition"
        >
          {isCreating ? 'Creating Pool...' : 'Create Pool'}
        </button>
      </div>
    </div>
  );
}
