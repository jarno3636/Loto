'use client';
import { useEffect } from "react";

export default function Confetti({ show }: { show: boolean }) {
  useEffect(() => {
    if (!show) return;
    // Cheap confetti burst using canvas-confetti from CDN:
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.onload = () => {
      // @ts-ignore
      window.confetti && window.confetti({ 
        particleCount: 120,
        spread: 100,
        origin: { y: 0.7 },
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [show]);
  return null;
}
