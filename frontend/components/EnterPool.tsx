'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getTokenPriceUSD } from '@/lib/price';
import { tokenList } from '@/lib/tokenList';

interface Props {
  onEnter: (amount: number, token: string) => void;
  poolType: 'small' | 'medium' | 'big';
}

export default function EnterPool({ onEnter, poolType }: Props) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(tokenList[0].address);
  const [tokenPriceUSD, setTokenPriceUSD] = useState(0);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    async function fetchPrice() {
      const price = await getTokenPriceUSD(selectedToken);
      setTokenPriceUSD(price);
    }
    fetchPrice();
  }, [selectedToken]);

  function getRange(type: string): [number, number] {
    if (type === 'small') return [0.5, 1.5];
    if (type === 'medium') return [3, 5];
    return [0.1, 1000000]; // Big pool = no enforced limit
  }

  function handleEnter() {
    const [min, max] = getRange(poolType);
    const amountNum = parseFloat(amount);
    const usdValue = amountNum * tokenPriceUSD;

    if (usdValue < min || usdValue > max) {
      setWarning(`Entry must be between $${min.toFixed(2)} and $${max.toFixed(2)}. Currently: $${usdValue.toFixed(2)}.`);
      return;
    }

    setWarning('');
    onEnter(amountNum, selectedToken);
  }

  return (
    <div className="space-y-4 bg-slate-800 p-4 rounded-xl">
      {!isConnected && <p className="text-red-400">Please connect your wallet to enter.</p>}

      <div className="flex items-center space-x-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 rounded text-black"
        />

        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        >
          {tokenList.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      {warning && <p className="text-yellow-400 text-sm">{warning}</p>}

      <button
        onClick={handleEnter}
        disabled={!isConnected}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Enter Pool
      </button>
    </div>
  );
}
