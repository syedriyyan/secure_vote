"use client";

import React, { useState } from "react";
import { ethers, Eip1193Provider } from "ethers";
import { contractAbi } from "@/lib/ethers";

export default function Results() {
  const [results, setResults] = useState<Array<{ name: string; votes: string }>>([]);
  const [electionIdInput, setElectionIdInput] = useState<string>("");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

  async function getProviderAndContract() {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("No injected wallet found. Please install MetaMask.");
    }
    const provider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider);
    const contract = new ethers.Contract(contractAddress, contractAbi, await provider);
    return { provider, contract };
  }

  const fetchResults = async () => {
    try {
      const electionId = Number(electionIdInput);
      if (!electionId || isNaN(electionId)) return;
      const { contract } = await getProviderAndContract();
      const election = await contract.elections(electionId);
      const candidateCount = Number(election.candidateCount);

      const fetched = [] as Array<{ name: string; votes: string }>;
      for (let j = 1; j <= candidateCount; j++) {
        const [name, voteCount] = await contract.getCandidate(electionId, j);
        fetched.push({ name: String(name), votes: String(voteCount) });
      }
      setResults(fetched);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Election Results</h1>
      <input
        placeholder="Enter Election ID"
        value={electionIdInput}
        onChange={(e) => setElectionIdInput(e.target.value)}
        className="p-2 rounded text-black mr-2"
      />
      <button onClick={fetchResults} className="bg-green-600 p-2 rounded">
        Fetch Results
      </button>

      <ul className="mt-4">
        {results.map((r, i) => (
          <li key={i} className="mb-2">
            {r.name} — {r.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
}
