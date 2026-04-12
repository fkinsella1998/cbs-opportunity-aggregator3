import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";

import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/types";

const PUBLIC_PATHS = ["/login", "/api/auth/send-pin", "/api/auth/verify-pin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req.cookies, sessionOptions);

  if (!session.student_id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!session.onboarding_done && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (session.onboarding_done && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
