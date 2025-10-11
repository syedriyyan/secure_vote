import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Clear cookie or session here if implemented
  return NextResponse.json({ success: true, message: "Logged out" });
}
