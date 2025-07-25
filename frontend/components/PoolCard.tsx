// frontend/components/PoolCard.tsx
import React from "react";
import { useContractRead } from "wagmi";
import { LOTTERY_CONTRACT_ADDRESS } from "../constants";
import LotteryABI from "../constants/LotteryABI.json";

type Props = {
  poolId: number;
};

const PoolCard: React.FC<Props> = ({ poolId }) => {
  const { data: pool } = useContractRead({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LotteryABI,
    functionName: "pools",
    args: [poolId],
    watch: true,
  });

  if (!pool) return <div className="text-gray-400">Loading pool...</div>;

  const [creator, token, entryAmount, createdAt, players, winner] = pool;

  return (
    <div className="border rounded p-4 shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">🎯 Pool #{poolId}</h2>
      <p>💸 Entry Amount: {Number(entryAmount) / 1e18} tokens</p>
      <p>👤 Players: {players.length} / 200</p>
      <p>🏆 Winner: {winner === "0x0000000000000000000000000000000000000000" ? "Not selected" : winner}</p>
      <p className="text-sm text-gray-500">🕒 Created: {new Date(Number(createdAt) * 1000).toLocaleString()}</p>
    </div>
  );
};

export default PoolCard;
