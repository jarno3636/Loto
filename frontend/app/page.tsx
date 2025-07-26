// frontend/app/page.tsx
'use client';

import { useEffect, useState } from "react";
import { getAllPools } from '@/lib/lottery';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';

const PAGE_SIZE = 10;

export default function PoolsPage() {
  const [pools, setPools] = useState<any[]>([]);
  const [poolCount, setPoolCount] = useState(0);
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState<{ [address: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Fetch pools when page changes
  useEffect(() => {
    setLoading(true);
    const fetchPools = async () => {
      const offset = (page - 1) * PAGE_SIZE;
      const { pools, poolCount } = await getAllPools(offset, PAGE_SIZE);
      setPools(pools);
      setPoolCount(poolCount);

      // Fetch prices for all tokens in pools
      const newPrices: { [address: string]: number } = { ...prices };
      for (const pool of pools) {
        if (!newPrices[pool.token]) {
          // Find token info (by address)
          const tokenInfo = tokenList.find(
            (t) => t.address.toLowerCase() === pool.token.toLowerCase()
          );
          if (tokenInfo) {
            const usdPrice = await fetchUsdPrice(tokenInfo.symbol);
            newPrices[pool.token] = usdPrice || 0;
          }
        }
      }
      setPrices(newPrices);
      setLoading(false);
    };
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.ceil(poolCount / PAGE_SIZE);

  return (
    <main className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Lottery Pools</h1>
      {loading ? (
        <p>Loading pools...</p>
      ) : pools.length === 0 ? (
        <p>No pools found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {pools.map((pool) => {
              const tokenInfo = tokenList.find(
                (t) => t.address.toLowerCase() === pool.token.toLowerCase()
              );
              const decimals = tokenInfo?.decimals || 18;
              const symbol = tokenInfo?.symbol || '???';
              const logo = tokenInfo?.logoURI;
              const amount = Number(pool.entryAmount) / 10 ** decimals;
              const usd = prices[pool.token]
                ? (amount * prices[pool.token]).toFixed(2)
                : '--';

              return (
                <div key={pool.id} className="bg-slate-900 rounded p-4 flex items-center gap-4 shadow">
                  {logo && <img src={logo} alt={symbol} className="w-10 h-10" />}
                  <div className="flex-1">
                    <div className="font-bold text-lg">{symbol} Pool #{pool.id}</div>
                    <div className="text-gray-300 text-sm">
                      Creator: <span className="font-mono">{pool.creator.slice(0, 8)}...</span>
                    </div>
                    <div className="text-sm">
                      Entry: <b>{amount} {symbol}</b> &nbsp;|&nbsp; <b>${usd} USD</b>
                    </div>
                    <div className="text-xs text-gray-400">
                      Players: {pool.players.length} | Created At: {new Date(Number(pool.createdAt) * 1000).toLocaleString()}
                    </div>
                    {pool.winner && <div className="text-green-400 text-xs mt-1">Winner: {pool.winner}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              className="px-4 py-2 rounded bg-slate-700 disabled:bg-slate-800"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page <b>{page}</b> of <b>{totalPages || 1}</b>
            </span>
            <button
              className="px-4 py-2 rounded bg-slate-700 disabled:bg-slate-800"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
