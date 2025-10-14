import { createPublicClient, createWalletClient, custom, http } from "viem";
import { hardhat } from "wagmi/chains";
import { abi } from "./VotingABI";

// 🧩 Replace this with your deployed address from Step 15
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Public client (for reading blockchain data)
export const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// Wallet client (for sending transactions)
export const walletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: hardhat,
        transport: custom(window.ethereum),
      })
    : null;

export const votingContract = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi,
};
