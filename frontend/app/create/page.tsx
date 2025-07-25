'use client';

import { useState, useEffect } from 'react';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import { motion } from 'framer-motion';

const POOL_TYPES = [
  { label: 'Small', min: 1, max: 10, desc: 'Low stakes, more fun!' },
  { label: 'Medium', min: 10, max: 100, desc: 'Bigger pool, bigger wins.' },
  { label: 'Big', min: 100, max: 1000, desc: 'High roller action!' },
  { label: 'Custom', min: 0.1, max: 999999, desc: 'Set your own entry!' },
];

export default function CreatePoolPage() {
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [poolType, setPoolType] = useState(POOL_TYPES[0]);
  const [amount, setAmount] = useState(POOL_TYPES[0].min);
  const [usdPrice, setUsdPrice] = useState(1);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchPrice() {
      setPriceLoading(true);
      const price = await fetchUsdPrice(selectedToken.symbol);
      if (!ignore) {
        setUsdPrice(price || 1);
        setPriceLoading(false);
      }
    }
    fetchPrice();
    return () => { ignore = true; };
  }, [selectedToken]);

  useEffect(() => { setAmount(poolType.min); }, [poolType]);

  return (
    <div className="max-w-lg mx-auto mt-12">
      <div className="flex items-center gap-3 justify-center mb-2">
        <img src="/loto.PNG" className="w-10 h-10 rounded" alt="Loto Logo" />
        <span className="text-xl font-bold text-blue-400">Loto Pool Creator</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-7 rounded-2xl shadow-xl glass-card border border-blue-700/40 bg-white/10 backdrop-blur-lg transition-all hover:shadow-blue-800/40"
      >
        <h1 className="text-3xl font-extrabold mb-2 flex gap-2 items-center">
          Create a Lottery Pool
        </h1>
        <div className="mb-6 text-slate-300">
          Build your own luck. Launch a pool in seconds, invite friends, and win big!
        </div>

        {/* Token Selector (Horizontal scroll for lots of tokens) */}
        <label className="block mb-2 text-lg font-semibold">Select Token</label>
        <div className="flex gap-3 overflow-x-auto mb-5 py-1 hide-scrollbar snap-x">
          {tokenList.map(token => (
            <button
              key={token.address}
              onClick={() => setSelectedToken(token)}
              className={`flex-shrink-0 snap-center flex items-center px-3 py-2 rounded-xl bg-slate-800 border-2 transition-all
                ${selectedToken.address === token.address
                  ? 'border-blue-500 ring-2 ring-blue-400'
                  : 'border-slate-700 hover:border-blue-700'}
              `}
              style={{ minWidth: 120 }}
            >
              <img
                src={token.logoURI || '/token-placeholder.png'}
                alt={token.symbol}
                className="w-6 h-6 mr-2 rounded-full"
                onError={e => (e.currentTarget.src = '/token-placeholder.png')}
              />
              <div>
                <div className="font-bold">{token.symbol}</div>
                <div className="text-xs text-slate-400">{token.name}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Pool Type Selector */}
        <label className="block mb-2 text-lg font-semibold">Pool Type</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {POOL_TYPES.map(type => (
            <motion.button
              layout
              key={type.label}
              onClick={() => setPoolType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow
                ${poolType.label === type.label
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white scale-105'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}
              `}
              whileHover={{ scale: 1.08 }}
            >
              <div>{type.label}</div>
              <div className="text-xs text-slate-300 font-normal">{type.desc}</div>
            </motion.button>
          ))}
        </div>

        {/* Entry Amount */}
        <label className="block mb-2 text-lg font-semibold">
          Entry Amount ({selectedToken.symbol})
        </label>
        <div className="flex gap-3 items-center mb-2">
          <input
            type="range"
            min={poolType.min}
            max={poolType.max}
            step={poolType.label === 'Custom' ? '0.1' : '1'}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="flex-grow accent-blue-500"
            autoFocus
          />
          <input
            type="number"
            value={amount}
            min={poolType.min}
            max={poolType.max}
            step={poolType.label === 'Custom' ? '0.1' : '1'}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-24 px-2 py-1 rounded-lg border border-slate-700 bg-slate-900 text-white"
          />
        </div>
        <div className="flex justify-between mb-5 text-sm text-slate-400">
          <div>
            Min: <b>{poolType.min}</b> / Max: <b>{poolType.max}</b>
          </div>
          <div>
            ~ {priceLoading ? <span className="animate-pulse">Loading...</span> : `$${(amount * usdPrice).toFixed(2)} USD`}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-lg py-3 text-lg shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all"
          disabled={amount < poolType.min || amount > poolType.max}
        >
          Create Pool
        </motion.button>
      </motion.div>
    </div>
  );
}
