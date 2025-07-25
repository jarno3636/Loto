// app/info/page.tsx
import Image from 'next/image';

export default function InfoPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-white space-y-8">
      <h1 className="text-3xl font-bold text-violet-400">About Loto 🎲</h1>

      <p>
        <strong>Loto</strong> is a decentralized lottery platform built on <strong>Base</strong>, designed to be fun, fair, and community-first.
        Create or join token-based lottery pools, with transparent mechanics and low fees (0.5% entry + 0.5% claim).
      </p>

      <div className="border-t border-slate-700 pt-6">
        <h2 className="text-2xl font-semibold text-violet-300">The LOTO Token</h2>
        <p>
          <strong>LOTO</strong> is the native community token of Loto.
          Minted on <a href="https://mint.club" target="_blank" rel="noopener noreferrer" className="underline text-blue-300">Mint Club</a>, 
          it represents early support for the ecosystem.
        </p>
        <ul className="list-disc list-inside mt-3 text-sm text-slate-300">
          <li><strong>Token Address:</strong> 0x615346aD915D6592d1961a141a8670D698e3BbE7</li>
          <li><strong>Total Supply:</strong> 777,777</li>
          <li><strong>Team Allocation:</strong> 38,000 tokens</li>
          <li><strong>Locked:</strong> 19,000 tokens until July 25, 2026</li>
        </ul>
        <div className="mt-4">
          <Image src="/loto.PNG" alt="Loto Token" width={64} height={64} />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <h2 className="text-2xl font-semibold text-violet-300">Supported Tokens</h2>
        <ul className="list-disc list-inside text-sm text-slate-300 mt-2">
          <li>$TOBY</li>
          <li>$PATIENCE</li>
          <li>$TABOSHI</li>
          <li>$ZORA</li>
          <li>$LOTO</li>
        </ul>
        <p className="text-xs text-slate-500 mt-2">+ More Base ecosystem tokens added regularly</p>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <h2 className="text-2xl font-semibold text-violet-300">Transparency & Community</h2>
        <p>
          Loto is community-led and open-source. You can explore the smart contracts, view locked tokens, and track transparency across:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm text-blue-400">
          <li><a href="https://github.com/jarno3636/Loto" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://toadgod.xyz" target="_blank" rel="noopener noreferrer">Toadgod Ecosystem</a></li>
          <li><a href="https://farcaster.xyz/~/channel/toby" target="_blank" rel="noopener noreferrer">Farcaster</a></li>
        </ul>
      </div>
    </div>
  );
}
