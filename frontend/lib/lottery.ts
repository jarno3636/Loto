// frontend/lib/lottery.ts
import { Contract, JsonRpcSigner, Provider } from 'ethers';
import LotteryABI from './LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa';

// Accepts either a Provider or a JsonRpcSigner (ethers v6 style)
export function getLotteryContract(providerOrSigner: Provider | JsonRpcSigner) {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, providerOrSigner);
}
