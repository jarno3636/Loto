// frontend/components/PoolCard.tsx
import React from 'react';
import { tokenList } from '@/lib/tokenList';

interface PoolCardProps {
  id: number;
  creator: string;
  token: string;
  entryAmount: any;
  createdAt: any;
  players: string[];
  winner: string;
}

export default function PoolCard(props: PoolCardProps) {
  // Find token info (symbol, decimals, logo, etc.)
  const tokenInfo = tokenList.find(
    (t) => t.address.toLowerCase() === props.token.toLowerCase()
  );
  const decimals = tokenInfo?.decimals || 18;
  const symbol = tokenInfo?.symbol || '???';
  const logo = tokenInfo?.logoURI;

  const amount = Number(props.entryAmount) / 10 ** decimals;

  return (
    <div className="bg-slate-900 rounded p-4 flex items-center gap-4 shadow">
      {logo && <img src={logo} alt={symbol} className="w-10 h-10" />}
      <div className="flex-1">
        <div className="font-bold text-lg">{symbol} Pool #{props.id}</div>
        <div className="text-gray-300 text-sm">
          Creator: <span className="font-mono">{props.creator.slice(0, 8)}...</span>
        </div>
        <div className="text-sm">
          Entry: <b>{amount} {symbol}</b>
        </div>
        <div className="text-xs text-gray-400">
          Players: {props.players.length} | Created At: {new Date(Number(props.createdAt) * 1000).toLocaleString()}
        </div>
        {props.winner && <div className="text-green-400 text-xs mt-1">Winner: {props.winner}</div>}
      </div>
    </div>
  );
}
