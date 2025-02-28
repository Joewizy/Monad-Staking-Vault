"use client";
import toast from 'react-hot-toast';
import React, { useState, useEffect , useCallback} from "react";
import { useMonadContract } from "../smart-contract/monad_contract";

const HomePage = () => {
  const {
    connectWallet,
    disconnectWallet, 
    signerAddress,
    depositWmon,
    getStakedBalance,
    getRemainingLockTime,
    getWmonBalance,
    withdrawToken,
    withdrawTotalBalance,
    claimRewards,
  } = useMonadContract();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [monBalance, setMonBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [nextWithdraw, setNextWithdraw] = useState("0");

  const fetchBalances = useCallback(async () => {
    try {
      const [balance, lockTime, monBal] = await Promise.all([
        getStakedBalance(),
        getRemainingLockTime(),
        getWmonBalance(),
      ]);
      setStakedBalance(balance || "0");
      setMonBalance(monBal || "0");
      setNextWithdraw(formatTime(lockTime || "0"));
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  }, [getStakedBalance, getRemainingLockTime, getWmonBalance]);
  
  useEffect(() => {
    if (signerAddress) {
      fetchBalances();
    }
  }, [signerAddress, fetchBalances]);  

  const formatTime = (seconds: number | string): string => {
    const sec = Number(seconds);
    if (isNaN(sec) || sec < 0) return "⏳ N/A";
    
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    if (days > 0) return `⏳ ${days} days`;
    if (hours > 0) return `⏳ ${hours} hours`;
    return `⏳ ${sec} seconds`;
  };  

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      toast.error("Enter a valid deposit amount.");
      return;
    }
    await depositWmon(depositAmount);
    setDepositAmount("");
    fetchBalances();
  };

  const handleWithdrawal = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast.error("Enter a valid withdrawal amount.");
      return;
    }
    await withdrawToken(withdrawAmount);
    setWithdrawAmount("");
    fetchBalances();
  };

  const handleWithdrawalAll = async () => {
    await withdrawTotalBalance();
    fetchBalances();
  };

  const handleClaimRewards = async () => {
    await claimRewards();
    fetchBalances();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative p-4"
      style={{ backgroundImage: "url('https://img.freepik.com/free-vector/gradient-connection-background_52683-117386.jpg')" }}
    >
      {/* Global style to remove number input spinners */}
      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Header - Wallet Connect / Disconnect Button */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {!signerAddress ? (
          <button
            onClick={connectWallet}
            className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-200"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="px-4 py-2 border border-gray-400 rounded text-gray-700">
              {signerAddress.slice(0, 6)}...{signerAddress.slice(-4)}
            </div>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 border border-red-400 rounded text-red-700 hover:bg-red-200"
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white bg-opacity-95 rounded-lg shadow-xl p-10 max-w-md w-full">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-4">StakeWMON</h1>
        <p className="text-center text-gray-600 mb-6">
          Stake your Wrapped Monad (WMON) tokens and earn rewards in a secure, friendly environment.
        </p>

        {/* Deposit Form */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <label className="mr-2 text-gray-700 font-semibold">Deposit:</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0"
              className="w-20 px-2 py-1 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900"
            />
            <button
              onClick={handleDeposit}
              className="ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded-r"
            >
              Send
            </button>
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <label className="mr-2 text-gray-700 font-semibold">Withdraw:</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0"
              className="w-20 px-2 py-1 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900"
            />
            <button
              onClick={handleWithdrawal}
              className="ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded-r"
            >
              Send
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleWithdrawalAll}
              className="px-4 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Withdraw All
            </button>
          </div>
        </div>

        {/* Claim Rewards */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleClaimRewards}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Claim Rewards
          </button>
        </div>

        {/* Balances */}
        {signerAddress && (
          <div className="text-center mt-6 text-lg text-gray-800">
            <p>
              <strong>Staked Balance:</strong> {stakedBalance} WMON
            </p>
            <p>
              <strong>Total WMON Balance:</strong> {monBalance} WMON
            </p>
            <p>
              <strong>Next Withdraw:</strong> {nextWithdraw}
            </p>
          </div>
        )}

        {/* Staking Tiers - Nav Bar Style */}
        <div className="flex justify-around mt-8 border-t pt-4">
          <div className="text-center">
            <p className="font-bold text-gray-800">Tier 1</p>
            <p className="text-sm text-gray-600">Stake ≥ 1 WMON</p>
            <p className="text-sm text-gray-600">20% APY</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Tier 2</p>
            <p className="text-sm text-gray-600">Stake ≥ 0.1 WMON</p>
            <p className="text-sm text-gray-600">10% APY</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Tier 3</p>
            <p className="text-sm text-gray-600">Stake &lt; 0.1 WMON</p>
            <p className="text-sm text-gray-600">5% APY</p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          You can claim rewards after 24 hours.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
