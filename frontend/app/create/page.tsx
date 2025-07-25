'use client';

import { useState, useEffect } from 'react';
import { useWalletClient, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { getLotteryContract } from '@/lib/lottery';
import { tokenList, TokenInfo } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import { motion } from 'framer-motion';

export default function CreatePoolPage() {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const router = useRouter();

  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [entryAmount, setEntryAmount] = useState('');
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedToken && entryAmount) {
        const price = await fetchUsdPrice(selectedToken.symbol);
        if (price) {
          const usd = parseFloat(entryAmount) * price;
          setUsdValue(usd);
          if (usd < 1) {
            setError('Minimum entry is $1.');
          } else if (usd > 50) {
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
      setError('Connect your wallet to create a pool.');
      return;
    }

    if (!selectedToken) {
      setError('Please select a token.');
      return;
    }

    if (!entryAmount || isNaN(Number(entryAmount)) || Number(entryAmount) <= 0) {
      setError('Enter a valid token amount.');
      return;
    }

    if (chainId !== 8453) {
      setError('Please switch to Base Mainnet.');
      return;
    }

    try {
      const contract = getLotteryContract(walletClient);
      const parsedAmount = ethers.utils.parseUnits(entryAmount, selectedToken.decimals);

      const tokenContract = new ethers.Contract(
        selectedToken.address,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        walletClient
      );

      const approveTx = await tokenContract.approve(contract.address, parsedAmount);
      await approveTx.wait();

      const tx = await contract.createPool(selectedToken.address, parsedAmount);
      await tx.wait();

      setSuccess('Pool created successfully!');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Transaction failed. Please try again.');
    }
  };

  return (
    <motion.main
      className="max-w-xl mx-auto p-6 text-white"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">🎉 Create a Lottery Pool</h1>

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
          Entry Amount {selectedToken ? `(${selectedToken.symbol})` : ''}
        </label>
        <input
          type="number"
          step="any"
          value={entryAmount}
          onChange={(e) => setEntryAmount(e.target.value)}
          className="w-full p-2 bg-slate-800 text-white rounded"
        />
        {usdValue && (
          <p className="text-sm text-gray-400 mt-1">
            ≈ ${usdValue.toFixed(2)} USD
          </p>
        )}
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {success && <p className="text-green-400 mb-4">{success}</p>}

      <motion.button
        title="Click to create a new pool with the above settings."
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded transition-colors"
        whileTap={{ scale: 0.97 }}
        onClick={handleCreate}
        disabled={!selectedToken || !!error}
      >
        Create Pool
      </motion.button>
    </motion.main>
  );
}
