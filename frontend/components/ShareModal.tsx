'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from "react-qr-code";
import Image from 'next/image';

export default function ShareModal({ url, onClose }: { url: string; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const shareToX = () => {
    const text = encodeURIComponent(`Check out this lottery pool on Loto!\n\n${url}`);
    window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToFarcaster = () => {
    const text = encodeURIComponent(`Check out this lottery pool on Loto!\n\n${url}`);
    window.open(`https://warpcast.com/~/compose?text=${text}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(`Check out this lottery pool on Loto!\n${url}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-white/10 backdrop-blur-md border border-blue-400/30 rounded-2xl shadow-2xl p-6 w-80 relative flex flex-col items-center"
          initial={{ scale: 0.93, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", bounce: 0.28, duration: 0.36 } }}
          exit={{ scale: 0.96, y: 40, opacity: 0 }}
        >
          <Image src="/loto.PNG" alt="Loto" width={44} height={44} className="mb-2 rounded shadow-lg" />
          <h2 className="text-lg font-bold mb-2 text-blue-100">Share This Pool</h2>

          <div className="flex justify-center mb-4">
            <QRCode value={url} size={110} bgColor="transparent" fgColor="#ffffff" />
          </div>

          <p className="text-xs text-slate-200 text-center break-all mb-3 bg-slate-800/60 px-2 py-1 rounded">
            {url}
          </p>

          <div className="flex gap-2 mb-2 w-full">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-bold transition-all"
              onClick={copyToClipboard}
            >
              Copy
            </button>
            <button
              className="flex-1 bg-[#1D9BF0] hover:bg-[#158ad1] text-white py-2 rounded font-bold transition-all"
              onClick={shareToX}
            >
              X
            </button>
            <button
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition-all"
              onClick={shareToFarcaster}
            >
              Farcaster
            </button>
            <button
              className="flex-1 bg-[#229ED9] hover:bg-[#1e88b5] text-white py-2 rounded font-bold transition-all"
              onClick={shareToTelegram}
            >
              TG
            </button>
          </div>

          <button
            className="mt-2 text-xs text-gray-400 hover:underline transition w-full"
            onClick={onClose}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
