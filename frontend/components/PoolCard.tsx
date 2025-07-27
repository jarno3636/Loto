'use client';

import { motion } from 'framer-motion';
import { tokenList } from '@/lib/tokenList';

export default function PoolCard({
  id,
  token,
  creator,
  entryAmount,
  players,
  createdAt,
  winner,
}: {
  id: string;
  token: string;
  creator: string;
  entryAmount: string;
  players: string[];
  createdAt: string | number;
  winner?: string;
}) {
  // Find the token info
  const tokenInfo = tokenList.find(
    (t) => t.address.toLowerCase() === token.toLowerCase()
  );
  const symbol = tokenInfo?.symbol || '???';
  const logo = tokenInfo?.logoURI || '/token-placeholder.png';
  const decimals = tokenInfo?.decimals ?? 18;
  const amount = Number(entryAmount) / 10 ** decimals;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ type: 'spring', stiffness: 230, damping: 24 }}
      className="relative rounded-2xl bg-white/10 border-2 border-slate-700/80 p-5 flex items-center gap-4 shadow-lg overflow-hidden"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderImage: 'linear-gradient(90deg, #7dd3fc80, #a78bfa99, #f472b680) 1',
        boxShadow: '0 4px 36px 0 #7c3aed33, 0 1.5px 0 #7dd3fc55',
      }}
    >
      <div className="relative z-10">
        <img
          src={logo}
          alt={symbol}
          className="w-14 h-14 rounded-full border-2 border-blue-400/40 shadow-md"
          onError={e => (e.currentTarget.src = '/token-placeholder.png')}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-lg text-white flex items-center gap-2">
          {symbol} Pool <span className="text-slate-300">#{id}</span>
        </div>
        <div className="text-gray-200 text-xs truncate">
          Creator: <span className="font-mono">{creator.slice(0, 8)}...</span>
        </div>
        <div className="text-sm mt-1">
          Entry: <b className="text-blue-200">{amount} {symbol}</b>
        </div>
        <div className="text-xs text-slate-400">
          Players: {players?.length || 0} | Created: {new Date(Number(createdAt) * 1000).toLocaleString()}
        </div>
        {winner && (
          <div className="text-green-400 text-xs mt-1 animate-pulse">
            Winner: <span className="font-mono">{winner.slice(0, 8)}...</span>
          </div>
        )}
      </div>
      {/* Glowing animated border */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-transparent"
        style={{
          boxShadow:
            '0 0 40px 8px #38bdf880, 0 0 60px 20px #a78bfa40, 0 0 0 2px #fff3',
          zIndex: 1,
        }}
        initial={{ opacity: 0.1 }}
        animate={{ opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
