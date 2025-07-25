'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatUnits } from 'ethers';
import ShareModal from './ShareModal';
import { tokenList } from '@/lib/tokenList';

export default function PoolCard({ poolId, tokenAddress, entryAmount, currentEntries, maxEntries }: {
  poolId: number;
  tokenAddress: string;
  entryAmount: string;
  currentEntries: number;
  maxEntries: number;
}) {
  const [showModal, setShowModal] = useState(false);
  const token = tokenList.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase());

  const filled = Math.min(100, (currentEntries / maxEntries) * 100).toFixed(0);

  return (
    <>
      <div className="bg-slate-800 rounded-xl p-4 shadow-lg transition-transform hover:scale-[1.015] hover:shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {token && (
              <Image src={token.logoURI} alt={token.symbol} width={24} height={24} className="rounded-full" />
            )}
            <span className="text-lg font-bold">{token?.symbol}</span>
          </div>
          <button
            title="Share pool"
            onClick={() => setShowModal(true)}
            className="text-sm text-blue-400 hover:underline"
          >
            Share
          </button>
        </div>

        <div className="text-sm mb-2">
          Entry: <span className="font-medium">{formatUnits(entryAmount, token?.decimals || 18)}</span> {token?.symbol}
        </div>

        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
          <div
            className="bg-violet-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${filled}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mb-2">
          {currentEntries} / {maxEntries} entries
        </div>

        <Link
          href={`/pool/${poolId}`}
          className="block text-center mt-2 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded transition"
        >
          View Pool
        </Link>
      </div>

      {showModal && (
        <ShareModal
          url={`${process.env.NEXT_PUBLIC_BASE_URL}/pool/${poolId}`}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
