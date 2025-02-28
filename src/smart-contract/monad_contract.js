import { ethers } from "ethers";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { contractAddress, abi, wrappedMonAddress, WmonAbi } from "./abi";

export const useMonadContract = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [signerAddress, setSignerAddress] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                await providerInstance.send("eth_requestAccounts", []);
                const signerInstance = await providerInstance.getSigner();
                setProvider(providerInstance);
                setSigner(signerInstance);
                setSignerAddress(await signerInstance.getAddress());
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            console.error("Please install MetaMask.");
            toast.error("Please install MetaMask.");
        }
    };

    const depositWmon = async (amount) => {
        if (!signer) return toast.error("Connect wallet first.");
        try {
            const depositAmount = ethers.parseEther(amount.toString());
            const monContract = new ethers.Contract(wrappedMonAddress, WmonAbi, signer);
            await (await monContract.approve(contractAddress, depositAmount)).wait();

            const contract = new ethers.Contract(contractAddress, abi, signer);
            await (await contract.depositTokens(depositAmount)).wait();
            toast.success("Deposit successful!");
        } catch (error) {
            toast.error(`Deposit failed: ${error.message}`);
        }
    };

    const withdrawToken = async (amount) => {
        if (!signer) return toast.error("Connect wallet first.");
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            await (await contract.withdrawTokens(ethers.parseEther(amount.toString()))).wait();
            toast.success("Withdraw successful!");
        } catch (error) {
            toast.error(`Withdraw failed: ${error.message}`);
        }
    };

    const claimRewards = async () => {
        if (!signer) return toast.error("Connect wallet first.");
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const tx = await contract.claimRewards();
            await tx.wait()
            toast.success("Rewards Claimed successful!");
        } catch (error) {
            toast.error(`Claimed failed: ${error.message}`);
        }
    };

    const withdrawTotalBalance = async () => {
        if (!signer) return toast.error("Connect wallet first.");
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            await (await contract.withdrawTokens(await contract.getStakedBalance(signerAddress))).wait();
            toast.success("Withdraw successful!");
        } catch (error) {
            toast.error(`Withdraw failed: ${error.message}`);
        }
    };

    const getStakedBalance = async () => {
        if (!provider) return toast.error("Connect wallet first.");
        try {
            const contract = new ethers.Contract(contractAddress, abi, provider);
            return ethers.formatEther(await contract.getStakedBalance(signerAddress));
        } catch (error) {
            console.error("Error fetching staked balance:", error);
        }
    };

    const getRemainingLockTime = async () => {
        if (!provider) return toast.error("Connect wallet first.");
        try {
            const contract = new ethers.Contract(contractAddress, abi, provider);
            return (await contract.getRemainingLockTime(signerAddress)).toString();
        } catch (error) {
            console.error("Error fetching lock time:", error);
        }
    };

    const getWmonBalance = async () => {
        if (!provider) return toast.error("Connect wallet first.");
        try {
            const contract = new ethers.Contract(wrappedMonAddress, WmonAbi, provider);
            return ethers.formatEther(await contract.balanceOf(signerAddress));
        } catch (error) {
            console.error("Error fetching WMON balance:", error);
        }
    };

    const disconnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setSignerAddress("");
    };    

    return {
        connectWallet,
        signerAddress,
        depositWmon,
        withdrawToken,
        withdrawTotalBalance,
        getStakedBalance,
        getRemainingLockTime,
        getWmonBalance,
        claimRewards,
        disconnectWallet,
    };
};
