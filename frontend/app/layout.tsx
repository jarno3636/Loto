// app/layout.tsx
import './globals.css';
import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Loto | Decentralized Lottery on Base',
  description: 'Join, create, and win from decentralized lottery pools. Powered by Base.',
  metadataBase: new URL('https://loto-gamma.vercel.app'),
  openGraph: {
    title: 'Loto | Win from Decentralized Lottery Pools',
    description:
      'Create or join community-powered lottery pools with your favorite tokens like $TOBY, $PATIENCE, $TABOSHI, and more.',
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
    icon: '/favicon.PNG', // Respect case sensitivity
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://loto-gamma.vercel.app/meta-preview.png',
    'fc:frame:post_url': 'https://loto-gamma.vercel.app/api/frame',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white font-sans min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
