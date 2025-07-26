'use client';

import { useEffect, useState } from 'react';
import { getAllPools } from '@/lib/lottery';

type Pool = {
  id: number;
  creator: string;
  token: string;
  entryAmount: string;
  createdAt: string;
  players: string[];
  winner: string;
};

export default function HomePage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPools() {
      setLoading(true);
      try {
        const data = await getAllPools();
        setPools(data);
      } catch (error) {
        console.error('Failed to fetch pools:', error);
      }
      setLoading(false);
    }

    fetchPools();
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Active Lottery Pools</h1>
      {loading ? (
        <p>Loading pools...</p>
      ) : pools.length === 0 ? (
        <p>No pools found.</p>
      ) : (
        <ul className="space-y-4">
          {pools.map(pool => (
            <li key={pool.id} className="bg-slate-800 p-4 rounded shadow">
              <div><strong>Pool #{pool.id}</strong></div>
              <div>Token: <span className="font-mono">{pool.token}</span></div>
              <div>Entry Amount: {pool.entryAmount.toString()}</div>
              <div>Creator: <span className="font-mono">{pool.creator}</span></div>
              <div>Players: {pool.players.length}</div>
              <div>Winner: {pool.winner ? pool.winner : 'Not drawn'}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
