// app/not-found.tsx
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white text-center px-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! This page doesn't exist.</p>
      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
