import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req: req as unknown as NextApiRequest,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 🔐 Protect /dashboard — must be logged in
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // fallback: check our sv_session cookie (base64 JSON)
      const sv = req.cookies.get("sv_session")?.value;
      if (!sv) return NextResponse.redirect(new URL("/login", req.url));
      try {
        const parsed = JSON.parse(Buffer.from(sv, "base64").toString("utf8"));
        // attach parsed to the request via header for downstream use if needed
        req.headers.set("x-sv-user", JSON.stringify(parsed));
      } catch {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  // 🔐 Protect /admin — must be ADMIN
  if (pathname.startsWith("/admin")) {
    let role = token?.role;
    if (!role) {
      const sv = req.cookies.get("sv_session")?.value;
      if (!sv) return NextResponse.redirect(new URL("/login", req.url));
      try {
        const parsed = JSON.parse(Buffer.from(sv, "base64").toString("utf8"));
        role = parsed.role;
      } catch {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
