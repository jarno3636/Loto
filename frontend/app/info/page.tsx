// app/info/page.tsx
import Image from 'next/image';

export default function InfoPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">ℹ️ About Loto & LOTO Token</h1>

      <div className="bg-slate-900 p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-2">🎰 What is Loto?</h2>
        <p className="text-lg mb-4">
          Loto is a decentralized lottery dApp built on the Base network. Players can join token-based lottery pools, and winners are selected transparently using smart contract logic.
        </p>
        <Image
          src="/meta-preview.png"
          alt="Loto Logo"
          width={600}
          height={300}
          className="rounded"
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-2">💰 About the LOTO Token</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li><strong>Name:</strong> LOTO</li>
          <li><strong>Symbol:</strong> LOTO</li>
          <li><strong>Contract Address:</strong> <code className="break-all">0x615346aD915D6592d1961a141a8670D698e3BbE7</code></li>
          <li><strong>Total Supply:</strong> 777,777</li>
          <li><strong>Owner Allocation:</strong> 38,000 tokens</li>
          <li><strong>Locked Amount:</strong> 19,000 LOTO (until July 25, 2026)</li>
          <li><strong>Logo Used:</strong> Same as Loto app branding</li>
        </ul>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">📌 Disclaimer</h2>
        <p className="text-md text-gray-300">
          The LOTO token is community-driven and used for future reward mechanisms or features. It is not a guarantee of value or return.
        </p>
      </div>
    </div>
  );
}
