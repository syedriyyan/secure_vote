import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

type CandidateInput = { name: string; party?: string | null };

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, description, startDate, endDate, candidates, createdBy } =
      await req.json();

    const election = await prisma.election.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy,
        candidates: {
          create: candidates.map((c: CandidateInput) => ({
            name: c.name,
            party: c.party,
          })),
        },
      },
      include: { candidates: true },
    });

    return NextResponse.json({ success: true, election });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message });
  }
}
