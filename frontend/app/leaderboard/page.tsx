// app/leaderboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { getLotteryContract } from '@/utils/lottery';
import { useWalletClient } from 'wagmi';
import { formatEther } from 'viem';
import tokenList from '@/lib/tokenList';

export default function LeaderboardPage() {
  const { data: walletClient } = useWalletClient();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!walletClient) return;
      const contract = getLotteryContract(walletClient);
      const poolCount = await contract.poolCount();

      const results = await Promise.all(
        Array.from({ length: poolCount }, async (_, i) => {
          const pool = await contract.pools(i);
          return {
            id: i,
            token: pool.token,
            entryAmount: formatEther(pool.entryAmount),
            players: pool.players.length,
            winner: pool.winner,
          };
        })
      );

      setStats(results);
    }

    fetchData();
  }, [walletClient]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">🏆 Leaderboard</h1>

      {stats.length === 0 ? (
        <p className="text-center text-gray-400">Loading pool stats...</p>
      ) : (
        <div className="grid gap-6">
          {stats.map((pool) => {
            const tokenInfo = tokenList.find((t) => t.address.toLowerCase() === pool.token.toLowerCase());

            return (
              <div
                key={pool.id}
                className="bg-slate-800 rounded-lg p-4 shadow-md flex items-center justify-between hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-4">
                  {tokenInfo && (
                    <img src={tokenInfo.logoURI} alt={tokenInfo.symbol} className="h-8 w-8 rounded-full" />
                  )}
                  <div>
                    <p className="font-semibold text-white">Pool #{pool.id}</p>
                    <p className="text-sm text-gray-400">{tokenInfo?.symbol || 'Token'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">Players: {pool.players}</p>
                  <p className="text-white">Entry: {pool.entryAmount}</p>
                  {pool.winner !== '0x0000000000000000000000000000000000000000' && (
                    <p className="text-green-400 text-sm">✅ Winner selected</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
