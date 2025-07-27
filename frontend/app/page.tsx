'use client';

import { useEffect, useState } from "react";
import { getAllPools } from '@/lib/lottery';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import PoolCard from '@/components/PoolCard';

const PAGE_SIZE = 10;

export default function PoolsPage() {
  const [pools, setPools] = useState<any[]>([]);
  const [poolCount, setPoolCount] = useState(0);
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState<{ [address: string]: number }>({});
  const [loading, setLoading] = useState(true);

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
            {pools.map((pool) => (
              <PoolCard key={pool.id} {...pool} />
            ))}
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
