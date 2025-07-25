import { ethers } from 'ethers';
import LotteryABI from './LotteryABI.json';

const LOTTERY_CONTRACT_ADDRESS = '0x828A55DBfdbC97519aebb8F49aeAdF3084eB6dEa'; // replace if needed
const SUPPORTED_NETWORKS = ['8453']; // Base Mainnet

export function getLotteryContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LotteryABI, providerOrSigner);

import PoolCard from "../components/PoolCard";

// Example usage
<div className="grid gap-4">
  {[0, 1, 2].map((id) => (
    <PoolCard key={id} poolId={id} />
  ))}
</div>  
}

export function isSupportedNetwork(chainId: string) {
  return SUPPORTED_NETWORKS.includes(chainId);
}
