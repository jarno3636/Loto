// frontend/lib/price.ts

const COINGECKO_MAP: Record<string, string> = {
  TOBY: '0xbcad0a417b299f611f386e9ab38a049e06494c0c',
  PATIENCE: '0x6d96f18f00b815b2109a3766e79f6a7ad7785624',
  TABOSHI: '0x3a1a33cf4553db61f0db2c1e1721cd480b02789f',
  LOTO: '0x615346ad915d6592d1961a141a8670d698e3bbe7',
  ZORA: '0x7e123c5e6b1c936eddc79a4197f72e9763bc32b2',
};

const FALLBACK_PRICES: Record<string, number> = {
  TOBY: 0.01,
  PATIENCE: 0.10,
  TABOSHI: 0.005,
  LOTO: 0.25,
  ZORA: 1.00,
};

export async function fetchUsdPrice(symbol: string): Promise<number | null> {
  try {
    const address = COINGECKO_MAP[symbol.toUpperCase()];
    if (address) {
      const url = `https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=${address}&vs_currencies=usd`;
      const resp = await fetch(url, { next: { revalidate: 60 } });
      if (resp.ok) {
        const json = await resp.json();
        const price = json[address.toLowerCase()]?.usd;
        if (typeof price === "number" && price > 0) return price;
      }
    }
    return FALLBACK_PRICES[symbol.toUpperCase()] ?? null;
  } catch (e) {
    return FALLBACK_PRICES[symbol.toUpperCase()] ?? null;
  }
}

export { fetchUsdPrice as getTokenPriceUSD }; // <- add this if you want both imports to work
