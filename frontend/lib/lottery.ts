import { ethers } from 'ethers';
import LotteryABI from '../LotteryABI.json';

export const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa'; // Base Mainnet
export const SUPPORTED_NETWORKS = ['8453']; // Base chain ID

export function getLotteryContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, providerOrSigner);
}

export function isSupportedNetwork(chainId: string) {
  return SUPPORTED_NETWORKS.includes(chainId);
}
