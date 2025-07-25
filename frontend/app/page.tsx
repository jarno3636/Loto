'use client';

import Link from 'next/link';
import PoolCard from '@/components/PoolCard';

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12 text-white bg-slate-950">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-2">🎯 Loto</h1>
        <p className="text-slate-400">Join or create Base-powered lottery pools with tokens like $TOBY, $PATIENCE, $TABOSHI, $LOTO, and more.</p>
        <Link
          href="/create"
          className="inline-block mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white"
        >
          + Create New Pool
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">🎲 Active Pools</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((poolId) => (
            <PoolCard key={poolId} poolId={poolId} />
          ))}
        </div>
      </div>
    </div>
  );
}
