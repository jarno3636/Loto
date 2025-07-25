import { getContract } from 'wagmi/actions';
import { abi as LotteryABI } from '../abi/LotteryABI.json';
import { WalletClient } from 'viem';
import { publicClient } from '@/lib/wallet'; // If you have a separate client setup

const CONTRACT_ADDRESS = '0x29cbAa230EE61767fa0020d5B6bDC88643cBcd2d'; // Replace with actual address

export function getLotteryContract(walletClient: WalletClient) {
  return getContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LotteryABI,
    walletClient,
  });
}
