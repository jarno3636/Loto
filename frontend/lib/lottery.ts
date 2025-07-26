// frontend/lib/lottery.ts
import { Contract, JsonRpcProvider } from 'ethers';
import LotteryABI from './LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';

export function getLotteryContract(providerOrSigner: any) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, providerOrSigner);
}

const BASE_RPC_URL = 'https://mainnet.base.org';

// Pagination: pass offset (skip this many from end) and limit (number to fetch)
export async function getAllPools(offset = 0, limit = 10) {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const contract = getLotteryContract(provider);

  const poolCount: number = Number(await contract.poolCount());
  // Pools are 0-indexed; show latest pools first
  const start = Math.max(poolCount - offset - limit, 0);
  const end = Math.max(poolCount - offset, 0);

  const pools = [];
  for (let i = end - 1; i >= start; i--) {
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
