import Link from "next/link";
import { redirect } from "next/navigation";

import { FlashBanner } from "@/components/ui/flash-banner";
import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentProfile, getSupabaseLoginState } from "@/lib/auth/session";
import { ensureAbsoluteUrl } from "@/lib/utils/urls";

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const viewer = await getCurrentProfile();
  const state = await getSupabaseLoginState();
  const next = ensureAbsoluteUrl(getValue(params.next) ?? "/me/projects");

  if (viewer) {
    redirect(next);
  }

  return (
    <PageShell className="max-w-[760px]">
      <FlashBanner notice={getValue(params.notice)} error={getValue(params.error)} />

      <section className="rounded-[36px] border border-line bg-[rgba(255,253,248,0.96)] p-6 shadow-soft">
        <SectionHeading
          eyebrow="Auth"
          title="이메일 로그인"
          description="매직링크를 메일로 보내고, 링크를 열면 자동으로 로그인됩니다."
        />

        <div className="mt-6 grid gap-5">
          <form action="/api/auth/email" method="post" className="grid gap-4 rounded-[28px] border border-line bg-white p-5">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              이메일
              <input
                type="email"
                name="email"
                required
                placeholder="로그인 링크를 받을 이메일"
                className="rounded-2xl border border-line bg-white px-4 py-3 font-normal"
              />
            </label>
            <button
              disabled={!state.configured}
              className="w-fit rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              로그인 링크 보내기
            </button>
          </form>

          <div className="rounded-[28px] border border-line bg-white p-5 text-sm leading-7 text-foreground-muted">
            {!state.configured
              ? "Supabase Auth 설정이 아직 완료되지 않아 실제 이메일 로그인은 막혀 있습니다. 설정이 끝나면 이 화면에서 바로 로그인 링크를 보낼 수 있습니다."
              : "이메일 본문에서 버튼을 누르면 다시 이 서비스로 돌아오고, claim이나 저장, 댓글 같은 계정 기반 기능을 바로 사용할 수 있습니다."}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-foreground">
              홈으로 이동
            </Link>
            <Link href={next} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-foreground">
              이전 흐름으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
