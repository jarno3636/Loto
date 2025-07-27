// components/Header.tsx
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useState } from "react";

export default function Header() {
  const { address, isConnected } = useAccount();
  // Placeholder logo path, update to your real one
  const logoPath = "/loto.PNG";

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/80 shadow-lg fixed top-0 left-0 z-50 backdrop-blur">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logoPath} width={36} height={36} alt="Loto Logo" />
        <span className="font-bold text-2xl tracking-tight text-white">Loto</span>
      </Link>
      <nav className="flex gap-6 items-center text-white font-medium">
        <Link href="/create" className="hover:text-blue-400 transition">Create Pool</Link>
        <Link href="/info" className="hover:text-blue-400 transition">Info & Token</Link>
        <Link href="/leaderboard" className="hover:text-blue-400 transition">Leaderboard</Link>
        <WalletConnectButton address={address} isConnected={isConnected} />
      </nav>
    </header>
  );
}

function WalletConnectButton({ address, isConnected }: { address?: string, isConnected: boolean }) {
  if (!isConnected)
    return (
      <button className="rounded-lg px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-500">
        Connect Wallet
      </button>
    );
  return (
    <span className="rounded-lg px-3 py-1.5 bg-white/10 border border-blue-500 text-blue-200 font-mono">
      {address?.slice(0, 6)}...{address?.slice(-4)}
    </span>
  );
}
