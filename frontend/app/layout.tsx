import './globals.css';
import { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  // ... your metadata here ...
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ...meta tags... */}
      </head>
      <body className="bg-slate-950 text-white font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
