// frontend/lib/wagmi.ts
import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { base } from 'wagmi/chains';

// No need to export chains! Only export the config.
const { publicClient } = configureChains(
  [base],
  [publicProvider()],
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});
