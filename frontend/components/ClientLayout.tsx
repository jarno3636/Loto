// frontend/components/ClientLayout.tsx
'use client';

import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
