import { cookies } from "next/headers";

import { createOpaqueToken, hashValue } from "@/lib/utils/crypto";

export const VISITOR_COOKIE_NAME = "vibe_visitor";

export async function getOrCreateVisitorId() {
  const cookieStore = await cookies();
  const current = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

  if (current) {
    return current;
  }

  const nextValue = createOpaqueToken(18);

  cookieStore.set(VISITOR_COOKIE_NAME, nextValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  return nextValue;
}

export async function getVisitorSessionHash(userId?: string | null) {
  if (userId) {
    return `user:${hashValue(userId)}`;
  }

  const visitorId = await getOrCreateVisitorId();
  return `anon:${hashValue(visitorId)}`;
}
