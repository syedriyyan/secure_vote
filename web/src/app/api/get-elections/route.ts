import { NextResponse } from "next/server";
import { getVotingContract } from "@/lib/ethers";

export async function GET() {
  try {
    const contract = getVotingContract();
    const electionCount = await contract.electionCount();

    const elections = [];
    for (let i = 1; i <= electionCount; i++) {
      const election = await contract.elections(i);

      // Get candidates for this election
      const candidates = [];
      const candidateCount = election.candidateCount;

      for (let j = 1; j <= candidateCount; j++) {
        const candidate = await contract.getCandidate(i, j);
        candidates.push({
          id: j,
          name: candidate[0],
          voteCount: Number(candidate[1]),
        });
      }

      elections.push({
        id: i,
        title: election.title,
        description: election.description,
        startTime: Number(election.startTime),
        endTime: Number(election.endTime),
        active: election.active,
        admin: election.admin,
        candidates: candidates,
        candidateCount: Number(candidateCount),
      });
    }

    return NextResponse.json(elections);
  } catch (err: unknown) {
    console.error("Fetch Elections Error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
