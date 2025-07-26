// frontend/types/global.d.ts

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (...args: any[]) => Promise<any>;
  // You can extend with more if needed
}

interface Window {
  ethereum?: EthereumProvider;
}
