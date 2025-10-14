import { NextResponse } from "next/server";
import { getVotingContract } from "@/lib/ethers";

export async function POST(req: Request) {
  try {
    const { electionId, candidateIndex } = await req.json();

    const contract = getVotingContract();
    const tx = await contract.vote(electionId, candidateIndex);
    await tx.wait();

    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (err: unknown) {
    console.error("Vote Error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
