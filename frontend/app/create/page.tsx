// app/create/page.tsx (main part of the form)
import { useState } from 'react';
import { tokenList } from '@/lib/tokenList';

const POOL_TYPES = [
  { label: 'Small', min: 1, max: 10 },
  { label: 'Medium', min: 10, max: 100 },
  { label: 'Big', min: 100, max: 1000 },
  { label: 'Custom', min: 0, max: 999999 }
];

export default function CreatePoolPage() {
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [poolType, setPoolType] = useState(POOL_TYPES[0]);
  const [amount, setAmount] = useState(poolType.min);
  const [usdPrice, setUsdPrice] = useState(1); // Replace with live price logic

  // ...fetch price logic here...

  return (
    <div className="max-w-lg mx-auto p-8 mt-10 glass-card">
      <h1 className="text-3xl font-bold mb-6">Create a Lottery Pool</h1>
      <label className="block mb-2 text-lg">Select Token</label>
      <select
        value={selectedToken.address}
        onChange={e =>
          setSelectedToken(tokenList.find(t => t.address === e.target.value))
        }
        className="mb-4 px-4 py-2 rounded-lg border"
      >
        {tokenList.map(token => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>
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
          >
            {type.label}
          </button>
        ))}
      </div>
      <label className="block mb-2 text-lg">
        Entry Amount ({selectedToken.symbol})
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
