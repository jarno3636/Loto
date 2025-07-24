import { useContract, useContractWrite, ConnectWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import lotteryAbi from "../constants/LotteryABI.json";

export default function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [poolType, setPoolType] = useState(0); // 0 = Small, 1 = Medium, 2 = Large
  const [poolId, setPoolId] = useState("");

  const contractAddress = "0x3dE6dFb9bD8e76a23C3E1aEc5E67007f58cD3A5e";

  const { contract } = useContract(contractAddress, lotteryAbi);
  const { mutateAsync: createPool } = useContractWrite(contract, "createPool");
  const { mutateAsync: joinPool } = useContractWrite(contract, "joinPool");
  const { mutateAsync: claimPrize } = useContractWrite(contract, "claimPrize");

  const handleCreatePool = async () => {
    try {
      const tx = await createPool({ args: [tokenAddress, poolType] });
      console.log("Pool created:", tx);
    } catch (err) {
      console.error("Error creating pool:", err);
    }
  };

  const handleJoinPool = async () => {
    try {
      const tx = await joinPool({ args: [poolId] });
      console.log("Joined pool:", tx);
    } catch (err) {
      console.error("Error joining pool:", err);
    }
  };

  const handleClaimPrize = async () => {
    try {
      const tx = await claimPrize({ args: [poolId] });
      console.log("Claimed prize:", tx);
    } catch (err) {
      console.error("Error claiming prize:", err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>🎟️ Farcaster Lottery</h1>
      <ConnectWallet />

      <hr />

      <h2>Create a Pool</h2>
      <input
        placeholder="Token Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <select value={poolType} onChange={(e) => setPoolType(parseInt(e.target.value))}>
        <option value={0}>Small Pool</option>
        <option value={1}>Medium Pool</option>
        <option value={2}>Large Pool</option>
      </select>
      <button onClick={handleCreatePool}>Create Pool</button>

      <hr />

      <h2>Join or Claim</h2>
      <input
        placeholder="Pool ID"
        value={poolId}
        onChange={(e) => setPoolId(e.target.value)}
      />
      <button onClick={handleJoinPool}>Join Pool</button>
      <button onClick={handleClaimPrize}>Claim Prize</button>
    </div>
  );
}
