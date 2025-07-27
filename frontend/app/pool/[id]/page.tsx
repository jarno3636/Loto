'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import { getLotteryContract } from '@/lib/lottery';
import { ethers, BrowserProvider, parseUnits } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [submitting, setSubmitting] = useState(false);

  const token = tokenList.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase());

  useEffect(() => {
    if (typeof id === 'string') {
      setPoolId(id);
      // If your ID is just the index, adjust this logic!
      // Otherwise, parse it to get the token address
      // For demo: use the URL's param directly for tokenAddress
      // (Replace this logic if your app routes differently)
      const parts = id.split('-');
      if (parts.length > 1) {
        setTokenAddress(parts[0]);
      } else {
        // fallback: try just the id
        setTokenAddress(id);
      }
    }
  }, [id]);

  useEffect(() => {
    setUsdValue(null);
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
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      if (!token) throw new Error('Token not found. Try again.');
      if (!entryAmount || isNaN(Number(entryAmount)) || Number(entryAmount) <= 0)
        throw new Error('Enter a valid entry amount.');

      const signer = await getEthersSigner();
      if (!signer) throw new Error('Could not connect to wallet provider.');

      const contract = getLotteryContract(signer);
      const parsedAmount = parseUnits(entryAmount, token.decimals);

      // Approve token if needed
      const tokenContract = new ethers.Contract(
        token.address,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      );

      const approvalTx = await tokenContract.approve(contract.address, parsedAmount);
      await approvalTx.wait();

      const tx = await contract.enterPool(poolId, parsedAmount);
      await tx.wait();

      setSuccess('Successfully entered the pool! 🎉');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Transaction failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Error/Success toast animation
  function DismissibleAlert({ type, message, onClose }: { type: 'error' | 'success', message: string, onClose: () => void }) {
    return (
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium shadow ${
              type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{message}</span>
              <button className="ml-4 text-white/80 hover:text-white" onClick={onClose}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.main
      className="max-w-xl mx-auto p-6 min-h-screen flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="glass-card w-full rounded-3xl px-6 py-7 border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-lg"
        initial={{ scale: 0.97, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <img
              src={token?.logoURI || '/token-placeholder.png'}
              alt={token?.symbol || 'Token'}
              className="w-12 h-12 rounded-xl border-2 border-white/20 bg-white/10 object-contain"
              onError={e => (e.currentTarget.src = '/token-placeholder.png')}
            />
            {!token && (
              <div className="absolute inset-0 bg-slate-700 animate-pulse rounded-xl" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-0">{token?.name || <span className="animate-pulse text-slate-400">Loading...</span>}</h2>
            <div className="text-blue-400 font-mono text-lg">{token?.symbol}</div>
          </div>
        </div>

        <label className="block mb-2 font-semibold text-lg">
          Entry Amount ({token?.symbol || 'Token'})
        </label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            step="any"
            value={entryAmount}
            min="0"
            onChange={(e) => setEntryAmount(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold text-xl"
            disabled={submitting}
          />
          <span className="font-mono text-slate-400 px-2">{token?.symbol}</span>
        </div>
        {usdValue && (
          <p className="text-sm text-blue-300 mb-4">≈ ${usdValue.toFixed(2)} USD</p>
        )}

        {/* Error/Success Alerts */}
        <DismissibleAlert type="error" message={error} onClose={() => setError('')} />
        <DismissibleAlert type="success" message={success} onClose={() => setSuccess('')} />

        <motion.button
          onClick={handleEnter}
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-3 rounded-xl font-extrabold text-lg shadow-lg transition-all mt-3 mb-2"
          whileTap={{ scale: 0.97 }}
          disabled={!token || !entryAmount || !!error || submitting}
        >
          {submitting ? "Processing..." : "Enter Pool"}
        </motion.button>
        <button
          className="block w-full mt-2 text-center text-slate-400 hover:text-violet-400 transition underline"
          onClick={() => router.push('/')}
        >
          ← Back to Pools
        </button>
      </motion.div>
    </motion.main>
  );
}
