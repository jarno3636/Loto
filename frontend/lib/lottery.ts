// frontend/lib/lottery.ts
import { Contract, JsonRpcProvider } from 'ethers';
import LotteryABI from './LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';
const BASE_RPC_URL = 'https://mainnet.base.org';

export function getLotteryContract(provider: JsonRpcProvider) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, provider);
}

// Supports pagination!
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
