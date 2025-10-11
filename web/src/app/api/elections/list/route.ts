import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const elections = await prisma.election.findMany({
    include: { candidates: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ elections });
}
