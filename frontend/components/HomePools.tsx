'use client';

import PoolCard from './PoolCard';
import { useEffect, useState } from 'react';

export default function HomePools() {
  const [poolIds, setPoolIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading top 3 pools
    setTimeout(() => {
      setPoolIds([0, 1, 2]);
      setLoading(false);
    }, 800);
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
          poolIds.map((id) => (
            <PoolCard key={id} poolId={String(id)} />  // <--- Fix: id converted to string
          ))
        )}
      </div>
    </section>
  );
}
