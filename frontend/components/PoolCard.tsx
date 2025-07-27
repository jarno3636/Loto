'use client';

import { tokenList } from '@/lib/tokenList';

export default function PoolCard(props: any) {
  const token = tokenList.find(t => t.address.toLowerCase() === props.token.toLowerCase());
  const symbol = token?.symbol || '???';
  const logo = token?.logoURI || '/token-placeholder.png';
  const maxPlayers = props.maxPlayers || 200; // Or whatever your contract uses
  const playerCount = props.players?.length || 0;
  const progress = Math.min(100, Math.round((playerCount / maxPlayers) * 100));
  const hasWinner = !!props.winner;

  return (
    <div className={`relative glass-card-blur px-5 py-4 rounded-2xl shadow-xl border-2 ${hasWinner ? 'border-green-400 animate-glow' : 'border-white/20'} transition-all`}>
      <div className="flex gap-4 items-center">
        <img src={logo} alt={symbol} className="w-12 h-12 rounded-full shadow" />
        <div className="flex-1">
          <div className="text-lg font-bold text-blue-200">
            {symbol} Pool #{props.id}
            {hasWinner && <span className="ml-2 text-green-300 text-xs animate-pulse">Winner!</span>}
          </div>
          <div className="text-slate-300 text-xs">
            Creator: <span className="font-mono">{props.creator?.slice(0, 8)}...</span>
          </div>
          <div className="text-xs text-slate-400 mb-2">
            Entry: <b>{props.entryAmountReadable || '—'}</b> {symbol}
          </div>
          <div className="h-2 bg-slate-800 rounded overflow-hidden mb-1">
            <div
              className="h-2 bg-gradient-to-r from-blue-400 to-violet-400 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-400 flex justify-between">
            <span>Players: {playerCount} / {maxPlayers}</span>
            {hasWinner && <span className="text-green-300 font-bold">{props.winner.slice(0, 8)}...</span>}
          </div>
        </div>
      </div>
      <style jsx>{`
        .glass-card-blur {
          background: rgba(22, 36, 54, 0.7);
          backdrop-filter: blur(12px);
        }
        .animate-glow {
          box-shadow: 0 0 18px 6px #0fffc4cc;
        }
      `}</style>
    </div>
  );
}
