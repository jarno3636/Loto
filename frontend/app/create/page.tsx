'use client';

import { useEffect, useState } from "react";
import { useWalletClient, useChain } from 'wagmi';
import { ethers } from 'ethers';
import { getLotteryContract } from '@/lib/lottery';
import { tokenList, TokenInfo } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import { useRouter } from 'next/navigation';
import ToastAlert from "@/components/ToastAlert";
import ERC20_ABI from '@/lib/erc20abi.json'; // Ensure this file exists

export default function CreatePoolPage() {
  const { data: walletClient } = useWalletClient();
  const { chain } = useChain();
  const router = useRouter();

  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [entryAmount, setEntryAmount] = useState('');
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedToken && entryAmount) {
        const price = await fetchUsdPrice(selectedToken.symbol);
        if (price) {
          const value = parseFloat(entryAmount) * price;
          setUsdValue(value);
          if (value < 1) {
            setError('Minimum entry is $1.');
          } else if (value > 50) {
            setError('Maximum entry for Medium Pool is $50.');
          } else {
            setError('');
          }
        } else {
          setError('Failed to fetch token price.');
        }
      } else {
        setUsdValue(null);
        setError('');
      }
    };
    fetchPrice();
  }, [selectedToken, entryAmount]);

  const handleCreate = async () => {
    if (!walletClient) {
      setToastMsg("Connect your wallet to create a pool.");
      setToastType("error");
      return;
    }

    if (!selectedToken) {
      setToastMsg("Please select a token.");
      setToastType("error");
      return;
    }

    if (!entryAmount || Number(entryAmount) <= 0) {
      setToastMsg("Enter a valid entry amount.");
      setToastType("error");
      return;
    }

    if (!chain || chain.id !== 8453) {
      setToastMsg("Please connect to Base Mainnet.");
      setToastType("error");
      return;
    }

    try {
      setLoading(true);
      const contract = getLotteryContract(walletClient);
      const tokenContract = new ethers.Contract(
        selectedToken.address,
        ERC20_ABI,
        walletClient
      );

      const parsedAmount = ethers.utils.parseUnits(entryAmount, selectedToken.decimals);
      const allowance = await tokenContract.allowance(walletClient.account.address, contract.address);

      if (allowance.lt(parsedAmount)) {
        const tx = await tokenContract.approve(contract.address, parsedAmount);
        await tx.wait();
      }

      const tx = await contract.createPool(selectedToken.address, parsedAmount);
      await tx.wait();

      setToastMsg("Pool created successfully!");
      setToastType("success");
      setTimeout(() => router.push('/'), 3000);
    } catch (err: any) {
      console.error("Error creating pool:", err);
      setToastMsg("Something went wrong. Please try again.");
      setToastType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Create a Lottery Pool</h1>

      <div className="mb-4">
        <label className="block mb-2">Select Token</label>
        <select
          className="w-full p-2 bg-slate-800 text-white rounded"
          onChange={(e) =>
            setSelectedToken(tokenList.find((t) => t.address === e.target.value) || null)
          }
        >
          <option value="">-- Choose Token --</option>
          {tokenList.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
        {selectedToken && (
          <div className="flex items-center mt-2 gap-2">
            <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="h-6 w-6" />
            <span>{selectedToken.name}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Entry Amount ({selectedToken?.symbol || 'Token'})
        </label>
        <input
          type="number"
          step="any"
          className="w-full p-2 bg-slate-800 text-white rounded"
          value={entryAmount}
          onChange={(e) => setEntryAmount(e.target.value)}
        />
        {usdValue && (
          <p className="text-sm text-gray-400 mt-1">
            ≈ ${usdValue.toFixed(2)} USD
          </p>
        )}
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <button
        title="Click to create a new pool with the above settings."
        className={`w-full text-white font-semibold py-2 rounded ${
          error || !selectedToken
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-violet-600 hover:bg-violet-700'
        }`}
        onClick={handleCreate}
        disabled={!selectedToken || !!error || loading}
      >
        {loading ? 'Creating Pool...' : 'Create Pool'}
      </button>

      {toastMsg && (
        <ToastAlert type={toastType} message={toastMsg} onClose={() => setToastMsg('')} />
      )}
    </main>
  );
}
