// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Monad is Ownable {
    // ERRORS
    error Monad__TimeHasNotElapsed();
    error Monad__InvalidAddress();
    error Monad__ZeroAmount();
    error Monad__NoStakedTokens();
    error Monad__TransferFailed();
    error Monad__InsufficientRewards();
    error Monad__InsufficientFunds();

    uint256 private constant LOCK_TIME = 5 days; 
    uint256 private constant LOCK_CLAIM_TIME = 1 days;

    uint256 private constant PRECISION_MULTIPLIER = 10 ** 18;
    uint256 private constant A_YEAR = 365 days;
    uint256 private counter;

    uint256 private constant APY_TIER1 = 20; // 20%
    uint256 private constant APY_TIER2 = 10; // 10%
    uint256 private constant APY_TIER3 = 5;  // 5%

    IERC20 private immutable monadToken;

    struct StakerInfo {
        uint256 amount;
        uint256 depositTime;
    }

    mapping(address => StakerInfo) private stakers;
    mapping(address => bool) private earlyStaker;

    // Events
    event TokensDeposited(address indexed staker, uint256 amount);
    event TokensWithdrawn(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 reward);

    constructor(address monadTokenAddress) Ownable(msg.sender) {
        if (monadTokenAddress == address(0)) {
            revert Monad__InvalidAddress();
        }
        monadToken = IERC20(monadTokenAddress);
    }

    function depositTokens(uint256 amount) external {
        if (amount == 0) {
            revert Monad__ZeroAmount();
        }

        bool success = monadToken.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert Monad__TransferFailed();
        }

        // Update staker's information
        StakerInfo storage staker = stakers[msg.sender];
        staker.amount += amount;
        staker.depositTime = block.timestamp;
        
        // First 10 users who deposit at least 0.01 wmon would be eligible for the reward
        if(amount >= (PRECISION_MULTIPLIER / 100) && counter < 10 && !earlyStaker[msg.sender]) {
            counter++;
            earlyStaker[msg.sender] = true;
        }

        emit TokensDeposited(msg.sender, amount);
    }

    function withdrawTokens(uint256 amount) external {
        StakerInfo storage staker = stakers[msg.sender];

        if (staker.amount == 0) {
            revert Monad__NoStakedTokens();
        }
        if (block.timestamp < staker.depositTime + LOCK_TIME) {
            revert Monad__TimeHasNotElapsed();
        }
        if (staker.amount < amount) {
            revert Monad__InsufficientFunds();
        }

        staker.amount -= amount;

        bool success = monadToken.transfer(msg.sender, amount);
        if (!success) {
            revert Monad__TransferFailed();
        }

        emit TokensWithdrawn(msg.sender, amount);
    }

    function claimRewards() external {
        StakerInfo storage staker = stakers[msg.sender];

        if (staker.amount == 0) {
            revert Monad__NoStakedTokens();
        }
        if (block.timestamp < staker.depositTime + LOCK_CLAIM_TIME) {
            revert Monad__TimeHasNotElapsed();
        }

        uint256 stakingDuration = block.timestamp - staker.depositTime;
        uint256 rate = _getRewardRate(staker.amount);

        uint256 reward = (staker.amount * rate * stakingDuration) / (A_YEAR * 100);

        if (earlyStaker[msg.sender]) {
            reward += (PRECISION_MULTIPLIER / 10);
            earlyStaker[msg.sender] = false;
        }

        if (monadToken.balanceOf(address(this)) < reward) {
            revert Monad__InsufficientRewards();
        }

        bool success = monadToken.transfer(msg.sender, reward);
        if (!success) {
            revert Monad__TransferFailed();
        }

        staker.depositTime = block.timestamp;

        emit RewardsClaimed(msg.sender, reward);
    }

    // VIEW FUNCTIONS
    function getRewardRate(uint256 amount) external pure returns (uint256) {
        return _getRewardRate(amount);
    }

    function _getRewardRate(uint256 amount) internal pure returns (uint256) {
        if (amount >= 1 * PRECISION_MULTIPLIER) { // 1 MON and above → 20% APY
            return APY_TIER1;
        } else if (amount >= (PRECISION_MULTIPLIER / 10)) { // 0.1 MON and above → 10% APY
            return APY_TIER2;
        } else {
            return APY_TIER3; // Below 0.1 MON → 5% APY
        }
    }

    function getStakedBalance(address account) external view returns (uint256) {
        return stakers[account].amount;
    }

    function getRemainingLockTime(address account) external view returns (uint256) {
        StakerInfo storage staker = stakers[account];

        if (staker.depositTime == 0 || block.timestamp >= staker.depositTime + LOCK_TIME) {
            return 0;
        } else {
            return (staker.depositTime + LOCK_TIME) - block.timestamp;
        }
    }

    function getStakerInfo(address account) external view returns (uint256 amount, uint256 timeDeposited) {
        return (stakers[account].amount, stakers[account].depositTime);
    }
}
