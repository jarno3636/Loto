// frontend/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 mt-12 pt-6 pb-8 text-sm text-center text-slate-400">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <span>&copy; {new Date().getFullYear()} Loto — All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            X (Twitter)
          </Link>
          <Link href="https://farcaster.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            Farcaster
          </Link>
          <Link href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            Telegram
          </Link>
        </div>
      </div>
    </footer>
  );
}
