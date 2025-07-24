// frontend/pages/_app.js
import '@/styles/globals.css';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';
import Head from 'next/head';

const activeChain = ChainId.BASE;

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activeChain}>
      <Head>
        <title>Farcaster Lottery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
