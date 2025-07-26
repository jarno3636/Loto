// frontend/lib/price.ts

const COINGECKO_IDS: Record<string, string> = {
  TOBY: 'toby',
  PATIENCE: 'patience', // replace with actual CoinGecko id if listed
  TABOSHI: 'taboshi',   // replace with actual CoinGecko id if listed
  LOTO: '',             // not listed, will fallback to static price
  ZORA: 'zora',
  // Add more if needed
};

// Fallback prices for tokens not on CoinGecko
const FALLBACK_PRICES: Record<string, number> = {
  TOBY: 0.01,
  PATIENCE: 0.10,
  TABOSHI: 0.005,
  LOTO: 0.25,
  ZORA: 1.00,
};

export async function fetchUsdPrice(symbol: string): Promise<number | null> {
  const id = COINGECKO_IDS[symbol.toUpperCase()];
  if (id) {
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;
      const res = await fetch(url, { next: { revalidate: 60 } }); // revalidate every 60s (for Next.js caching)
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (data[id] && data[id].usd) {
        return data[id].usd;
      }
    } catch (err) {
      // fall through to fallback below
    }
  }
  // Fallback static price
  return FALLBACK_PRICES[symbol.toUpperCase()] ?? null;
}
