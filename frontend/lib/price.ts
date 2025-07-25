import { tokenList } from './tokenList';

const fallbackPrices: Record<string, number> = {
  '0xbcAD0a417b299f611f386e9ab38A049E06494C0c': 0.003,
  '0x6d96f18f00b815b2109a3766e79f6a7ad7785624': 0.002,
  '0x3a1a33cf4553db61f0db2c1e1721cd480b02789f': 0.001,
  '0x615346aD915D6592d1961a141a8670D698e3BbE7': 0.01,
  '0x501b2a56dd25d2dfada3e4f4fb020da2d8a9fe8d': 0.05
};

export async function fetchUsdPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);
    const data = await res.json();
    return data[symbol.toLowerCase()]?.usd ?? null;
  } catch (error) {
    console.error('Price fetch failed:', error);
    return null;
  }
}
