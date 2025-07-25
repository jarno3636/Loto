
export default function Hero() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold">🎲 Loto</h1>
      <p className="text-lg text-slate-300">Win community-powered lottery pools on Base</p>
      <div className="space-x-4">
        <a href="/create" className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition">Create Pool</a>
        <a href="/" className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition">View Pools</a>
      </div>
    </div>
  );
}
