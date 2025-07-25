'use client';

import { useEffect, useState } from 'react';
import { useProvider } from 'wagmi';
import { getLotteryContract } from '@/lib/lottery';
import { formatUnits } from 'ethers/lib/utils';

interface PoolCardProps {
  poolId: number;
}

export default function PoolCard({ poolId }: PoolCardProps) {
  const [entryAmount, setEntryAmount] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [players, setPlayers] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);

  const provider = useProvider();

  useEffect(() => {
    const fetchPoolDetails = async () => {
      try {
        const contract = getLotteryContract(provider);
        const pool = await contract.pools(poolId);
        const symbol = await pool.token.symbol?.() ?? 'Token';
        const decimals = await pool.token.decimals?.() ?? 18;
        const playerList = await contract.pools(poolId).then((p) => p.players);

        setEntryAmount(formatUnits(pool.entryAmount, decimals));
        setTokenSymbol(symbol);
        setPlayers(playerList.length);
        setWinner(pool.winner !== '0x0000000000000000000000000000000000000000' ? pool.winner : null);
      } catch (err) {
        console.error(`Error fetching pool ${poolId}:`, err);
      }
    };

    fetchPoolDetails();
  }, [provider, poolId]);

  return (
    <div className="border border-slate-700 bg-slate-900 rounded-lg p-5 shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-white mb-1">Pool #{poolId}</h3>
      <p className="text-slate-400 text-sm mb-2">Entry: {entryAmount} {tokenSymbol}</p>
      <p className="text-slate-400 text-sm mb-2">Players: {players}</p>
      {winner ? (
        <p className="text-green-400 text-sm">Winner: {winner.slice(0, 6)}...{winner.slice(-4)}</p>
      ) : (
        <p className="text-yellow-400 text-sm">Winner: TBD</p>
      )}
    </div>
  );
}
