'use client';

import FadeWrapper from '@/components/FadeWrapper';

export default function InfoPage() {
  return (
    <FadeWrapper>
      <main className="max-w-2xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">ℹ️ About Loto & the LOTO Token</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🎲 What is Loto?</h2>
          <p className="text-slate-300">
            Loto is a decentralized lottery platform built on Base. It enables users to create, join,
            and win from transparent, token-powered lottery pools. Choose popular Base tokens like $TOBY, $PATIENCE, $TABOSHI, and more.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">💰 About LOTO Token</h2>
          <p className="text-slate-300">
            LOTO (0x615346aD915D6592d1961a141a8670D698e3BbE7) is a community token minted via Mint Club with a total supply of 777,777.
            38,000 tokens were allocated to the creator, of which 19,000 are locked until July 25, 2026.
          </p>
        </section>
      </main>
    </FadeWrapper>
  );
}
