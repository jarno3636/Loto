'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useNetwork } from 'wagmi';
import { getLotteryContract, isSupportedNetwork } from '@/lib/lottery';
import { tokens } from '@/lib/tokenList';
import { formatUnits } from 'viem';
import { toast } from 'sonner';

export default function PoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [pool, setPool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  const tokenInfo = tokens.find((t) => t.address.toLowerCase() === pool?.token?.toLowerCase());

  const loadPool = async () => {
    try {
      const contract = getLotteryContract();
      const data = await contract.pools(id);
      setPool(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load pool');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = async () => {
    try {
      if (!address || !chain || !isSupportedNetwork(String(chain.id))) {
        toast.error('Unsupported network.');
        return;
      }

      setSelecting(true);
      const contract = getLotteryContract();
      const tx = await contract.selectWinner(id);
      await tx.wait();
      toast.success('Winner selected!');
      loadPool();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to select winner');
    } finally {
      setSelecting(false);
    }
  };

  useEffect(() => {
    loadPool();
  }, [id]);

  const poolLink = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Pool #{id}</h1>

      {loading ? (
        <p className="text-slate-400">Loading pool data...</p>
      ) : !pool ? (
        <p className="text-red-400">Pool not found</p>
      ) : (
        <div className="space-y-4 bg-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3">
            {tokenInfo?.logoURI && (
              <img src={tokenInfo.logoURI} alt={tokenInfo.symbol} className="w-6 h-6" />
            )}
            <span className="text-lg font-semibold">{tokenInfo?.symbol || 'Token'}</span>
          </div>

          <div className="text-sm text-slate-400">
            Entry Amount:{' '}
            <strong className="text-white">
              {pool.entryAmount &&
                formatUnits(pool.entryAmount, tokenInfo?.decimals || 18)}{' '}
              {tokenInfo?.symbol}
            </strong>
          </div>

          <div className="text-sm text-slate-400">
            Players: <strong className="text-white">{pool.players.length}</strong>
          </div>

          <div className="text-sm text-slate-400">
            Total Value:{' '}
            <strong className="text-white">
              ~$
              {(
                Number(formatUnits(pool.entryAmount, tokenInfo?.decimals || 18)) *
                pool.players.length *
                tokenInfo?.price
              ).toFixed(2)}
            </strong>
          </div>

          <div className="text-sm text-slate-400">
            Winner:{' '}
            {pool.winner === '0x0000000000000000000000000000000000000000' ? (
              <span className="text-yellow-500">Not selected yet</span>
            ) : (
              <span className="text-green-400">{pool.winner}</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded"
              onClick={handleSelectWinner}
              disabled={selecting}
            >
              {selecting ? 'Selecting...' : 'Select Winner'}
            </button>

            <button
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm"
              onClick={() => {
                navigator.clipboard.writeText(poolLink);
                toast.success('Link copied');
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
