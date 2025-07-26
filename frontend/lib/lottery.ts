// frontend/lib/lottery.ts
import { Contract, JsonRpcSigner, Provider } from 'ethers';
import LotteryABI from './LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';

// Accepts either a Provider or a JsonRpcSigner (ethers v6 style)
export function getLotteryContract(providerOrSigner: Provider | JsonRpcSigner) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, providerOrSigner);
import { JsonRpcProvider } from 'ethers';

// You can use a public Base Mainnet RPC (replace with your own for more reliability)
const BASE_RPC_URL = 'https://mainnet.base.org';

export async function getAllPools() {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const contract = getLotteryContract(provider);

  const poolCount: number = Number(await contract.poolCount());
  const pools = [];

  for (let i = 0; i < poolCount; i++) {
    const pool = await contract.pools(i);
    // If you want to format pool, do it here:
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

  return pools;
}
