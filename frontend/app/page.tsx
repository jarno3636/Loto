'use client';

import { useEffect, useState } from "react";
import { getAllPools } from '@/lib/lottery';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import PoolCard from '@/components/PoolCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
    <main className="max-w-3xl mx-auto p-6 text-white">
      {/* Hero section */}
      <section className="flex flex-col items-center text-center mb-12 mt-6">
        <motion.img
          src="/loto.PNG"
          alt="Loto"
          className="w-20 h-20 rounded-2xl shadow-xl mb-4"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent mb-2">
          Loto
        </h1>
        <div className="text-lg text-slate-300 mb-2 font-medium">
          The most fun, transparent, and viral lottery on Base.<br />
          <span className="text-violet-400 font-bold">$TOBY</span> · <span className="text-blue-400 font-bold">$PATIENCE</span> · <span className="text-green-400 font-bold">$TABOSHI</span> and more!
        </div>
        <div className="flex gap-4 justify-center my-3">
          <Link href="/create" className="bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 rounded-full font-bold text-white shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all">
            + Create Pool
          </Link>
          <a
            href="https://x.com/tobyonbase"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-slate-800 border border-slate-600 px-4 py-2 rounded-full text-sm text-slate-200 hover:bg-slate-700"
          >
            <svg width={18} height={18} className="mr-1" viewBox="0 0 1200 1227" fill="currentColor"><path d="M1200 0 469 663l362 564H663L317 1020v207H0V881l652-602L287 0h249l361 563L1200 0Z"/></svg>
            X
          </a>
        </div>
      </section>
      {/* Main Pools Area */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Live Lottery Pools</h2>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-lg py-12"
            >
              Loading pools...
            </motion.div>
          ) : pools.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10"
            >
              <img
                src="/empty-state.png"
                alt="No pools"
                className="w-32 h-32 mb-4 opacity-70"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <div className="text-xl font-bold mb-2">No pools found</div>
              <div className="mb-4 text-slate-400">Be the first to launch a pool and kick off the fun!</div>
              <Link
                href="/create"
                className="bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 rounded-full font-bold text-white shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all"
              >
                + Create Pool
              </Link>
            </motion.div>
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
        </AnimatePresence>
      </section>
    </main>
  );
}
