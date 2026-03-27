import { NextResponse } from "next/server";

import { getSupabaseLoginState } from "@/lib/auth/session";
import { buildRedirectPath, parseOptionalString, parseRequiredString } from "@/lib/http";
import { createPublicSupabaseClient } from "@/lib/supabase/shared";
import { ensureAbsoluteUrl } from "@/lib/utils/urls";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = parseRequiredString(formData.get("email")).toLowerCase();
  const next = ensureAbsoluteUrl(parseOptionalString(formData.get("next")) ?? "/me/projects");

  try {
    const state = await getSupabaseLoginState();

    if (!state.configured) {
      throw new Error("Supabase Auth가 아직 설정되지 않았습니다.");
    }

    if (!email) {
      throw new Error("이메일을 입력해 주세요.");
    }

    const supabase = createPublicSupabaseClient();
    const redirectTo = new URL("/auth/callback", state.appUrl);
    redirectTo.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo.toString()
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/auth/sign-in", {
          notice: "로그인 링크를 메일로 보냈습니다. 받은 편지함을 확인해 주세요.",
          next
        }),
        request.url
      ),
      { status: 303 }
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/auth/sign-in", {
          error: error instanceof Error ? error.message : "이메일 로그인 링크 발송에 실패했습니다.",
          next
        }),
        request.url
      ),
      { status: 303 }
    );
  }
}
