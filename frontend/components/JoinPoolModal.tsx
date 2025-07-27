'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { getLotteryContract } from '../lib/lottery';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  poolId: number | string;
}

export default function JoinPoolModal({ isOpen, onClose, poolId }: Props) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const joinPool = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!walletClient || !isConnected || !address) {
        setError('Please connect your wallet.');
        setLoading(false);
        return;
      }

      // ethers v6+ signer from wagmi walletClient
      const signer = new ethers.JsonRpcSigner(walletClient.transport, address);

      const contract = getLotteryContract(signer);

      // You may want to change gas limit or pass entry fee here!
      const tx = await contract.joinPool(poolId);
      await tx.wait();

      setSuccess('Successfully joined the pool!');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-slate-800 rounded-lg p-6 w-full max-w-md text-white">
          <Dialog.Title className="text-2xl font-bold mb-4">Join Pool #{poolId}</Dialog.Title>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-500 mb-2">{success}</div>}
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={joinPool}
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join Pool'}
          </button>
          <button
            className="px-3 py-1 mt-4 bg-slate-700 rounded hover:bg-slate-600 ml-2"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
