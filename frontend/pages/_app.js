import "../styles/globals.css";
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
import { Base } from "@thirdweb-dev/chains";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={Base}
      clientId="67f8fc061c57545f024e949f28d94fc3"
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect()
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
