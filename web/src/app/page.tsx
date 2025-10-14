"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { walletClient, votingContract } from "@/lib/contract";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { address } = useAccount();
  const [electionTitle, setElectionTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function createElection() {
    if (!walletClient || !address) return alert("Connect wallet first");
    setLoading(true);

    try {
      const txHash = await walletClient.writeContract({
        ...votingContract,
        functionName: "createElection",
        args: [
          electionTitle,
          "Test Description",
          BigInt(0),
          BigInt(9999999999),
        ],
        account: address,
      });

      console.log("Tx Hash:", txHash);
      alert("Election created! Transaction: " + txHash);
    } catch (error) {
      console.error(error);
      alert("Error creating election");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">🗳️ SecureVote Dashboard</h1>
      <ConnectButton />

      {address && (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Election title"
            value={electionTitle}
            onChange={(e) => setElectionTitle(e.target.value)}
            className="border rounded-md p-2 w-80"
          />
          <button
            onClick={createElection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {loading ? "Creating..." : "Create Election"}
          </button>
        </div>
      )}
    </main>
  );
}
