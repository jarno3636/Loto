// app/info/page.tsx

export default function InfoPage() {
  return (
    <div className="min-h-screen px-6 py-12 text-white bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">ℹ️ About Loto</h1>
        <p className="mb-6 text-slate-300">
          <strong>Loto</strong> is a decentralized lottery application built on the Base network.
          It allows users to create and join token-based lottery pools using popular tokens like <strong>$TOBY</strong>,
          <strong> $PATIENCE</strong>, <strong>$TABOSHI</strong>, and more.
          All pools are fully transparent, open-source, and trustless.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-2">🪙 LOTO Token</h2>
        <ul className="text-slate-300 list-disc ml-6 space-y-1">
          <li><strong>Token Address:</strong> 0x615346aD915D6592d1961a141a8670D698e3BbE7</li>
          <li><strong>Total Supply:</strong> 777,777 LOTO</li>
          <li><strong>Allocation:</strong> Creator holds 38,000 LOTO</li>
          <li><strong>Locked:</strong> 19,000 LOTO are locked until <strong>July 25, 2026</strong></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-2">🔒 Trust & Transparency</h2>
        <p className="text-slate-300">
          Loto is committed to building a fair and secure lottery experience. All contract logic is open-source,
          fees are minimal (0.5%), and randomness is transparently generated on-chain. Community input, memes, and fun are all welcome!
        </p>
      </div>
    </div>
  );
}
