// /frontend/pages/index.js

import { useEffect, useState } from "react";
import { useAddress, useMetamask, ThirdwebProvider } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import lotteryAbi from "../constants/LotteryABI.json";

const contractAddress = "0x3dE6dFb9bD8e76a23C3E1aEc5E67007f58cD3A5e";

export default function Home() {
  const connectWithMetamask = useMetamask();
  const address = useAddress();

  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [poolId, setPoolId] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [poolType, setPoolType] = useState("small");

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const signer = web3Provider.getSigner();
      const lotteryContract = new ethers.Contract(contractAddress, lotteryAbi, signer);
      setContract(lotteryContract);
    }
  }, []);

  const createPool = async () => {
    try {
      const type = poolType === "small" ? 0 : poolType === "medium" ? 1 : 2;
      const tx = await contract.createPool(tokenAddress, type, {
        value: ethers.utils.parseEther("0.01"),
      });
      await tx.wait();
      alert("Pool created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create pool.");
    }
  };

  const joinPool = async () => {
    try {
      const tx = await contract.joinPool(poolId, {
        value: ethers.utils.parseEther("0.01"),
      });
      await tx.wait();
      alert("Joined pool!");
    } catch (err) {
      console.error(err);
      alert("Failed to join pool.");
    }
  };

  const claimPrize = async () => {
    try {
      const tx = await contract.claimPrize(poolId);
      await tx.wait();
      alert("Prize claimed!");
    } catch (err) {
      console.error(err);
      alert("Claim failed.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!address && (
        <button onClick={connectWithMetamask}>Connect Wallet</button>
      )}

      {address && (
        <div>
          <h2>Welcome, {address}</h2>

          <h3>Create Pool</h3>
          <input
            type="text"
            placeholder="Token Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <select onChange={(e) => setPoolType(e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="big">Big</option>
          </select>
          <button onClick={createPool}>Create</button>

          <h3>Join or Claim</h3>
          <input
            type="text"
            placeholder="Pool ID"
            value={poolId}
            onChange={(e) => setPoolId(e.target.value)}
          />
          <button onClick={joinPool}>Join Pool</button>
          <button onClick={claimPrize}>Claim Prize</button>
        </div>
      )}
    </div>
  );
}
