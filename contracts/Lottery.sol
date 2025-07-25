// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract Lottery {
    struct Pool {
        address creator;
        IERC20 token;
        uint256 entryAmount;
        uint256 createdAt;
        address[] players;
        address winner;
    }

    uint256 public constant ENTRY_FEE_PERCENT = 50; // 0.5%
    uint256 public constant CLAIM_FEE_PERCENT = 50; // 0.5%
    uint256 public constant FEE_DIVISOR = 10000;
    uint256 public constant MIN_DURATION = 5 minutes;
    uint256 public constant MAX_PLAYERS = 200;

    address public immutable feeWallet;
    uint256 public poolCount;
    mapping(uint256 => Pool) public pools;

    event PoolCreated(uint256 poolId, address creator, address token, uint256 entryAmount);
    event PlayerEntered(uint256 poolId, address player);
    event WinnerSelected(uint256 poolId, address winner, uint256 amountWon);

    constructor(address _feeWallet) {
        require(_feeWallet != address(0), "Fee wallet required");
        feeWallet = _feeWallet;
    }

    function createPool(IERC20 token, uint256 entryAmount) external {
        require(entryAmount > 0, "Invalid entry amount");
        Pool storage pool = pools[poolCount];
        pool.creator = msg.sender;
        pool.token = token;
        pool.entryAmount = entryAmount;
        pool.createdAt = block.timestamp;
        emit PoolCreated(poolCount, msg.sender, address(token), entryAmount);
        poolCount++;
    }

    function enterPool(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        require(pool.entryAmount > 0, "Pool doesn't exist");
        require(pool.winner == address(0), "Winner already selected");
        require(pool.players.length < MAX_PLAYERS, "Pool full");

        uint256 fee = (pool.entryAmount * ENTRY_FEE_PERCENT) / FEE_DIVISOR;
        uint256 amountToPool = pool.entryAmount - fee;

        require(pool.token.transferFrom(msg.sender, address(this), pool.entryAmount), "Transfer failed");
        require(pool.token.transfer(feeWallet, fee), "Fee transfer failed");

        pool.players.push(msg.sender);
        emit PlayerEntered(poolId, msg.sender);
    }

    function selectWinner(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        require(pool.players.length > 0, "No players");
        require(pool.winner == address(0), "Already selected");
        require(block.timestamp >= pool.createdAt + MIN_DURATION, "Too early");

        uint256 rand = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, pool.players.length)
            )
        );

        uint256 winnerIndex = rand % pool.players.length;
        pool.winner = pool.players[winnerIndex];
        emit WinnerSelected(poolId, pool.winner, pool.players.length);
    }

    function claimWinnings(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        require(msg.sender == pool.winner, "Not winner");
        require(pool.winner != address(0), "No winner");

        uint256 total = pool.entryAmount * pool.players.length;
        uint256 fee = (total * CLAIM_FEE_PERCENT) / FEE_DIVISOR;
        uint256 payout = total - fee;

        require(pool.token.transfer(feeWallet, fee), "Claim fee transfer failed");
        require(pool.token.transfer(msg.sender, payout), "Winnings transfer failed");

        pool.winner = address(0);
    }
}
