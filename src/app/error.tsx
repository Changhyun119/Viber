"use client";

import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body>
        <PageShell className="max-w-[760px]">
          <section className="rounded-[36px] border border-line bg-[rgba(255,253,248,0.96)] p-8 text-center shadow-soft">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground-muted">Error</div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">예상하지 못한 오류가 발생했습니다.</h1>
            <p className="mt-4 text-sm leading-7 text-foreground-muted md:text-base">{error.message}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => reset()} className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white">
                다시 시도
              </button>
              <Link href="/" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground">
                홈으로 이동
              </Link>
            </div>
          </section>
        </PageShell>
      </body>
    </html>
  );
}
