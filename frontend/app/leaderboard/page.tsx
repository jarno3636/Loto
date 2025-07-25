'use client';

import { useEffect, useState } from 'react';
import { getAllPoolEntries } from '@/utils/lottery';
import { formatUnits } from 'ethers';
import Image from 'next/image';

interface Entry {
  player: string;
  amount: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenLogo: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    async function loadData() {
      const allEntries = await getAllPoolEntries(); // You may replace with mock data for now
      setEntries(allEntries);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

      {entries.length === 0 ? (
        <p className="text-slate-400">No entries yet. Join a pool to climb the ranks!</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border border-slate-700 bg-slate-900/50 rounded-lg"
            >
              <div className="text-xl font-bold text-slate-300 w-6">{index + 1}</div>

              <Image
                src={entry.tokenLogo || '/fallback-token.png'}
                alt={entry.tokenSymbol}
                width={32}
                height={32}
                className="rounded-full"
              />

              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200 truncate">{entry.player}</p>
                <p className="text-xs text-slate-400">{entry.tokenSymbol}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold">
                  {parseFloat(formatUnits(entry.amount || '0', 18)).toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
