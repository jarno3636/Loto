'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { fetchUsdPrice } from '@/lib/price';
import { tokenList } from '@/lib/tokenList';

interface Props {
  tokenSymbol: string;
  amount: string;
}

export default function EnterPool({ tokenSymbol, amount }: Props) {
  const { address, isConnected } = useAccount();
  const [usdValue, setUsdValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (tokenSymbol && amount) {
        const price = await fetchUsdPrice(tokenSymbol);
        if (price) {
          setUsdValue(parseFloat(amount) * price);
        } else {
          setUsdValue(null);
        }
      } else {
        setUsdValue(null);
      }
    };
    fetchPrice();
  }, [tokenSymbol, amount]);

  return (
    <div>
      {usdValue !== null ? (
        <p>
          {amount} {tokenSymbol} ≈ ${usdValue.toFixed(2)} USD
        </p>
      ) : (
        <p>Loading USD value...</p>
      )}
    </div>
  );
}
