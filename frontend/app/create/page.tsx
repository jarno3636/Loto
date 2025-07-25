'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { useWalletClient, useChainId } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import FadeWrapper from '@/components/FadeWrapper';
import { getLotteryContract } from '@/lib/lottery';
import { tokenList, TokenInfo } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import ToastAlert from '@/components/ToastAlert';
import { ERC20_ABI } from '@/lib/constants';

export default function CreatePoolPage() {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const router = useRouter();

  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [entryAmount, setEntryAmount] = useState('');
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedToken && entryAmount) {
        const price = await fetchUsdPrice(selectedToken.symbol);
        if (price) {
          const value = parseFloat(entryAmount) * price;
          setUsdValue(value);
        } else {
          setToastMsg('Failed to fetch token price.');
          setToastType('error');
        }
      } else {
        setUsdValue(null);
      }
    };
    fetchPrice();
  }, [selectedToken, entryAmount]);

  const handleCreate = async () => {
    if (!walletClient || !selectedToken || !entryAmount || chainId !== 8453) {
      setToastMsg('Check wallet, token, entry, or network.');
      setToastType('error');
      return;
    }

    try {
      const contract = getLotteryContract(walletClient);
      const parsedAmount = ethers.utils.parseUnits(entryAmount, selectedToken.decimals);

      const tokenContract = new ethers.Contract(selectedToken.address, ERC20_ABI, walletClient);
      const allowance = await tokenContract.allowance(walletClient.account.address, contract.address);

      if (allowance.lt(parsedAmount)) {
        const tx = await tokenContract.approve(contract.address, parsedAmount);
        await tx.wait();
      }

      const tx = await contract.createPool(selectedToken.address, parsedAmount);
      await tx.wait();

      setToastMsg('Pool created successfully!');
      setToastType('success');
      router.push('/');
    } catch (err) {
      console.error(err);
      setToastMsg('Pool creation failed.');
      setToastType('error');
    }
  };

  return (
    <FadeWrapper>
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
        </div>

        <div className="mb-4">
          <label className="block mb-2">Entry Amount ({selectedToken?.symbol || 'Token'})</label>
          <input
            type="number"
            step="any"
            className="w-full p-2 bg-slate-800 text-white rounded"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
          />
          {usdValue && (
            <p className="text-sm text-gray-400 mt-1">≈ ${usdValue.toFixed(2)} USD</p>
          )}
        </div>

        <motion.button
          title="Click to create a new pool with the above settings."
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          disabled={!selectedToken || !!error}
        >
          Create Pool
        </motion.button>

        {toastMsg && <ToastAlert message={toastMsg} type={toastType} />}
      </main>
    </FadeWrapper>
  );
}
