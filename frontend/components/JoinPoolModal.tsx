'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { getLotteryContract } from '../lib/lottery';
import { useAccount, useSigner } from 'wagmi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  poolId: number;
}

export default function JoinPoolModal({ isOpen, onClose, poolId }: Props) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleJoin() {
    setLoading(true);
    setError('');

    try {
      const contract = getLotteryContract(signer!);
      const tx = await contract.enterPool(poolId);
      await tx.wait();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to join pool');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 p-4">
        <Dialog.Panel className="bg-slate-900 text-white p-6 rounded-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">Join Pool #{poolId}</Dialog.Title>

          {error && <div className="text-red-400 mb-3">{error}</div>}

          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Confirm Entry'}
          </button>

          <button
            onClick={onClose}
            className="mt-3 text-sm text-slate-400 hover:underline w-full text-center"
          >
            Cancel
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
