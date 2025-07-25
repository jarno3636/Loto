
import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-4 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to Loto</h1>
      <p className="text-lg text-gray-300 mb-6">Join or create decentralized lottery pools with your favorite Base tokens.</p>
      <Link href="/create" className="bg-violet-600 px-4 py-2 rounded text-white hover:bg-violet-500 transition">Create a Pool</Link>
    </main>
  );
}
