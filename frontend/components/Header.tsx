'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const WalletConnectButton = dynamic(() => import('./WalletConnectButton'), { ssr: false });

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        w-full flex items-center justify-between py-3 sm:py-4 px-3 sm:px-6
        sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-slate-950/95 border-b border-blue-800/40 shadow-xl backdrop-blur'
          : 'bg-slate-950/80 border-b border-slate-900 shadow backdrop-blur'}
      `}
      style={{
        boxShadow: scrolled
          ? '0 2px 18px 0 #6366f1cc, 0 0.5px 0 #fff2'
          : '0 2px 8px 0 #6366f144',
        borderImage: scrolled
          ? 'linear-gradient(90deg, #7dd3fc88, #a78bfa88, #f472b688) 1'
          : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/loto.PNG" alt="Loto" width={40} height={40} className="rounded" />
          <span className="text-2xl font-bold tracking-wide text-blue-400 drop-shadow">Loto</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/pools" className="hover:underline font-semibold text-slate-200 hover:text-blue-300 transition">Pools</Link>
        <Link href="/create" className="hover:underline font-semibold text-slate-200 hover:text-blue-300 transition">Create</Link>
        <WalletConnectButton />
      </div>
    </header>
  );
}
