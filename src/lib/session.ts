import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "@/types";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "change-me",
  cookieName: "cbs_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}
