// lib/tokenList.ts

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  decimals: number;
}

export const tokenList: TokenInfo[] = [
  {
    name: 'Toby',
    symbol: '$TOBY',
    address: '0x29cbAa230EE61767fa0020d5B6bDC88643cBcd2d',
    logoURI: '/logos/toby.png',
    decimals: 18,
  },
  {
    name: 'Patience',
    symbol: '$PATIENCE',
    address: '0x6D96f18F00B815B2109A3766E79F6A7aD7785624',
    logoURI: '/logos/patience.png',
    decimals: 18,
  },
  {
    name: 'Taboshi',
    symbol: '$TABOSHI',
    address: '0x82303bF85872f8E4058eD06dD3c6588E60cBB7fC',
    logoURI: '/logos/taboshi.png',
    decimals: 18,
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    address: '0xd9AA2824d79F584aDCc0f1FA1cE823c3Cb0e9600',
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
    decimals: 6,
  },
  {
    name: 'WETH',
    symbol: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    decimals: 18,
  },
  {
    name: 'ZORA',
    symbol: 'ZORA',
    address: '0x5a7D6B55Af2032dE75a1bA9e7c661D6f1bBfE5cE',
    logoURI: 'https://assets.coingecko.com/coins/images/31537/small/zora_logo.jpg',
    decimals: 18,
  },
  // Add more Base/Farcaster tokens here as needed
];
