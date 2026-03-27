"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function ensureRelativePath(value: string | null, fallback = "/me/projects") {
  if (!value) {
    return fallback;
  }

  return value.startsWith("/") ? value : `/${value}`;
}

function buildTargetHref(pathname: string, notice: string) {
  const url = new URL(pathname, window.location.origin);
  url.searchParams.set("notice", notice);
  return `${url.pathname}${url.search}${url.hash}`;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("로그인 세션을 확인하고 있습니다.");
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => ensureRelativePath(searchParams.get("next")), [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createSupabaseBrowserClient();
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash") ?? searchParams.get("token");
    const type = searchParams.get("type");
    const redirectError = searchParams.get("error_description") ?? searchParams.get("error");

    async function finishLogin() {
      try {
        if (redirectError) {
          throw new Error(redirectError);
        }

        if (code) {
          setMessage("로그인 코드를 교환하고 있습니다.");
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }
        } else if (tokenHash && type) {
          setMessage("이메일 인증 토큰을 확인하고 있습니다.");
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change"
          });

          if (verifyError) {
            throw verifyError;
          }
        }

        setMessage("로그인 상태를 마무리하고 있습니다.");

        for (let attempt = 0; attempt < 15; attempt += 1) {
          const {
            data: { session }
          } = await supabase.auth.getSession();

          if (session) {
            router.replace(buildTargetHref(nextPath, "이메일 로그인에 성공했습니다."));
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        throw new Error("로그인 세션을 확인하지 못했습니다. 다시 시도해 주세요.");
      } catch (authError) {
        if (cancelled) {
          return;
        }

        setError(authError instanceof Error ? authError.message : "로그인 처리에 실패했습니다.");
        setMessage("로그인에 실패했습니다.");
      }
    }

    void finishLogin();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router, searchParams]);

  return (
    <PageShell className="max-w-[760px]">
      <section className="rounded-[36px] border border-line bg-[rgba(255,253,248,0.96)] p-6 shadow-soft">
        <SectionHeading eyebrow="Auth" title="로그인 확인 중" description="이메일에서 돌아온 인증 정보를 처리하고 있습니다." />

        <div className="mt-6 grid gap-4 rounded-[28px] border border-line bg-white p-5 text-sm leading-7 text-foreground-muted">
          <p>{message}</p>
          {error ? <p className="font-semibold text-[color:#b45309]">{error}</p> : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/auth/sign-in" className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-foreground">
            로그인 화면으로 돌아가기
          </Link>
          <Link href="/" className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-foreground">
            홈으로 이동
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
