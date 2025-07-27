'use client';

import { useState, useEffect } from 'react';

// Fetch token list directly from Base token list URL
async function fetchBaseTokens() {
  const res = await fetch(
    'https://raw.githubusercontent.com/base-org/tokenlists/main/lists/base.tokenlist.json'
  );
  const data = await res.json();
  return data.tokens;
}

const POOL_TYPES = [
  { label: 'Small', min: 1, max: 10 },
  { label: 'Medium', min: 10, max: 100 },
  { label: 'Big', min: 100, max: 1000 },
  { label: 'Custom', min: 0, max: 999999 }
];

export default function CreatePoolPage() {
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [poolType, setPoolType] = useState(POOL_TYPES[0]);
  const [amount, setAmount] = useState(POOL_TYPES[0].min);
  const [usdPrice, setUsdPrice] = useState(1);

  // Fetch tokens on mount
  useEffect(() => {
    fetchBaseTokens().then(list => {
      setTokenList(list);
      setSelectedToken(list[0]);
    });
  }, []);

  // Fetch live USD price for selected token
  useEffect(() => {
    const fetchUsdPrice = async () => {
      if (!selectedToken) return;
      try {
        // CoinGecko lookup by symbol or address
        const cgId = selectedToken.extensions?.coingeckoId;
        if (cgId) {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=usd`
          );
          const data = await res.json();
          setUsdPrice(data[cgId]?.usd ?? 1);
        } else {
          setUsdPrice(1);
        }
      } catch {
        setUsdPrice(1);
      }
    };
    fetchUsdPrice();
  }, [selectedToken]);

  // Filtered tokens for search
  const filteredTokens = search
    ? tokenList.filter(
        (t) =>
          t.symbol.toLowerCase().includes(search.toLowerCase()) ||
          t.name.toLowerCase().includes(search.toLowerCase())
      )
    : tokenList;

  return (
    <div className="max-w-lg mx-auto p-8 mt-10 glass-card">
      <h1 className="text-3xl font-bold mb-6">Create a Lottery Pool</h1>

      <label className="block mb-2 text-lg">Select Token</label>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 mb-2 rounded-lg border text-black"
          placeholder="Search token by name or symbol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="max-h-48 overflow-y-auto rounded border bg-white">
          {filteredTokens.length === 0 ? (
            <div className="px-3 py-2 text-gray-400">No tokens found.</div>
          ) : (
            filteredTokens.slice(0, 20).map(token => (
              <button
                key={token.address}
                onClick={() => {
                  setSelectedToken(token);
                  setSearch('');
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-blue-100 ${
                  selectedToken?.address === token.address ? 'bg-blue-200' : ''
                }`}
                type="button"
              >
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-6 h-6 rounded-full border"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
                <span className="font-bold">{token.symbol}</span>
                <span className="text-xs text-gray-500 ml-2">{token.name}</span>
              </button>
            ))
          )}
        </div>
        {selectedToken && (
          <div className="mt-2 flex items-center gap-2">
            <img
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
              className="w-8 h-8 rounded-full border"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
            <div>
              <span className="font-bold">{selectedToken.symbol}</span>{' '}
              <span className="text-sm text-gray-400">{selectedToken.name}</span>
            </div>
          </div>
        )}
      </div>

      <label className="block mb-2 text-lg">Pool Type</label>
      <div className="flex gap-2 mb-4">
        {POOL_TYPES.map(type => (
          <button
            key={type.label}
            onClick={() => {
              setPoolType(type);
              setAmount(type.min);
            }}
            className={`px-3 py-1 rounded-full ${
              poolType.label === type.label
                ? 'bg-blue-700 text-white'
                : 'bg-slate-800 text-gray-300'
            }`}
            type="button"
          >
            {type.label}
          </button>
        ))}
      </div>

      <label className="block mb-2 text-lg">
        Entry Amount ({selectedToken ? selectedToken.symbol : ''})
      </label>
      <input
        type="range"
        min={poolType.min}
        max={poolType.max}
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        className="w-full mb-2"
      />
      <input
        type="number"
        value={amount}
        min={poolType.min}
        max={poolType.max}
        onChange={e => setAmount(Number(e.target.value))}
        className="w-full px-3 py-2 rounded-lg border mb-4"
      />
      <div className="text-sm mb-4">
        ~ ${(amount * usdPrice).toFixed(2)} USD
      </div>
      <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-2 font-bold text-lg w-full">
        Create Pool
      </button>
    </div>
  );
}
