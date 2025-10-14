import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the session cookie
  res.cookies.set("sv_session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}
