'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { getLotteryContract } from '@/lib/lottery';
import { tokenList } from '@/lib/tokenList';
import { fetchUsdPrice } from '@/lib/price';
import MotionButton from '@/components/MotionButton';

export default function EnterPoolPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: walletClient } = useWalletClient();

  const [entryAmount, setEntryAmount] = useState('');
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [selectedToken, setSelectedToken] = useState<any>(null);

  useEffect(() => {
    // Dummy: Lookup token by ID or assume fixed for now
    const token = tokenList[0]; // TEMP until token logic is added
    setSelectedToken(token);
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedToken && entryAmount) {
        const price = await fetchUsdPrice(selectedToken.symbol);
        if (price) {
          const value = parseFloat(entryAmount) * price;
          setUsdValue(value);
          if (value < 1) {
            setError('Minimum entry is $1.');
          } else {
            setError('');
          }
        }
      }
    };
    fetchPrice();
  }, [selectedToken, entryAmount]);

  const handleEnter = async () => {
    if (!walletClient || !selectedToken) {
      setError("Wallet not connected or token unavailable.");
      return;
    }

    try {
      const contract = getLotteryContract(walletClient);
      const tokenContract = new ethers.Contract(
        selectedToken.address,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        walletClient
      );

      const parsedAmount = ethers.utils.parseUnits(entryAmount, selectedToken.decimals);

      await tokenContract.approve(contract.address, parsedAmount);
      const tx = await contract.enterPool(id, parsedAmount);
      await tx.wait();

      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to enter pool.');
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Join Pool #{id}</h1>

      {selectedToken && (
        <div className="mb-4">
          <p className="text-lg mb-1">Token: {selectedToken.symbol}</p>
          <div className="flex items-center gap-2">
            <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="h-6 w-6" />
            <span>{selectedToken.name}</span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2">Entry Amount</label>
        <input
          type="number"
          step="any"
          className="w-full p-2 bg-slate-800 text-white rounded"
          value={entryAmount}
          onChange={(e) => setEntryAmount(e.target.value)}
        />
        {usdValue && (
          <p className="text-sm text-gray-400 mt-1">
            ≈ ${usdValue.toFixed(2)} USD
          </p>
        )}
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <MotionButton onClick={handleEnter} disabled={!selectedToken || !!error}>
        Enter Pool
      </MotionButton>
    </main>
  );
}
