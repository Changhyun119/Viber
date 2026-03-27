import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";

export default function NotFound() {
  return (
    <PageShell className="max-w-[760px]">
      <section className="rounded-[36px] border border-line bg-[rgba(255,253,248,0.96)] p-8 text-center shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground-muted">404</div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">페이지를 찾을 수 없습니다.</h1>
        <p className="mt-4 text-sm leading-7 text-foreground-muted md:text-base">
          프로젝트가 비공개 상태이거나, 링크가 변경되었거나, 존재하지 않는 경로일 수 있습니다.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white">
            홈으로 이동
          </Link>
          <Link href="/projects" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground">
            프로젝트 탐색
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
