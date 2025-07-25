export async function fetchTokenPrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await response.json();
    return data[symbol]?.usd ?? null;
  } catch (error) {
    console.error('Failed to fetch price:', error);
    return null;
  }
}