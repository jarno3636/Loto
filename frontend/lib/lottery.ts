import { Contract, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import LotteryABI from './LotteryABI.json';
import { tokenList } from './tokenList';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';
const BASE_RPC_URL = 'https://mainnet.base.org';

// Accepts provider or signer for reads/writes
export function getLotteryContract(providerOrSigner: JsonRpcProvider | JsonRpcSigner) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, providerOrSigner);
}

// Fetch all pools with pagination
export async function getAllPools(offset = 0, limit = 10) {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const contract = getLotteryContract(provider);

  const poolCount: number = Number(await contract.poolCount());
  const pools = [];

  for (let i = offset; i < Math.min(poolCount, offset + limit); i++) {
    const pool = await contract.pools(i);
    pools.push({
      id: i,
      creator: pool.creator,
      token: pool.token,
      entryAmount: pool.entryAmount,
      createdAt: pool.createdAt,
      players: pool.players,
      winner: pool.winner,
    });
  }

  return { pools, poolCount };
}

// Fetch most recent N pools with a winner, properly formatted with token decimals
export async function getRecentWinners(n = 3) {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const contract = getLotteryContract(provider);

  const poolCount: number = Number(await contract.poolCount());
  const winners = [];

  // Scan from most recent backwards
  for (let i = poolCount - 1; i >= 0 && winners.length < n; i--) {
    const pool = await contract.pools(i);
    if (
      pool.winner &&
      pool.winner !== '0x0000000000000000000000000000000000000000'
    ) {
      // Find token decimals from tokenList
      const tokenInfo = tokenList.find(
        (t) => t.address.toLowerCase() === pool.token.toLowerCase()
      );
      const decimals = tokenInfo?.decimals ?? 18;

      winners.push({
        id: i,
        winner: pool.winner,
        token: pool.token,
        tokenSymbol: tokenInfo?.symbol ?? '???',
        amount: Number(pool.entryAmount) / 10 ** decimals,
        createdAt: Number(pool.createdAt),
      });
    }
  }

  return winners;
}
