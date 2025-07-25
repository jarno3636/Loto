'use client';

import { useEffect, useState } from 'react';
import { getLotteryContract } from '@/lib/lottery';
import { usePublicClient } from 'wagmi';
import { getTokenMetadata } from '@/lib/tokenList';
import { formatUnits } from 'viem';
import Link from 'next/link';

interface Props {
  poolId: number;
}

export default function PoolCard({ poolId }: Props) {
  const [entryAmount, setEntryAmount] = useState<bigint | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const client = usePublicClient();

  useEffect(() => {
    async function fetchData() {
      if (!client) return;
      try {
        const contract = getLotteryContract(client);
        const pool = await contract.pools(poolId);
        setEntryAmount(pool.entryAmount);
        setTokenAddress(pool.token);
        const playersList: string[] = await contract.getPlayers(poolId);
        setPlayers(playersList);
      } catch (err) {
        console.error('Failed to load pool info:', err);
      }
    }
    fetchData();
  }, [client, poolId]);

  const metadata = tokenAddress ? getTokenMetadata(tokenAddress) : null;
  const entryCount = players.length;
  const maxPlayers = 200;
  const progress = (entryCount / maxPlayers) * 100;

  const usdPerEntry = metadata?.price
    ? (Number(formatUnits(entryAmount || 0, metadata.decimals)) * metadata.price).toFixed(2)
    : null;

  const poolSizeUSD = usdPerEntry ? (Number(usdPerEntry) * entryCount).toFixed(2) : null;

  return (
    <Link href={`/pool/${poolId}`}>
      <div className="bg-slate-800 p-4 rounded-xl shadow hover:shadow-lg transition duration-300">
        <div className="flex items-center gap-3 mb-2">
          {metadata?.logoURI && (
            <img
              src={metadata.logoURI}
              alt={`${metadata.symbol} logo`}
              className="w-6 h-6 rounded-full"
            />
          )}
          <h3 className="text-lg font-semibold text-white">
            Pool #{poolId} — {metadata?.symbol || 'Loading...'}
          </h3>
        </div>

        <div className="text-gray-300 text-sm mb-1">
          {entryCount} / {maxPlayers} entries
        </div>

        {poolSizeUSD && (
          <div className="text-sm text-green-400 mb-2">
            Est. Pool: ${poolSizeUSD}
          </div>
        )}

        <div className="w-full bg-slate-700 h-2 rounded">
          <div
            className="h-2 bg-violet-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
