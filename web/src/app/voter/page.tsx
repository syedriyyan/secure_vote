"use client";

import React, { useEffect, useState } from "react";
import { ethers, Eip1193Provider } from "ethers";
import { contractAbi } from "@/lib/ethers";

export default function VoterDashboard() {
  const [elections, setElections] = useState<Array<{ id: number; title: string }>>([]);
  const [selectedElection, setSelectedElection] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<Array<{ id: number; name: string }>>([]);
  const [message, setMessage] = useState<string>("");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

  const getProviderAndContract = React.useCallback(async (readOnly = true) => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("No injected wallet found. Please install MetaMask.");
    }
    const provider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider);
    if (readOnly) {
      return { provider, contract: new ethers.Contract(contractAddress, contractAbi, await provider) };
    }
    const signer = await provider.getSigner();
    return { provider, contract: new ethers.Contract(contractAddress, contractAbi, signer) };
  }, [contractAddress]);

  const getElections = React.useCallback(async () => {
    try {
      const { contract } = await getProviderAndContract(true);
      const count: bigint = await contract.electionCount();
      const tmp: Array<{ id: number; title: string }> = [];
      // Contract uses 1-based indexing in other parts of the app
      for (let i = 1; i <= Number(count); i++) {
        const e = await contract.elections(i);
        tmp.push({ id: i, title: String(e.title) });
      }
      setElections(tmp);
    } catch (err) {
      console.error(err);
      setElections([]);
    }
  }, [getProviderAndContract]);

  const getCandidatesForElection = async (electionId: number) => {
    try {
      const { contract } = await getProviderAndContract();
      const election = await contract.elections(electionId);
      const candidateCount = Number(election.candidateCount);

      const fetched = [] as Array<{ id: number; name: string }>;
      for (let j = 1; j <= candidateCount; j++) {
        const [name] = await contract.getCandidate(electionId, j);
        fetched.push({ id: j, name: String(name) });
      }

      setSelectedElection(electionId);
      setCandidates(fetched);
      setMessage("");
    } catch (err) {
      console.error(err);
      setCandidates([]);
      setMessage("Failed to load candidates.");
    }
  };

  const vote = async (candidateId: number) => {
    if (!selectedElection) return;
    try {
      const { contract } = await getProviderAndContract(false);
      const tx = await contract.vote(selectedElection, candidateId);
      await tx.wait();
      setMessage("Vote cast successfully!");
    } catch (err) {
      console.error(err);
      setMessage("You might have already voted or an error occurred.");
    }
  };

  useEffect(() => {
    getElections();
  }, [getElections]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Voter Dashboard</h1>

      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl mb-2">Select an election:</h2>
        <div className="flex flex-wrap gap-2">
          {elections.map((e) => (
            <button
              key={e.id}
              onClick={() => getCandidatesForElection(e.id)}
              className="bg-green-600 hover:bg-green-700 focus-visible:ring-2 ring-offset-2 ring-offset-gray-900 ring-green-400 px-3 py-2 rounded text-sm sm:text-base"
            >
              {e.title}
            </button>
          ))}
        </div>
      </div>

      {candidates.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl mt-2 sm:mt-4">Candidates:</h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => vote(c.id)}
                className="bg-blue-700 hover:bg-blue-800 focus-visible:ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-400 px-3 py-2 rounded text-sm sm:text-base text-left"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {message && <p className="mt-4 sm:mt-6 text-sm sm:text-base">{message}</p>}
    </div>
  );
}