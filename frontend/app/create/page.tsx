'use client';

import { useState } from 'react';
import { useAccount, useSigner, useNetwork } from 'wagmi';
import { getLotteryContract, isSupportedNetwork, getTokenPriceUSD } from '../../utils/lottery';
import { commonTokens } from '../../utils/commonTokens';
import Image from 'next/image';

export default function CreatePool() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const [selectedToken, setSelectedToken] = useState<string>('');
  const [entryAmount, setEntryAmount] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEntryAmount = async () => {
    if (!selectedToken || !entryAmount) return false;

    const usdValue = await getTokenPriceUSD(selectedToken, parseFloat(entryAmount));
    if (!usdValue) {
      setError('Token price unavailable. Try again later.');
      return false;
    }

    if (usdValue < 1) {
      setError('Entry amount must be at least $1 USD');
      return false;
    }

    if (usdValue > 100) {
      setError('Entry amount exceeds $100 USD');
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    setError('');
    setSuccess('');

    if (!signer || !isSupportedNetwork(chain?.id?.toString() || '')) {
      setError('Please connect to Base network.');
      return;
    }

    const isValid = await validateEntryAmount();
    if (!isValid) return;

    try {
      setCreating(true);
      const contract = getLotteryContract(signer);
      const tx = await contract.createPool(selectedToken, ethers.utils.parseUnits(entryAmount, 18));
      await tx.wait();
      setSuccess('🎉 Pool created successfully!');
      setEntryAmount('');
      setSelectedToken('');
    } catch (err: any) {
      console.error(err);
      setError('Failed to create pool.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen py-10 px-4 bg-slate-950 text-white">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🌀 Create a Lottery Pool</h1>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Select Token</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
          >
            <option value="">-- Choose Token --</option>
            {commonTokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium">Entry Amount (in Token)</label>
          <input
            type="number"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
            placeholder="e.g. 5"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            onClick={handleCreate}
            disabled={creating || !address}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded mt-4 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Pool'}
          </button>
        </div>
      </div>
    </main>
  );
}
