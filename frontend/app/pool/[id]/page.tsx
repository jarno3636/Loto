'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import { getLotteryContract } from '@/lib/lottery';
import { ethers, BrowserProvider, parseUnits } from 'ethers';
import { motion } from 'framer-motion';

// Helper to get ethers v6 signer from browser wallet (MetaMask, Coinbase, etc)
async function getEthersSigner() {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  const provider = new BrowserProvider(window.ethereum);
  return await provider.getSigner();
}

export default function PoolDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [poolId, setPoolId] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = tokenList.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase());

  useEffect(() => {
    if (typeof id === 'string') {
      setPoolId(id);
      const parts = id.split('-');
      if (parts.length > 1) {
        setTokenAddress(parts[0]);
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchValue = async () => {
      if (token && entryAmount) {
        const price = await fetchUsdPrice(token.symbol);
        if (price) {
          setUsdValue(parseFloat(entryAmount) * price);
        }
      }
    };
    fetchValue();
  }, [token, entryAmount]);

  const handleEnter = async () => {
    if (!token) {
      setError('Connect your wallet and select a token.');
      return;
    }
    if (!entryAmount || isNaN(Number(entryAmount)) || Number(entryAmount) <= 0) {
      setError('Enter a valid entry amount.');
      return;
    }

    try {
      const signer = await getEthersSigner();
      if (!signer) {
        setError('Could not connect to wallet provider.');
        return;
      }
      const contract = getLotteryContract(signer);
      const parsedAmount = parseUnits(entryAmount, token.decimals);

      const tokenContract = new ethers.Contract(
        token.address,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      );

      const approvalTx = await tokenContract.approve(contract.address, parsedAmount);
      await approvalTx.wait();

      const tx = await contract.enterPool(poolId, parsedAmount);
      await tx.wait();

      setSuccess('Successfully entered the pool!');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Transaction failed.');
    }
  };

  return (
    <motion.main
      className="max-w-xl mx-auto p-6 text-white"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Enter Pool</h1>

      {token ? (
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 rounded" />
            <h2 className="text-xl font-semibold">{token.name} ({token.symbol})</h2>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mb-4">Loading token info...</p>
      )}

      <div className="mb-4">
        <label className="block mb-2">Entry Amount ({token?.symbol || 'Token'})</label>
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
        onClick={handleEnter}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition-colors"
        whileTap={{ scale: 0.97 }}
        disabled={!token || !!error}
      >
        Enter Pool
      </motion.button>
    </motion.main>
  );
}
