'use client';

import { useState } from 'react';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { getLotteryContract } from '@/utils/lottery';
import tokenList from '@/lib/tokenList';

const SMALL_POOL_RANGE = [1, 5]; // USD
const MEDIUM_POOL_RANGE = [5, 25]; // USD

export default function CreatePoolPage() {
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [entryAmount, setEntryAmount] = useState('');
  const [message, setMessage] = useState('');
  const { walletProvider } = useWeb3ModalProvider();

  const handleCreatePool = async () => {
    if (!walletProvider || !selectedToken) return;
    const provider = new ethers.BrowserProvider(walletProvider!);
    const signer = await provider.getSigner();
    const contract = getLotteryContract(signer);

    const price = selectedToken.priceUsd || 0;
    const amountUsd = parseFloat(entryAmount) * price;

    if (amountUsd < SMALL_POOL_RANGE[0] || (amountUsd > SMALL_POOL_RANGE[1] && amountUsd < MEDIUM_POOL_RANGE[0])) {
      return setMessage('⚠️ Amount does not match any allowed range.');
    }

    const decimals = selectedToken.decimals || 18;
    const amountInWei = ethers.parseUnits(entryAmount, decimals);

    try {
      await contract.createPool(selectedToken.address, amountInWei);
      setMessage('✅ Pool created successfully!');
    } catch (err) {
      setMessage('❌ Error creating pool.');
    }
  };

  const estimatedUsd = () => {
    const amount = parseFloat(entryAmount);
    const price = selectedToken.priceUsd || 0;
    if (!amount || !price) return '';
    return (amount * price).toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10 text-white">
      <h1 className="text-2xl font-bold mb-4">Create a Pool</h1>

      <label className="text-sm text-slate-300">Choose Token</label>
      <select
        value={selectedToken.address}
        onChange={(e) =>
          setSelectedToken(tokenList.find((t) => t.address === e.target.value)!)
        }
        className="w-full mt-1 mb-4 p-2 bg-slate-800 border border-slate-600 rounded"
      >
        {tokenList.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>

      <label className="text-sm text-slate-300">Entry Amount ({selectedToken?.symbol})</label>
      <input
        type="number"
        value={entryAmount}
        onChange={(e) => setEntryAmount(e.target.value)}
        className="w-full mt-1 mb-4 p-2 bg-slate-800 border border-slate-600 rounded"
        placeholder="0.0"
      />
      {estimatedUsd() && (
        <div className="text-sm text-slate-400 mb-4">
          Estimated USD: ${estimatedUsd()}
        </div>
      )}

      <button
        onClick={handleCreatePool}
        className="w-full bg-emerald-500 hover:bg-emerald-600 transition py-2 rounded font-semibold text-white"
      >
        Create Pool
      </button>

      {message && (
        <div className="mt-4 text-sm text-center text-slate-300">{message}</div>
      )}
    </div>
  );
}
