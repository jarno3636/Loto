// components/Footer.tsx

export default function Footer() {
  return (
    <footer className="mt-20 px-6 py-10 bg-slate-900 text-white border-t border-slate-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        
        {/* Column 1: App Info */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Loto</h4>
          <p className="text-slate-400">
            Decentralized lottery pools built on Base. Powered by the community, including the LOTO token.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Navigation</h4>
          <ul className="space-y-1 text-slate-300">
            <li><a href="/create" className="hover:text-white">Create Pool</a></li>
            <li><a href="/info" className="hover:text-white">Info & Token</a></li>
            <li><a href="/leaderboard" className="hover:text-white">Leaderboard</a></li>
          </ul>
        </div>
      </div>

      <p className="text-center text-slate-500 mt-10 text-xs">
        &copy; {new Date().getFullYear()} Loto. All rights reserved.
      </p>
    </footer>
  );
}
