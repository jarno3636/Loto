'use client';

import PoolCard, { PoolCardProps } from './PoolCard';
import { useEffect, useState } from 'react';
import { getAllPools } from '@/lib/lottery';

export default function HomePools() {
  const [pools, setPools] = useState<PoolCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPools = async () => {
      try {
        const fetchedPools = await getAllPools();
        setPools(fetchedPools.slice(0, 3)); // Only top 3 pools
      } catch (err) {
        setPools([]);
      }
      setLoading(false);
    };
    loadPools();
  }, []);

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Live Lottery Pools</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 h-48 rounded-lg animate-pulse"
            ></div>
          ))
        ) : (
          pools.map((pool) => (
            <PoolCard key={pool.poolId} {...pool} />
          ))
        )}
      </div>
    </section>
  );
}
