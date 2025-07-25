'use client';

import { useEffect, useState } from 'react';
import { getLotteryContract } from '../utils/lottery';
import { useProvider } from 'wagmi';
import { formatUnits } from 'ethers';
import tokenList from '../utils/tokenList';

interface Props {
  poolId: number;
}

export default function PoolCard({ poolId }: Props) {
  const provider = useProvider();
  const [pool, setPool] = useState<any>(null);

  useEffect(() => {
    async function fetchPool() {
      const contract = getLotteryContract(provider);
      const data = await contract.pools(poolId);
      setPool(data);
    }

    fetchPool();
  }, [poolId, provider]);

  if (!pool) {
    return (
      <div className="bg-slate-800 p-5 rounded-xl animate-pulse h-48" />
    );
  }

  const tokenInfo = tokenList.find(
    (t) => t.address.toLowerCase() === pool.token.toLowerCase()
  );

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-xl shadow-md hover:shadow-xl transition">
      <div className="flex items-center gap-4 mb-3">
        {tokenInfo?.logoURI ? (
          <img
            src={tokenInfo.logoURI}
            alt={tokenInfo.symbol}
            className="w-10 h-10 rounded-full border border-white"
          />
        ) : (
          <div className="w-10 h-10 bg-slate-600 rounded-full" />
        )}
        <div>
          <div className="text-white font-semibold text-lg">
            {tokenInfo?.symbol || 'Token'}
          </div>
          <div className="text-sm text-slate-400">Pool #{poolId}</div>
        </div>
      </div>

      <div className="text-slate-200 text-sm mb-1">
        🎟 Entry: {formatUnits(pool.entryAmount, tokenInfo?.decimals || 18)} {tokenInfo?.symbol}
      </div>
      <div className="text-slate-400 text-sm mb-4">
        👥 Players: {pool.players.length}
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full font-medium"
        onClick={() => alert('Join flow coming soon')}
      >
        Join Pool
      </button>
    </div>
  );
}
