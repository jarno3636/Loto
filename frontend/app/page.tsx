'use client';

import Link from 'next/link';
import FadeWrapper from '@/components/FadeWrapper';

export default function HomePage() {
  return (
    <FadeWrapper>
      <main className="max-w-3xl mx-auto py-12 px-6 text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome to Loto 🎉</h1>
        <p className="mb-4 text-lg text-slate-300">
          Loto is a decentralized lottery platform on Base. Join or create lottery pools using tokens like $TOBY, $PATIENCE, $TABOSHI, and more.
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Link href="/create" className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded text-white font-semibold text-center">
            🎯 Create a Pool
          </Link>
          <Link href="/leaderboard" className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded text-white font-semibold text-center">
            🏆 Leaderboard
          </Link>
          <Link href="/info" className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded text-white font-semibold text-center">
            ℹ️ Info
          </Link>
        </div>
      </main>
    </FadeWrapper>
  );
}
