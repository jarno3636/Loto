// frontend/lib/wagmi.ts
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { base } from 'wagmi/chains'

const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()],
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  chains,
});
