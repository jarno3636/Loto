
'use client';

import { motion } from 'framer-motion';

type PoolCardProps = {
  poolId: number;
  tokenSymbol?: string;
  entries?: number;
  usdValue?: number;
};

export default function PoolCard({ poolId, tokenSymbol = "TOKEN", entries = 0, usdValue = 0 }: PoolCardProps) {
  return (
    <motion.div
      className="rounded-lg border border-slate-800 p-4 shadow-md hover:shadow-violet-600 transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * poolId }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Pool #{poolId}</h2>
        <span className="bg-slate-700 text-xs px-2 py-1 rounded">{tokenSymbol}</span>
      </div>
      <p className="text-sm text-gray-400">Entries: {entries}</p>
      <p className="text-sm text-gray-400">Value: ${usdValue.toFixed(2)}</p>
    </motion.div>
  );
}
