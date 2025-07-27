'use client';

import { useEffect, useState } from "react";
import { getRecentWinners } from '@/lib/lottery';
import { tokenList } from '@/lib/tokenList';

export default function WinnerMarquee() {
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getRecentWinners(3); // Adjust for how many you want
      setWinners(data || []);
    }
    load();
  }, []);

  if (!winners.length) return null;

  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="flex gap-8 animate-marquee">
        {winners.map((w, i) => {
          const token = tokenList.find(t => t.address.toLowerCase() === w.token.toLowerCase());
          return (
            <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full shadow border border-white/20 backdrop-blur-md">
              <img
                src={token?.logoURI || '/token-placeholder.png'}
                alt={token?.symbol || 'token'}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-semibold text-blue-300">{w.amount} {token?.symbol}</span>
              <span className="text-xs text-slate-300">won by</span>
              <span className="font-mono text-yellow-300">{w.winner.slice(0, 6)}...{w.winner.slice(-4)}</span>
            </div>
          );
        })}
      </div>
      {/* Marquee CSS */}
      <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
