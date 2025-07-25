'use client';

import { useState, useEffect } from 'react';
import { getLotteryContract } from '@/lib/lottery';
import { useProvider } from 'wagmi';
import PoolCard from '@/components/PoolCard';

export default function HomePage() {
  const [poolCount, setPoolCount] = useState(0);
  const provider = useProvider();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const contract = getLotteryContract(provider);
        const count = await contract.poolCount();
        setPoolCount(count.toNumber());
      } catch (err) {
        console.error('Failed to load pool count:', err);
      }
    };
    fetchCount();
  }, [provider]);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-violet-500">🎰 Loto</h1>
        <p className="text-lg text-slate-300 mb-6">
          Join community-powered lottery pools on Base. Select a token, enter the pool, and win it all.
        </p>
        <a
          href="/create"
          className="inline-block bg-violet-600 hover:bg-violet-500 transition px-6 py-3 rounded text-white font-semibold"
        >
          + Create a Pool
        </a>
      </div>

      <div className="mt-12 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-white">📦 Active Pools</h2>

        {poolCount === 0 ? (
          <p className="text-slate-400">No pools yet. Be the first to create one!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: poolCount }).map((_, index) => (
              <PoolCard key={index} poolId={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
