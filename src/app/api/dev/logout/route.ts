import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { buildRedirectPath } from "@/lib/http";
import { deleteSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  const response = NextResponse.redirect(new URL(buildRedirectPath("/", { notice: "로그아웃했습니다." }), request.url));
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
