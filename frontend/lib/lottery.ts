import { Contract, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import LotteryABI from './LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';
const BASE_RPC_URL = 'https://mainnet.base.org';

// Accepts provider or signer for reads/writes
export function getLotteryContract(providerOrSigner: JsonRpcProvider | JsonRpcSigner) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, providerOrSigner);
}

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
