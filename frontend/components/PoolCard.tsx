// PoolCard.tsx
import React from 'react';

export type PoolCardProps = {
  poolId: string;
  tokenAddress: string;
  entryAmount: string;
  decimals: number;
  players: string[];
  winner: string;
  createdAt: number;
};

export default function PoolCard({
  poolId,
  tokenAddress,
  entryAmount,
  decimals,
  players,
  winner,
  createdAt,
}: PoolCardProps) {
  // Render the card details here
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-2">Pool #{poolId}</h3>
      <p>Token Address: {tokenAddress}</p>
      <p>Entry Amount: {entryAmount}</p>
      <p>Decimals: {decimals}</p>
      <p>Players: {players.length}</p>
      <p>Winner: {winner ? winner : "TBD"}</p>
      <p>Created At: {new Date(createdAt).toLocaleString()}</p>
    </div>
  );
}
