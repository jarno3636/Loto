// frontend/lib/lottery.ts
import { Contract, JsonRpcProvider } from 'ethers';
import LotteryABI from './LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';

export function getLotteryContract(provider: any) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, provider);
}

const BASE_RPC_URL = 'https://mainnet.base.org';

export async function getAllPools(offset = 0, limit = 10) {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const contract = getLotteryContract(provider);

  const poolCount: number = Number(await contract.poolCount());
  const pools = [];

  for (let i = offset; i < Math.min(poolCount, offset + limit); i++) {
    const pool = await contract.pools(i);
    pools.push({
      poolId: String(i),
      tokenAddress: pool.token,
      entryAmount: pool.entryAmount.toString(),
      decimals: 18, // Adjust if needed!
      players: pool.players,
      winner: pool.winner,
      createdAt: Number(pool.createdAt) * 1000,
    });
  }
  return { pools, poolCount }; // <--- This is the key!
}
