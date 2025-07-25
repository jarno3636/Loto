'use client';

import PoolCard from '@/components/PoolCard';
import { useEffect, useState } from 'react';
import { getLotteryContract } from '@/lib/lottery';
import { usePublicClient } from 'wagmi';

export default function HomePage() {
  const [poolCount, setPoolCount] = useState(0);
  const client = usePublicClient();

  useEffect(() => {
    async function fetchCount() {
      if (!client) return;
      try {
        const contract = getLotteryContract(client);
        const count = await contract.poolCount();
        setPoolCount(Number(count));
      } catch (err) {
        console.error('Failed to load pool count:', err);
      }
    }
    fetchCount();
  }, [client]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Active Pools</h1>

      {poolCount === 0 ? (
        <p className="text-gray-400">No pools yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: poolCount }, (_, i) => (
            <PoolCard key={i} poolId={i} />
          ))}
        </div>
      )}
    </main>
  );
}
