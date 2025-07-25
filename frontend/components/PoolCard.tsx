'use client';

import { useEffect, useState } from 'react';
import { getLotteryContract } from '../utils/lottery';
import { useProvider } from 'wagmi';
import JoinPoolModal from './JoinPoolModal';

interface PoolCardProps {
  poolId: number;
}

export default function PoolCard({ poolId }: PoolCardProps) {
  const provider = useProvider();
  const [pool, setPool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    async function fetchPool() {
      try {
        const contract = getLotteryContract(provider);
        const data = await contract.pools(poolId);

        const players = await contract.getPoolPlayers(poolId).catch(() => []);
        setPool({
          ...data,
          players,
          playerCount: players?.length || 0,
        });
      } catch (err) {
        console.error('Error loading pool', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPool();
  }, [provider, poolId]);

  if (loading) {
    return (
      <div className="bg-slate-900 p-4 rounded-lg shadow animate-pulse h-[150px]">
        Loading pool #{poolId}...
      </div>
    );
  }

  if (!pool || pool.entryAmount.eq(0)) {
    return null; // skip empty pools
  }

  return (
    <div className="bg-slate-900 p-4 rounded-lg shadow-md border border-slate-700">
      <div className="text-lg font-semibold mb-2">Pool #{poolId}</div>
      <div className="text-sm text-slate-400 mb-1">Token: {pool.token}</div>
      <div className="text-sm text-slate-400 mb-1">
        Entry: {Number(pool.entryAmount) / 1e18} tokens
      </div>
      <div className="text-sm text-slate-400 mb-1">Players: {pool.playerCount}</div>

      <button
        onClick={() => setShowJoin(true)}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        Join Pool
      </button>

      <JoinPoolModal isOpen={showJoin} onClose={() => setShowJoin(false)} poolId={poolId} />
    </div>
  );
}
