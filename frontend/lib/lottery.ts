// frontend/lib/lottery.ts
import { Contract, JsonRpcProvider } from 'ethers';
import LotteryABI from './LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';

export function getLotteryContract(provider: any) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, provider);
}

const BASE_RPC_URL = 'https://mainnet.base.org';

export async function getAllPools() {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const contract = getLotteryContract(provider);
  const poolCount: number = Number(await contract.poolCount());
  const pools = [];

  for (let i = 0; i < poolCount; i++) {
    const pool = await contract.pools(i);
    pools.push({
      poolId: String(i),  // Ensure it's a string!
      tokenAddress: pool.token,
      entryAmount: pool.entryAmount.toString(),
      decimals: 18, // If your contract has decimals, replace with correct value!
      players: pool.players,
      winner: pool.winner,
      createdAt: Number(pool.createdAt) * 1000, // If unix seconds, convert to ms
    });
  }
  return pools;
}
