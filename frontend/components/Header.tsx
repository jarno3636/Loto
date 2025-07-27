'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const WalletConnectButton = dynamic(() => import('./WalletConnectButton'), { ssr: false });

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`w-full flex items-center justify-between py-4 px-6 sticky top-0 z-50 border-b transition-all
      ${scrolled ? 'bg-gradient-to-r from-blue-900/80 to-violet-950/80 shadow-lg border-violet-900' : 'bg-slate-950/80 backdrop-blur border-slate-900'}
    `}>
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/loto.PNG" alt="Loto" width={40} height={40} className="rounded" />
          <span className="text-2xl font-bold tracking-wide text-blue-400 drop-shadow">Loto</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/pools" className="hover:underline font-semibold text-slate-200 hover:text-blue-300 transition">Pools</Link>
        <Link href="/create" className="hover:underline font-semibold text-slate-200 hover:text-blue-300 transition">Create</Link>
        <WalletConnectButton />
      </div>
    </header>
  );
}
