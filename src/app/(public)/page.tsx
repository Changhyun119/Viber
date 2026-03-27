import Link from "next/link";

import { ProjectGrid } from "@/components/projects/project-grid";
import { FlashBanner } from "@/components/ui/flash-banner";
import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentProfile } from "@/lib/auth/session";
import { getHomepageData, getViewerState } from "@/lib/services/read-models";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getTextParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const viewer = await getCurrentProfile();
  const viewerState = await getViewerState(viewer?.id);
  const data = await getHomepageData();

  return (
    <PageShell>
      <FlashBanner notice={getTextParam(params.notice)} error={getTextParam(params.error)} />

      <section className="grid gap-6 rounded-[36px] border border-line bg-[rgba(255,253,248,0.94)] px-6 py-7 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-9">
        <div className="space-y-5">
          <div className="inline-flex rounded-full bg-[rgba(215,101,66,0.1)] px-4 py-2 text-sm font-semibold text-accent">
            프로젝트 중심 쇼케이스 커뮤니티
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold tracking-tight text-foreground">
              바이브코딩 산출물을
              <br />
              바로 눌러보고 피드백 받는 곳
            </h1>
            <p className="max-w-2xl text-base leading-8 text-foreground-muted md:text-lg">
              프로젝트를 올리고, 사람들이 실제로 눌러본 뒤 반응을 남기고, 업데이트가 같은 흐름 아래 계속 쌓이도록 설계했습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white">
              프로젝트 둘러보기
            </Link>
            <Link href="/submit" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground">
              내 프로젝트 올리기
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-line bg-white px-4 py-4">
              <div className="text-sm font-semibold text-foreground">1. 눌러보고</div>
              <div className="mt-1 text-sm text-foreground-muted">카드에서 체험 가능한 프로젝트부터 바로 시작합니다.</div>
            </div>
            <div className="rounded-3xl border border-line bg-white px-4 py-4">
              <div className="text-sm font-semibold text-foreground">2. 반응 남기고</div>
              <div className="mt-1 text-sm text-foreground-muted">저장, 댓글, 피드백 요청 흐름으로 다시 돌아옵니다.</div>
            </div>
            <div className="rounded-3xl border border-line bg-white px-4 py-4">
              <div className="text-sm font-semibold text-foreground">3. 업데이트를 추적합니다</div>
              <div className="mt-1 text-sm text-foreground-muted">프로젝트 아래 활동 이력이 계속 이어집니다.</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[32px] border border-line bg-[#111827] p-6 text-white shadow-soft">
            <div className="text-sm font-semibold text-white/70">빠르게 시작하기</div>
            <div className="mt-4 grid gap-3">
              <Link href="/projects?sort=latest" className="rounded-3xl bg-white/8 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/12">
                새로 올라온 프로젝트부터 보기
              </Link>
              <Link href="/projects?activity=feedback" className="rounded-3xl bg-white/8 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/12">
                지금 피드백이 필요한 프로젝트 보기
              </Link>
              <Link
                href={viewer ? "/me/projects" : "/submit"}
                className="rounded-3xl bg-white/8 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                {viewer ? "내 프로젝트 관리하러 가기" : "내 프로젝트 올리기"}
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-line bg-white p-5 shadow-soft">
            <div className="mb-3 text-sm font-semibold text-foreground-muted">자주 보는 태그</div>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Link key={tag.slug} href={`/tags/${tag.slug}`} className="rounded-full border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground">
                  {tag.name}
                </Link>
              ))}
            </div>
            {viewer ? <div className="mt-4 text-sm text-foreground-muted">현재 저장한 프로젝트 {viewerState.savedProjectIds.length}개</div> : null}
          </div>

          <div className="rounded-[32px] border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-foreground">이 공간의 기준</div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground-muted">
              <li>프로젝트 카드가 글보다 먼저 보입니다.</li>
              <li>좋아요보다 실제 체험과 반응이 중요합니다.</li>
              <li>업데이트와 피드백 요청은 프로젝트 아래에 쌓입니다.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="추천" title="오늘 바로 눌러볼 만한 프로젝트" description="메인 노출은 좋아요 숫자 대신 실제 체험과 반응률을 기준으로 편성합니다." />
        <ProjectGrid items={data.featured} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} featured />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="신규 공개"
          title="새로 공개된 프로젝트"
          description="최근 런치한 프로젝트만 빠르게 훑고, 마음에 들면 바로 체험으로 이어집니다."
          action={
            <Link href="/projects?sort=latest" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              전체 보기
            </Link>
          }
        />
        <ProjectGrid items={data.launches} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="피드백 요청"
          title="지금 답이 필요한 프로젝트"
          description="메이커가 막히는 지점이 분명한 프로젝트만 모았습니다."
          action={
            <Link href="/projects?activity=feedback" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              더 보기
            </Link>
          }
        />
        <ProjectGrid items={data.feedback} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} />
      </section>
    </PageShell>
  );
}
