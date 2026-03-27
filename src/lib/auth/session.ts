import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { profiles, sessions } from "@/db/schema";
import { hashValue, createOpaqueToken } from "@/lib/utils/crypto";

export const SESSION_COOKIE_NAME = "vibe_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

export type SessionProfile = typeof profiles.$inferSelect;

export async function createSessionForUser(userId: string) {
  const rawToken = createOpaqueToken();
  const tokenHash = hashValue(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt
  });

  return {
    rawToken,
    expiresAt
  };
}

export async function setSessionCookie(rawToken: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, getSessionCookieOptions(expiresAt));
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function getSessionCookieOptions(expiresAt: Date) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const secure = appUrl ? appUrl.startsWith("https://") : process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    expires: expiresAt,
    path: "/"
  };
}

export async function deleteSession(rawToken: string) {
  const tokenHash = hashValue(rawToken);
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function getCurrentProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const tokenHash = hashValue(sessionToken);
  const rows = await db
    .select({
      sessionId: sessions.id,
      user: profiles
    })
    .from(sessions)
    .innerJoin(profiles, eq(sessions.userId, profiles.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return rows[0]?.user ?? null;
}

export async function requireCurrentProfile() {
  const user = await getCurrentProfile();

  if (!user) {
    redirect("/");
  }

  return user;
}

export async function requireAdminProfile() {
  const user = await requireCurrentProfile();

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}

export async function signInAsEmail(email: string) {
  const user = await db.query.profiles.findFirst({
    where: eq(profiles.email, email)
  });

  if (!user) {
    throw new Error("로그인 가능한 사용자를 찾을 수 없습니다.");
  }

  const session = await createSessionForUser(user.id);

  return {
    user,
    session
  };
}
