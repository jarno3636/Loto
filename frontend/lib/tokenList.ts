// frontend/lib/tokenList.ts

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
}

export const tokenList: TokenInfo[] = [
  {
    name: 'Toby',
    symbol: 'TOBY',
    address: '0xbcAD0a417b299f611f386e9ab38A049E06494C0c',
    decimals: 18,
    logoURI: 'https://toadgod.xyz/images/toby.png',
  },
  {
    name: 'Patience',
    symbol: 'PATIENCE',
    address: '0x6d96f18f00b815b2109a3766e79f6a7ad7785624',
    decimals: 18,
    logoURI: 'https://toadgod.xyz/images/patience.png',
  },
  {
    name: 'Taboshi',
    symbol: 'TABOSHI',
    address: '0x3a1a33cf4553db61f0db2c1e1721cd480b02789f',
    decimals: 18,
    logoURI: 'https://toadgod.xyz/images/taboshi.png',
  },
  {
    name: 'LOTO',
    symbol: 'LOTO',
    address: '0x615346aD915D6592d1961a141a8670D698e3BbE7',
    decimals: 18,
    logoURI: '/loto.PNG', // Case-sensitive, make sure your file matches
  },
  {
    name: 'Zora',
    symbol: 'ZORA',
    address: '0x7e123C5E6B1C936eDDC79A4197f72e9763Bc32B2',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/30123/small/zora.jpg',
  },
  // Add more as needed!
];
