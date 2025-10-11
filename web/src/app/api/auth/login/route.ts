import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function encodeSession(payload: Record<string, unknown>) {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ success: false, error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return NextResponse.json({ success: false, error: "Invalid password" });

    const sessionPayload = { id: user.id, email: user.email, role: user.role };
    const cookieValue = encodeSession(sessionPayload);

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
    // Set a simple HttpOnly cookie that middleware will read
    res.cookies.set("sv_session", cookieValue, { httpOnly: true, path: "/" });
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Something went wrong" });
  }
}
