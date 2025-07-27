'use client';

import { useEffect, useRef } from 'react';
import QRCode from "react-qr-code";

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

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-slate-900 text-white p-6 rounded-2xl w-80 shadow-2xl border-2 border-blue-500/40 animate-pop-in">
        <h2 className="text-lg font-bold mb-3">Share This Pool</h2>
        <div className="flex justify-center mb-4">
          <QRCode value={url} size={110} bgColor="#1e293b" fgColor="#ffffff" />
        </div>
        <p className="text-sm break-all mb-3 text-slate-300">{url}</p>
        <div className="flex gap-2 mb-2">
          <button className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded" onClick={copyToClipboard}>Copy</button>
          <button className="w-1/3 bg-violet-600 hover:bg-violet-700 text-white py-1 rounded" onClick={shareToX}>X</button>
          <button className="w-1/3 bg-pink-600 hover:bg-pink-700 text-white py-1 rounded" onClick={shareToFarcaster}>Farcaster</button>
        </div>
        <button className="mt-3 text-sm text-gray-400 hover:underline w-full text-center" onClick={onClose}>Close</button>
        <style jsx>{`
          .animate-pop-in {
            animation: popIn 0.22s cubic-bezier(0.2,1.2,0.2,1) both;
          }
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.85);}
            80% { opacity: 1; transform: scale(1.06);}
            100% { opacity: 1; transform: scale(1);}
          }
        `}</style>
      </div>
    </div>
  );
}
