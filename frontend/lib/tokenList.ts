// frontend/lib/tokenList.ts

export type TokenInfo = {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  decimals: number;
};

export const tokenList: TokenInfo[] = [
  {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    logoURI: '/tokens/weth.png',
    decimals: 18,
  },
  {
    address: '0x4200000000000000000000000000000000000042',
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI: '/tokens/usdc.png',
    decimals: 6,
  },
  {
    address: '0x4200000000000000000000000000000000000007',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logoURI: '/tokens/dai.png',
    decimals: 18,
  },
  {
    address: '0x420000000000000000000000000000000000000F',
    symbol: 'cbETH',
    name: 'Coinbase Wrapped Staked ETH',
    logoURI: '/tokens/cbeth.png',
    decimals: 18,
  },
  {
    address: '0x6d96f18f00b815b2109a3766e79f6a7ad7785624',
    symbol: 'PATIENCE',
    name: 'Patience',
    logoURI: 'https://toadgod.xyz/tokens/patience.png',
    decimals: 18,
  },
  {
    address: '0x3a1a33cf4553db61f0db2c1e1721cd480b02789f',
    symbol: 'TABOSHI',
    name: 'Taboshi',
    logoURI: 'https://toadgod.xyz/tokens/taboshi.png',
    decimals: 18,
  },
  {
    address: '0x25BE27a17580F59206061B8823E3c0FbC1F7c52E',
    symbol: 'TOBY',
    name: 'Toby',
    logoURI: 'https://toadgod.xyz/tokens/toby.png',
    decimals: 18,
  },
  {
    address: '0x615346aD915D6592d1961a141a8670D698e3BbE7',
    symbol: 'LOTO',
    name: 'Loto Token',
    logoURI: '/tokens/loto.PNG', // filename is case-sensitive!
    decimals: 18,
  },
  {
    address: '0x71f5c2ee6e9fc199c57e2eb3a26d8c7c04663444',
    symbol: 'ZORA',
    name: 'Zora',
    logoURI: '/tokens/zora.png',
    decimals: 18,
  },
];
