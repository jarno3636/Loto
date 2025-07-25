// app/create/page.tsx

'use client';

import { useState } from 'react';
import { useWalletClient } from 'wagmi';
import { getLotteryContract } from '@/utils/lottery';
import tokenList from '@/lib/tokenList';
import { parseUnits } from 'viem';

export default function CreatePage() {
  const { data: walletClient } = useWalletClient();
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [usdValue, setUsdValue] = useState('');
  const [status, setStatus] = useState('');

  const validRange = {
    min: 1, // $1 minimum
    max: 50, // $50 maximum
  };

  const handleCreatePool = async () => {
    if (!walletClient) return alert('Connect your wallet first!');
    const usdAmount = parseFloat(usdValue);
    if (isNaN(usdAmount) || usdAmount < validRange.min || usdAmount > validRange.max) {
      return setStatus(`❌ Amount must be between $${validRange.min} and $${validRange.max}`);
    }

    const contract = getLotteryContract(walletClient);
    const tokenPrice = selectedToken.usdPrice ?? 1;
    const amount = parseUnits((usdAmount / tokenPrice).toFixed(6), selectedToken.decimals);

    try {
      setStatus('Creating pool...');
      const tx = await contract.createPool(selectedToken.address, amount);
      await tx.wait();
      setStatus('✅ Pool created!');
    } catch (err: any) {
      console.error(err);
      setStatus('❌ Error creating pool');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">🎯 Create Pool</h1>

      <div className="mb-4">
        <label className="block mb-2">Select Token</label>
        <select
          className="w-full bg-slate-800 p-3 rounded text-white"
          value={selectedToken.address}
          onChange={(e) =>
            setSelectedToken(tokenList.find((t) => t.address === e.target.value)!)
          }
        >
          {tokenList.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} — ${token.usdPrice?.toFixed(2) ?? '?'}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Entry Amount (USD)</label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g. 5"
          value={usdValue}
          onChange={(e) => setUsdValue(e.target.value)}
          className="w-full bg-slate-800 p-3 rounded text-white"
        />
        <p className="text-sm text-gray-400 mt-1">
          Must be between ${validRange.min} and ${validRange.max}
        </p>
      </div>

      <button
        onClick={handleCreatePool}
        className="bg-emerald-500 hover:bg-emerald-600 transition text-white px-4 py-2 rounded w-full font-semibold"
      >
        🚀 Create Pool
      </button>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}
