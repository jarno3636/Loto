// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loto | Decentralized Lottery on Base',
  description: 'Join, create, and win from decentralized lottery pools. Powered by Base.',
  metadataBase: new URL('https://loto-gamma.vercel.app'),
  openGraph: {
    title: 'Loto | Win from Decentralized Lottery Pools',
    description: 'Create or join community-powered lottery pools with your favorite tokens like $TOBY, $PATIENCE, $TABOSHI, and more.',
    images: [
      {
        url: '/meta-preview.png',
        width: 1200,
        height: 630,
        alt: 'Loto decentralized lottery app',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loto | Decentralized Lottery',
    description: 'Create and win lottery pools using Base tokens.',
    images: ['/meta-preview.png'],
  },
  icons: {
    icon: '/favicon.PNG',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white font-sans">
        <nav className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <Link href="/" className="text-xl font-bold text-white hover:text-violet-400">Loto</Link>
          <div className="space-x-4">
            <Link href="/create" className="hover:text-violet-400">Create</Link>
            <Link href="/info" className="hover:text-violet-400">Info</Link>
          </div>
        </nav>
        <main className="pt-4">{children}</main>
      </body>
    </html>
  );
}
