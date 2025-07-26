'use client';

import { useEffect, useState } from 'react';
import { getAllPools } from '@/lib/lottery';

const PAGE_SIZE = 10;

export default function HomePage() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [poolCount, setPoolCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    const loadPools = async () => {
      try {
        const { pools, poolCount } = await getAllPools(page * PAGE_SIZE, PAGE_SIZE);
        setPools(pools);
        setPoolCount(poolCount);
      } catch (error) {
        console.error('Error loading pools:', error);
      }
      setLoading(false);
    };
    loadPools();
  }, [page]);

  return (
    <main className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">All Lottery Pools</h1>
      {loading ? (
        <p>Loading pools...</p>
      ) : pools.length === 0 ? (
        <p>No pools found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {pools.map((pool, i) => (
              <li key={i} className="bg-slate-800 p-4 rounded shadow">
                <div><strong>Pool #{pool.id}</strong></div>
                <div>Token: <span className="font-mono">{pool.token}</span></div>
                <div>Entry Amount: {pool.entryAmount.toString()}</div>
                <div>Creator: <span className="font-mono">{pool.creator}</span></div>
                <div>Players: {pool.players.length}</div>
                <div>Winner: {pool.winner || 'Not drawn'}</div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {Math.ceil(poolCount / PAGE_SIZE)}
            </span>
            <button
              className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
              disabled={(page + 1) * PAGE_SIZE >= poolCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
