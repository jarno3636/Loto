
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    uint256 public entryFee = 0.01 ether;
    address public taxWallet;
    uint256 public poolCount;

    struct Pool {
        address[] players;
        uint256 deadline;
        bool winnerPicked;
        address winner;
    }

    mapping(uint256 => Pool) public pools;

    event PoolCreated(uint256 indexed poolId, address creator, uint256 deadline);

    constructor(address _taxWallet) {
        taxWallet = _taxWallet;
    }

    function createPool(uint256 duration) external {
        require(duration > 0, "Invalid duration");
        poolCount++;
        pools[poolCount].deadline = block.timestamp + duration;
        emit PoolCreated(poolCount, msg.sender, pools[poolCount].deadline);
    }

    function enterPool(uint256 poolId) external payable {
        require(msg.value == entryFee, "Incorrect entry fee");
        require(block.timestamp < pools[poolId].deadline, "Pool ended");
        pools[poolId].players.push(msg.sender);
    }

    function pickWinner(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        require(block.timestamp >= pool.deadline, "Too early");
        require(!pool.winnerPicked, "Already picked");
        require(pool.players.length > 0, "No players");

        uint256 random = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, pool.players))
        );
        address winner = pool.players[random % pool.players.length];
        uint256 total = entryFee * pool.players.length;
        uint256 tax = total / 1000;
        uint256 prize = total - tax;

        pool.winner = winner;
        pool.winnerPicked = true;

        (bool s1, ) = payable(taxWallet).call{value: tax}("");
        (bool s2, ) = payable(winner).call{value: prize}("");
        require(s1 && s2, "Transfer failed");
    }

    function claimPrize(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        require(pool.winner == msg.sender, "Not winner");
        require(pool.winnerPicked, "Winner not picked");
        require(address(this).balance >= entryFee, "Insufficient balance");

        uint256 total = entryFee * pool.players.length;
        uint256 tax = total / 1000;
        uint256 prize = total - tax;

        (bool sent, ) = payable(msg.sender).call{value: prize}("");
        require(sent, "Claim failed");
    }

    function getPool(uint256 poolId)
        external
        view
        returns (address[] memory, uint256, bool, address)
    {
        Pool storage pool = pools[poolId];
        return (pool.players, pool.deadline, pool.winnerPicked, pool.winner);
    }
}
