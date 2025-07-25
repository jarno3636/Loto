'use client';

import WalletConnector from '../components/WalletConnector';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-300">🎟️ Loto: Onchain Lottery</h1>

        {/* Wallet Connect UI */}
        <div className="mb-6 flex justify-center">
          <WalletConnector />
        </div>

        <section className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-3 text-white font-semibold">Current Pools</h2>
          <p className="text-slate-300">Once connected, you’ll be able to view available pools, create new ones, and enter for a chance to win big!</p>

          {/* Future: pool listing here */}
        </section>
      </div>
    </main>
  );
}
