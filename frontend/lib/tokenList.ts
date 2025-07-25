export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
}

export const tokenList = [
  {
    name: 'Toby',
    symbol: '$TOBY',
    address: '0xbcAD0a417b299f611f386e9ab38A049E06494C0c',
    logoURI: 'https://toadgod.xyz/toby-logo.png',
    decimals: 18,
  },
  {
    name: 'Patience',
    symbol: '$PATIENCE',
    address: '0x6d96f18f00b815b2109a3766e79f6a7ad7785624',
    logoURI: 'https://toadgod.xyz/patience-logo.png',
    decimals: 18,
  },
  {
    name: 'Taboshi',
    symbol: '$TABOSHI',
    address: '0x3a1a33cf4553db61f0db2c1e1721cd480b02789f',
    logoURI: 'https://toadgod.xyz/taboshi-logo.png',
    decimals: 18,
  },
  {
    name: 'LOTO',
    symbol: '$LOTO',
    address: '0x615346aD915D6592d1961a141a8670D698e3BbE7',
    logoURI: '/loto.PNG',
    decimals: 18,
  },
  {
    name: 'Zora',
    symbol: '$ZORA',
    address: '0x501b2a56dd25d2dfada3e4f4fb020da2d8a9fe8d',
    logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x501B2A56Dd25D2DfADA3E4f4Fb020Da2d8a9fE8D/logo.png',
    decimals: 18,
  }
];
