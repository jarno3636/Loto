'use client';

import React from 'react';
import Image from 'next/image';
import { tokenList, TokenInfo } from '../lib/tokenList';

type Props = {
  selectedToken: TokenInfo | null;
  onSelect: (token: TokenInfo) => void;
};

export default function TokenSelector({ selectedToken, onSelect }: Props) {
  return (
    <div className="relative w-full">
      <select
        value={selectedToken?.address || ''}
        onChange={(e) => {
          const token = tokenList.find((t) => t.address === e.target.value);
          if (token) onSelect(token);
        }}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white appearance-none focus:outline-none"
      >
        <option value="">Select a token</option>
        {tokenList.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>

      {/* Optional: show logo */}
      {selectedToken && (
        <div className="absolute right-3 top-2.5 flex items-center gap-1 pointer-events-none">
          <Image
            src={selectedToken.logoURI}
            alt={selectedToken.symbol}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm text-slate-400">{selectedToken.symbol}</span>
        </div>
      )}
    </div>
  );
}
