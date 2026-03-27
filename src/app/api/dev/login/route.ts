import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { buildRedirectPath } from "@/lib/http";
import { getSessionCookieOptions, SESSION_COOKIE_NAME, signInAsEmail } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (env.NEXT_PUBLIC_ENABLE_DEV_AUTH !== "true") {
    return NextResponse.redirect(new URL(buildRedirectPath("/", { error: "개발용 로그인은 비활성화되어 있습니다." }), request.url));
  }

  const formData = await request.formData();
  const role = formData.get("role");
  const email = role === "admin" ? env.DEV_ADMIN_EMAIL : env.DEV_MEMBER_EMAIL;

  try {
    const { session } = await signInAsEmail(email);
    const response = NextResponse.redirect(new URL(buildRedirectPath("/", { notice: `${role === "admin" ? "관리자" : "회원"} 계정으로 로그인했습니다.` }), request.url));
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.rawToken,
      ...getSessionCookieOptions(session.expiresAt)
    });
    return response;
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/", {
          error: error instanceof Error ? error.message : "로그인에 실패했습니다."
        }),
        request.url
      )
    );
  }
}
