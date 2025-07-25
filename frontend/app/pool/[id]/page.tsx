'use client';

import { useParams } from 'next/navigation';
import EnterPool from '@/components/EnterPool';
import { useEffect, useState } from 'react';

export default function PoolPage() {
  const { id } = useParams();
  const [poolType, setPoolType] = useState<'small' | 'medium' | 'big'>('small');

  // Placeholder logic — eventually you'd fetch real pool data
  useEffect(() => {
    // Simulate pool type from id
    if (id === '0') setPoolType('small');
    else if (id === '1') setPoolType('medium');
    else setPoolType('big');
  }, [id]);

  function handleEnter(amount: number, tokenAddress: string) {
    console.log(`User wants to enter with ${amount} of token ${tokenAddress}`);
    // TODO: call your smart contract here
    alert(`Entered pool with ${amount} tokens (${tokenAddress})`);
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-white">Pool #{id}</h1>
      <p className="text-slate-300">Type: {poolType.charAt(0).toUpperCase() + poolType.slice(1)} Pool</p>

      <EnterPool poolType={poolType} onEnter={handleEnter} />
    </div>
  );
}
