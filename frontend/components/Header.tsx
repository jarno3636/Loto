'use client';
import Link from 'next/link';

export default function Header({ user }: { user?: { address?: string } }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-lg shadow-md py-3 px-4 flex items-center justify-between border-b border-slate-800">
      <Link href="/" className="flex items-center gap-2 group">
        <img src="/loto.PNG" alt="Loto Logo" className="w-8 h-8 rounded" />
        <span className="text-xl font-bold tracking-wide text-white group-hover:text-blue-300 transition">
          Loto
        </span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link href="/" className="text-blue-400 hover:text-white transition font-semibold">
          Home
        </Link>
        <Link href="/pools" className="text-blue-400 hover:text-white transition font-semibold">
          Pools
        </Link>
        <Link href="/info" className="text-blue-400 hover:text-white transition font-semibold">
          Info
        </Link>
      </nav>
      <div className="ml-6 flex items-center gap-3">
        {/* This is where wallet/profile goes. You can drop in Wagmi ConnectButton here! */}
        {user?.address ? (
          <span className="px-3 py-1 bg-slate-800 rounded font-mono text-xs text-white">
            {user.address.slice(0, 6)}...{user.address.slice(-4)}
          </span>
        ) : (
          <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition">
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
