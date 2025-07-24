// /frontend/pages/_app.js

import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import "../styles/globals.css"; // make sure this exists or comment it out

const activeChain = "base"; // Base Mainnet

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId="your-thirdweb-client-id" // replace this with yours
      supportedWallets={[metamaskWallet()]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
