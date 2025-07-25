// app/page.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 shadow-xl max-w-xl w-full border border-white/10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Loto</h1>
        <p className="text-slate-300 text-lg mb-6">
          Join or create community-powered lottery pools with Base tokens like $TOBY, $PATIENCE, and $TABOSHI.
        </p>

        <ConnectButton />

        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/create"
            className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
          >
            Create Pool
          </Link>
          <Link
            href="/pools"
            className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition font-medium"
          >
            View Pools
          </Link>
        </div>
      </div>
    </main>
  );
}
