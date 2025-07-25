'use client';

import { useEffect, useState } from 'react';
import { getAllPools } from '@/utils/lottery';
import { motion } from 'framer-motion';
import PoolCard from '@/components/PoolCard';

interface Pool {
  id: string;
  token: string;
  entryAmount: bigint;
  decimals: number;
  players: number;
  maxPlayers: number;
  rangeType: string;
}

export default function HomePage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPools = async () => {
      try {
        const data = await getAllPools();
        setPools(data);
      } catch (err) {
        console.error('Failed to fetch pools:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPools();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 text-white">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Active Lottery Pools
      </motion.h1>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-slate-700 h-32 rounded-lg"
            ></div>
          ))}
        </div>
      ) : pools.length === 0 ? (
        <div className="text-center mt-12 text-gray-400">
          <p className="text-xl mb-2">🎟️ No active pools yet.</p>
          <p>Create the first pool and be the early winner!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <PoolCard
              key={pool.id}
              poolId={pool.id}
              tokenAddress={pool.token}
              entryAmount={pool.entryAmount}
              decimals={pool.decimals}
              players={pool.players}
              maxPlayers={pool.maxPlayers}
              rangeType={pool.rangeType}
            />
          ))}
        </div>
      )}
    </main>
  );
}
