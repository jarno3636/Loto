// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    struct Pool {
        address creator;
        string token;
        string poolSize;
        uint256 endTime;
        address[] players;
        bool claimed;
        address winner;
    }

    Pool[] public pools;

    event PoolCreated(uint256 poolId, address creator, string token, string poolSize, uint256 endTime);
    event PlayerJoined(uint256 poolId, address player);
    event WinnerSelected(uint256 poolId, address winner);

    function createPool(string memory token, string memory poolSize, uint256 duration) external {
        address[] memory empty;
        pools.push(Pool(msg.sender, token, poolSize, block.timestamp + duration, empty, false, address(0)));
        emit PoolCreated(pools.length - 1, msg.sender, token, poolSize, block.timestamp + duration);
    }

    function joinPool(uint256 poolId) external {
        require(block.timestamp < pools[poolId].endTime, "Pool ended");
        pools[poolId].players.push(msg.sender);
        emit PlayerJoined(poolId, msg.sender);
    }

    function selectWinner(uint256 poolId) external {
        Pool storage p = pools[poolId];
        require(block.timestamp >= p.endTime, "Pool not ended yet");
        require(!p.claimed, "Already claimed");
        require(p.players.length > 0, "No players");

        uint256 winnerIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % p.players.length;
        p.winner = p.players[winnerIndex];
        p.claimed = true;

        emit WinnerSelected(poolId, p.winner);
    }

    function getPools() external view returns (Pool[] memory) {
        return pools;
    }

    function getPool(uint256 id) external view returns (Pool memory) {
        return pools[id];
    }
}
