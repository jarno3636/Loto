export const metadata = {
  title: 'Loto — Decentralized Lottery',
  description: 'Enter, play, and win in the Loto decentralized lottery on Base. Fair, transparent, and on-chain.',
  openGraph: {
    title: 'Loto — Decentralized Lottery',
    description: 'Enter, play, and win in the Loto decentralized lottery on Base. Fair, transparent, and on-chain.',
    url: 'https://loto.vercel.app',
    siteName: 'Loto',
    images: [
      {
        url: '/og-image.png', // <-- Make sure this file exists in /public
        width: 1200,
        height: 630,
        alt: 'Loto App Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loto — Decentralized Lottery',
    description: 'Enter, play, and win in the Loto decentralized lottery on Base. Fair, transparent, and on-chain.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
