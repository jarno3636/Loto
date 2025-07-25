'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getLotteryContract } from '../utils/lottery';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import tokenList from '../lib/tokenList';

interface PoolCardProps {
  poolId: number;
}

interface Pool {
  creator: string;
  token: string;
  entryAmount: bigint;
  createdAt: bigint;
  players: string[];
  winner: string;
}

export default function PoolCard({ poolId }: PoolCardProps) {
  const [pool, setPool] = useState<Pool | null>(null);
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const fetchPool = async () => {
      if (!walletProvider) return;
      const provider = new ethers.BrowserProvider(walletProvider!);
      const contract = getLotteryContract(provider);
      const rawPool = await contract.pools(poolId);
      const players = await contract.getPlayers(poolId); // assumes getPlayers is public view
      setPool({
        creator: rawPool.creator,
        token: rawPool.token,
        entryAmount: rawPool.entryAmount,
        createdAt: rawPool.createdAt,
        players,
        winner: rawPool.winner,
      });
    };
    fetchPool();
  }, [poolId, walletProvider]);

  if (!pool) {
    return (
      <div className="p-6 border border-slate-700 rounded-xl bg-slate-800/40 shadow-md">
        <div className="text-center text-slate-400">Loading pool #{poolId}...</div>
      </div>
    );
  }

  const tokenInfo = tokenList.find((t) => t.address.toLowerCase() === pool.token.toLowerCase());
  const entryAmount = Number(ethers.formatUnits(pool.entryAmount, tokenInfo?.decimals || 18));
  const totalPlayers = pool.players.length;
  const totalValue = entryAmount * totalPlayers;
  const tokenPrice = tokenInfo?.priceUsd || 0;
  const estimatedUsd = (totalValue * tokenPrice).toFixed(2);
  const percentFilled = Math.min(100, (totalPlayers / 200) * 100);

  return (
    <div className="p-5 border border-slate-700 rounded-xl bg-slate-900/60 hover:shadow-xl transition">
      <div className="flex items-center gap-3 mb-4">
        {tokenInfo?.logoURI && (
          <img
            src={tokenInfo.logoURI}
            alt={`${tokenInfo.symbol} logo`}
            className="w-7 h-7 rounded-full"
          />
        )}
        <div>
          <div className="font-bold text-lg text-white">{tokenInfo?.symbol || 'Token'}</div>
          <div className="text-xs text-slate-400">Pool #{poolId}</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-sm text-slate-300">Entries: {totalPlayers} / 200</div>
        <div className="w-full bg-slate-700 h-2 rounded">
          <div
            className="bg-emerald-400 h-2 rounded"
            style={{ width: `${percentFilled}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <div className="text-sm text-slate-400">Entry:</div>
          <div className="font-medium text-white">
            {entryAmount.toFixed(4)} {tokenInfo?.symbol}
          </div>
        </div>
        <div>
          <div className="text-sm text-slate-400">Estimated Pool</div>
          <div className="font-medium text-white">${estimatedUsd}</div>
        </div>
      </div>
    </div>
  );
}
