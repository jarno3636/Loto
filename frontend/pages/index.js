import Head from 'next/head'
import { ConnectWallet } from "@thirdweb-dev/react";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-slate-100 min-h-screen p-4 text-slate-800">
      <Head>
        <title>Farcaster Lottery</title>
      </Head>

      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Image src="/profile-placeholder.png" alt="Profile" width={40} height={40} className="rounded-full" />
          <span className="font-semibold">Your Profile</span>
        </div>
        <ConnectWallet />
      </header>

      <main>
        <h1 className="text-3xl font-bold text-center mb-4">🎲 Farcaster Weekly Lottery</h1>
        <div className="flex justify-center space-x-4 mb-6">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-full">Small Pool</button>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-full">Medium Pool</button>
          <button className="bg-blue-700 text-white py-2 px-4 rounded-full">Big Pool</button>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-2">Active Pools</h2>
          <ul className="space-y-2">
            <li className="bg-white p-4 rounded-lg shadow">Base / $TOBY / Medium Pool / Ends in 2d 4h</li>
            <li className="bg-white p-4 rounded-lg shadow">ETH / $PAT / Big Pool / Ends in 1d 18h</li>
            <li className="bg-white p-4 rounded-lg shadow">Solana / $JUMP / Small Pool / Ends in 5d</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
