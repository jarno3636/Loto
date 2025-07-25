'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { formatUnits } from 'ethers';
import { tokenList } from '@/lib/tokenList';

interface PoolCardProps {
  poolId: string;
  tokenAddress: string;
  entryAmount: bigint;
  decimals: number;
  players: number;
  maxPlayers: number;
  rangeType: string; // 'Small' | 'Medium' | 'Big'
}

export default function PoolCard({
  poolId,
  tokenAddress,
  entryAmount,
  decimals,
  players,
  maxPlayers,
  rangeType,
}: PoolCardProps) {
  const router = useRouter();
  const token = tokenList.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase());

  const handleClick = () => {
    router.push(`/pool/${tokenAddress}-${poolId}`);
  };

  const percentage = Math.min((players / maxPlayers) * 100, 100);
  const entryFormatted = token ? formatUnits(entryAmount, token.decimals) : '';

  return (
    <motion.div
      className="bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg hover:bg-slate-700 cursor-pointer transition-all"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3 mb-2">
        {token && (
          <img src={token.logoURI} alt={token.symbol} className="h-6 w-6 rounded" />
        )}
        <h2 className="text-lg font-bold">
          {token?.symbol || 'Unknown'} Pool
        </h2>
        <span className="ml-auto text-sm px-2 py-1 rounded-full bg-blue-600 text-white">
          {rangeType}
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-2">
        Entry: {entryFormatted} {token?.symbol} (~${(parseFloat(entryFormatted) * (token?.usd || 0)).toFixed(2)})
      </p>

      <div className="w-full h-2 bg-slate-600 rounded overflow-hidden mb-1">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-400">
        {players} / {maxPlayers} players joined
      </p>
    </motion.div>
  );
}
