import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔐 Protect protected routes — must be logged in
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/elections") ||
    pathname.startsWith("/vote") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/profile")
  ) {
    // Check our sv_session cookie (base64 JSON)
    const sv = req.cookies.get("sv_session")?.value;
    if (!sv) {
      console.log("No sv_session cookie found, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const parsed = JSON.parse(Buffer.from(sv, "base64").toString("utf8"));
      console.log("Session parsed successfully:", parsed);
      // attach parsed to the request via header for downstream use if needed
      const response = NextResponse.next();
      response.headers.set("x-sv-user", JSON.stringify(parsed));
      return response;
    } catch (error) {
      console.log("Failed to parse session cookie:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔐 Protect /admin — must be ADMIN
  if (pathname.startsWith("/admin")) {
    const sv = req.cookies.get("sv_session")?.value;
    if (!sv) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const parsed = JSON.parse(Buffer.from(sv, "base64").toString("utf8"));
      if (parsed.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      const response = NextResponse.next();
      response.headers.set("x-sv-user", JSON.stringify(parsed));
      return response;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/elections/:path*",
    "/vote/:path*",
    "/results/:path*",
    "/profile/:path*",
  ],
};
