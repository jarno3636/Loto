'use client';

import PoolCard, { PoolCardProps } from './PoolCard';
import { useEffect, useState } from 'react';
// import { getAllPools } from '@/lib/lottery'; // Uncomment when you have real fetch function

type Pool = PoolCardProps;

export default function HomePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching top 3 pools. Replace with real fetch logic.
    setTimeout(() => {
      setPools([
        {
          poolId: '0',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          entryAmount: '1000000000000000000',
          decimals: 18,
          players: ['0xplayer1', '0xplayer2'],
          winner: '',
          createdAt: Date.now() - 1000000,
        },
        {
          poolId: '1',
          tokenAddress: '0x0000000000000000000000000000000000000001',
          entryAmount: '5000000000000000000',
          decimals: 18,
          players: ['0xplayer1'],
          winner: '0xwinner',
          createdAt: Date.now() - 2000000,
        },
        {
          poolId: '2',
          tokenAddress: '0x0000000000000000000000000000000000000002',
          entryAmount: '2000000000000000000',
          decimals: 18,
          players: [],
          winner: '',
          createdAt: Date.now() - 3000000,
        },
      ]);
      setLoading(false);
    }, 800);

    // Uncomment this and remove the above to use real fetch:
    /*
    getAllPools().then((fetchedPools) => {
      setPools(fetchedPools.slice(0, 3));
      setLoading(false);
    });
    */
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
