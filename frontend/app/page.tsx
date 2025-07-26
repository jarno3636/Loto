'use client';

import { useEffect, useState } from 'react';
import { getAllPools } from '@/lib/lottery';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';

const PAGE_SIZE = 10;

export default function HomePage() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [poolCount, setPoolCount] = useState(0);
  const [usdPrices, setUsdPrices] = useState<Record<string, number>>({});

  // Fetch pool data + USD prices
  useEffect(() => {
    setLoading(true);
    const loadPools = async () => {
      try {
        const { pools, poolCount } = await getAllPools(page * PAGE_SIZE, PAGE_SIZE);
        // Sort newest first
        pools.sort((a, b) => b.createdAt - a.createdAt);
        setPools(pools);
        setPoolCount(poolCount);

        // Preload token prices
        const tokenSymbols = [
          ...new Set(pools.map((pool) => {
            const info = tokenList.find((t) => t.address.toLowerCase() === pool.token.toLowerCase());
            return info?.symbol || '';
          }))
        ].filter(Boolean);
        const prices: Record<string, number> = {};
        await Promise.all(tokenSymbols.map(async (symbol) => {
          prices[symbol] = await fetchUsdPrice(symbol);
        }));
        setUsdPrices(prices);

      } catch (error) {
        console.error('Error loading pools:', error);
      }
      setLoading(false);
    };
    loadPools();
  }, [page]);

  // Helper: get token info by address
  const getTokenInfo = (address: string) =>
    tokenList.find((t) => t.address.toLowerCase() === address.toLowerCase());

  return (
    <main className="max-w-2xl mx-auto p-4 md:p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">All Lottery Pools</h1>
      {loading ? (
        <p className="text-center text-lg">Loading pools...</p>
      ) : pools.length === 0 ? (
        <p className="text-center">No pools found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {pools.map((pool, i) => {
              const token = getTokenInfo(pool.token);
              const symbol = token?.symbol || pool.token.slice(0, 6) + '...';
              const name = token?.name || 'Unknown Token';
              const logo = token?.logoURI || '';
              const decimals = token?.decimals || 18;
              const usd = usdPrices[symbol] || 0;
              let entryAmount = pool.entryAmount?.toString();
              let entryParsed = entryAmount ? Number(entryAmount) / Math.pow(10, decimals) : 0;
              let usdEntry = (usd && entryParsed) ? (entryParsed * usd).toFixed(2) : '-';

              return (
                <li key={i} className="bg-slate-800 p-4 rounded shadow flex items-center gap-4">
                  <div>
                    {logo && <img src={logo} alt={symbol} className="h-10 w-10 rounded-full border border-slate-700" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{symbol}</span>
                      <span className="text-gray-400">{name}</span>
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      Pool #{pool.id} &bull; Creator: <span className="font-mono">{pool.creator.slice(0, 6)}...{pool.creator.slice(-4)}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Entry: <span className="font-mono">{entryParsed} {symbol}</span>
                      {usdEntry !== '-' && (
                        <span> (~${usdEntry} USD)</span>
                      )}
                      &nbsp;| Players: {pool.players.length} &nbsp;| Winner: <span className="font-mono">{pool.winner ? `${pool.winner.slice(0, 6)}...${pool.winner.slice(-4)}` : '—'}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Created: {new Date(Number(pool.createdAt) * 1000).toLocaleString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-between items-center mt-8">
            <button
              className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              Previous
            </button>
            <span>
              Page <b>{page + 1}</b> of <b>{Math.ceil(poolCount / PAGE_SIZE)}</b>
            </span>
            <button
              className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
              disabled={(page + 1) * PAGE_SIZE >= poolCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
