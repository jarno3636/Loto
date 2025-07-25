// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import PoolCard from '../components/PoolCard';
import { getLotteryContract } from '../utils/lottery';
import { useProvider } from 'wagmi';

export default function Home() {
  const provider = useProvider();
  const [poolIds, setPoolIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPools() {
      try {
        const contract = getLotteryContract(provider);
        const totalPools = await contract.poolCount();
        const ids = [];

        for (let i = totalPools - 1; i >= 0 && ids.length < 20; i--) {
          ids.push(i);
        }

        setPoolIds(ids);
      } catch (err) {
        console.error('Error loading pool list:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPools();
  }, [provider]);

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🎉 Active Lottery Pools</h1>

        {loading ? (
          <p className="text-center text-slate-400">Loading pools...</p>
        ) : poolIds.length === 0 ? (
          <p className="text-center text-slate-400">No pools available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {poolIds.map((id) => (
              <PoolCard key={id} poolId={id} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
