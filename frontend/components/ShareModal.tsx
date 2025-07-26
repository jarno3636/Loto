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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-slate-900 text-white p-6 rounded-lg w-80 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Share This Pool</h2>

        <div className="flex justify-center mb-4">
          <QRCode value={url} size={128} bgColor="#1e293b" fgColor="#ffffff" />
        </div>

        <p className="text-sm break-all mb-4">{url}</p>

        <div className="flex gap-2">
          <button
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
            onClick={copyToClipboard}
          >
            Copy Link
          </button>
          <button
            className="w-1/2 bg-violet-600 hover:bg-violet-700 text-white py-1 rounded"
            onClick={shareToX}
          >
            Share to X
          </button>
        </div>

        <button
          className="mt-4 text-sm text-gray-400 hover:underline w-full text-center"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
