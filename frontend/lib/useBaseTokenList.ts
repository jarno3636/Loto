// frontend/lib/useBaseTokenList.ts
import { useEffect, useState } from "react";

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
  [key: string]: any; // for extra fields
}

// Fetches latest tokens from Base ecosystem token list (or falls back to static list)
export function useBaseTokenList() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/base-org/tokenlists/main/lists/base.tokenlist.json")
      .then(res => res.json())
      .then(json => setTokens(json.tokens || []))
      .catch(() => setTokens([])); // fallback: empty list if error
  }, []);
  return tokens;
}
