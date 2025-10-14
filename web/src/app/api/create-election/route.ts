import { NextResponse } from "next/server";
import { getWalletWithFreshNonce, contractAbi } from "@/lib/ethers";
import { ethers } from "ethers";

export async function POST(req: Request) {
  try {
    const { title, description, startTime, endTime, candidates } =
      await req.json();

    // Validate required fields
    if (!title || !description || !startTime || !endTime) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, startTime, endTime",
        },
        { status: 400 }
      );
    }

    const { wallet, nonce } = await getWalletWithFreshNonce();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      contractAbi,
      wallet
    );

    // Create the election with explicit nonce
    const createTx = await contract.createElection(
      title,
      description,
      startTime,
      endTime,
      {
        nonce: nonce,
      }
    );
    await createTx.wait();

    // Get the election ID (it's the current electionCount)
    const electionCount = await contract.electionCount();
    const electionId = electionCount;

    // Add candidates if provided
    const candidateTxHashes = [];
    if (candidates && Array.isArray(candidates)) {
      let currentNonce = nonce + 1; // Start after the create election transaction

      for (const candidateName of candidates) {
        const addCandidateTx = await contract.addCandidate(
          electionId,
          candidateName,
          { nonce: currentNonce }
        );
        await addCandidateTx.wait();
        candidateTxHashes.push(addCandidateTx.hash);
        currentNonce++; // Increment for next transaction
      }
    }

    return NextResponse.json({
      success: true,
      electionId: electionId.toString(),
      createTxHash: createTx.hash,
      candidateTxHashes,
      message: `Election "${title}" created successfully with ${
        candidates?.length || 0
      } candidates`,
    });
  } catch (err) {
    console.error("Create election error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
