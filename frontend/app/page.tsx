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
  const [recentWinners, setRecentWinners] = useState<any[]>([]); // NEW

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

      // NEW: Find most recent winner(s)
      const winnerPools = pools
        .filter(pool => pool.winner)
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .slice(0, 1); // Use .slice(0, 3) for top 3
      setRecentWinners(winnerPools);
    };
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.ceil(poolCount / PAGE_SIZE);

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 text-white relative pb-24">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center mb-10 mt-6">
        <motion.div
          className="relative"
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 210, damping: 20 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400 via-violet-400 to-pink-500 rounded-3xl blur-xl opacity-70 animate-pulse pointer-events-none"></div>
          <img
            src="/loto.PNG"
            alt="Loto"
            className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-white/10 relative z-10"
            style={{ boxShadow: '0 6px 24px 0 #7c3aed55' }}
          />
        </motion.div>
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-violet-500 to-pink-400 bg-clip-text text-transparent mt-3 mb-1 flex items-center justify-center gap-2">
          Loto <span className="text-3xl animate-bounce ml-1">✨</span>
        </h1>
        <div className="text-lg sm:text-2xl text-slate-200 font-semibold mb-2">
          The world’s most viral, <span className="text-violet-300">transparent</span> lottery on <span className="text-blue-400">Base</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 my-1">
          <span className="bg-blue-900/40 rounded px-2 py-1 text-blue-300 text-xs font-bold">$TOBY</span>
          <span className="bg-red-900/40 rounded px-2 py-1 text-red-300 text-xs font-bold">$PATIENCE</span>
          <span className="bg-green-900/40 rounded px-2 py-1 text-green-300 text-xs font-bold">$TABOSHI</span>
          <span className="bg-yellow-900/40 rounded px-2 py-1 text-yellow-300 text-xs font-bold">+ More</span>
        </div>
        <div className="mt-3 mb-5 text-slate-400 text-base font-medium max-w-xl mx-auto">
          Launch your own pool, join others, and watch the prize grow. <br className="hidden sm:inline" />Powered by the Base chain and the best meme coins in the universe.
        </div>
        <div className="flex gap-3 flex-wrap justify-center my-2">
          <Link href="/create" passHref legacyBehavior>
            <motion.a
              whileTap={{ scale: 0.93 }}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3 rounded-full font-bold text-white text-lg shadow-xl hover:from-blue-500 hover:to-violet-500 transition-all flex items-center gap-2"
            >
              <span role="img" aria-label="Party" className="text-xl">🎉</span> Create Pool
            </motion.a>
          </Link>
          <a
            href="https://x.com/tobyonbase"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-slate-800 border border-slate-600 px-5 py-3 rounded-full text-sm text-slate-200 hover:bg-slate-700 font-semibold"
          >
            <svg width={18} height={18} className="mr-1" viewBox="0 0 1200 1227" fill="currentColor"><path d="M1200 0 469 663l362 564H663L317 1020v207H0V881l652-602L287 0h249l361 563L1200 0Z"/></svg>
            X / Twitter
          </a>
          <a
            href="https://base.org/mini-apps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-900/60 border border-blue-700 px-5 py-3 rounded-full text-sm text-blue-200 hover:bg-blue-800 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#0052FF" /><text x="10" y="26" fontSize="14" fontFamily="Arial" fill="white">$</text></svg>
            Base Mini Apps
          </a>
        </div>
      </section>

      {/* ====== RECENT WINNER TICKET ====== */}
      {recentWinners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.7, bounce: 0.25 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-900/60 via-violet-900/40 to-blue-900/60 border border-blue-500/40 glass-card shadow-lg backdrop-blur-lg relative max-w-xl w-full">
            <img
              src={
                tokenList.find(
                  t => t.address.toLowerCase() === recentWinners[0].token.toLowerCase()
                )?.logoURI || '/token-placeholder.png'
              }
              alt={recentWinners[0].token}
              className="w-12 h-12 rounded-full border-2 border-white shadow mr-3"
            />
            <div className="flex-1">
              <div className="text-xs uppercase text-slate-400 mb-1 font-semibold tracking-wide">Recent Winner</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                {recentWinners[0].winner.slice(0, 6)}...{recentWinners[0].winner.slice(-4)}
                <span className="text-slate-400 font-normal text-sm">
                  won
                </span>
                <span className="text-blue-300 font-extrabold">
                  {Number(recentWinners[0].entryAmount) / 10 ** (tokenList.find(t => t.address.toLowerCase() === recentWinners[0].token.toLowerCase())?.decimals || 18)}{" "}
                  {tokenList.find(t => t.address.toLowerCase() === recentWinners[0].token.toLowerCase())?.symbol || "?"}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Pool #{recentWinners[0].id} &middot; {new Date(Number(recentWinners[0].createdAt) * 1000).toLocaleDateString()}
              </div>
            </div>
            <span className="absolute right-2 top-2 px-2 py-1 text-xs rounded bg-blue-600/70 text-white font-bold shadow">WINNER</span>
          </div>
        </motion.div>
      )}

      {/* POOLS LIST */}
      <section>
        <h2 className="text-2xl font-bold mb-5">Live Lottery Pools</h2>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-lg py-14"
            >
              Loading pools...
            </motion.div>
          ) : pools.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              className="flex flex-col items-center py-10"
            >
              <img
                src="/empty-state.png"
                alt="No pools"
                className="w-36 h-36 mb-4 opacity-70"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <div className="text-2xl font-bold mb-2">No pools yet</div>
              <div className="mb-4 text-slate-400">Be the first to launch a pool and kick off the party! 🚀</div>
              <Link
                href="/create"
                className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2 rounded-full font-bold text-white shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all"
              >
                + Create Pool
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4">
                <AnimatePresence>
                  {pools.map((pool) => (
                    <motion.div
                      key={pool.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    >
                      <PoolCard {...pool} />
                    </motion.div>
                  ))}
                </AnimatePresence>
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

      {/* MOBILE CREATE POOL BUTTON */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center sm:hidden z-50">
        <Link href="/create" className="bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 rounded-full font-bold text-xl shadow-2xl hover:from-blue-500 hover:to-violet-500 transition-all flex items-center gap-2">
          <span role="img" aria-label="Sparkles">✨</span> Create Pool
        </Link>
      </div>
    </main>
  );
}
