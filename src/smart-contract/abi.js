export const contractAddress = "0xDa10839E029877dDCAEbDB2DC99f3CA622841434";
export const wrappedMonAddress = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
export const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "monadTokenAddress",
        "type": "address"
      }
    ],
    "name": "",
    "outputs": null,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "Monad__InsufficientFunds",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Monad__InsufficientRewards",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Monad__InvalidAddress",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Monad__NoStakedTokens",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Monad__TimeHasNotElapsed",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Monad__TransferFailed",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Monad__ZeroAmount",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "outputs": null,
    "stateMutability": "",
    "type": "error"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "outputs": null,
    "stateMutability": "",
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "name": "RewardsClaimed",
    "outputs": null,
    "stateMutability": "",
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TokensDeposited",
    "outputs": null,
    "stateMutability": "",
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TokensWithdrawn",
    "outputs": null,
    "stateMutability": "",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "depositTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getRemainingLockTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "getRewardRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getStakedBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getStakerInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timeDeposited",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const WmonAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)" ,
  "function approve(address spender, uint256 amount) public returns (bool)",
];