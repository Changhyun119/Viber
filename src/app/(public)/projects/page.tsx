import Link from "next/link";

import { ProjectGrid } from "@/components/projects/project-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { FlashBanner } from "@/components/ui/flash-banner";
import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  categoryOptions,
  platformOptions,
  pricingOptions,
  projectPostLabels,
  stageOptions
} from "@/lib/constants";
import { getCurrentProfile } from "@/lib/auth/session";
import { getExploreData, getViewerState } from "@/lib/services/read-models";

type ProjectsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getBoolean(value: string | string[] | undefined) {
  const normalized = getValue(value);
  return normalized === "true" || normalized === "on" || normalized === "1";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const viewer = await getCurrentProfile();
  const viewerState = await getViewerState(viewer?.id);
  const filters = {
    query: getValue(params.query),
    category: getValue(params.category),
    platform: getValue(params.platform),
    stage: getValue(params.stage),
    pricing: getValue(params.pricing),
    activity: getValue(params.activity),
    openSource: getBoolean(params.openSource),
    noSignup: getBoolean(params.noSignup),
    soloMaker: getBoolean(params.soloMaker),
    sort: (getValue(params.sort) as "trending" | "latest" | "updated" | "comments" | undefined) ?? "trending",
    page: Number(getValue(params.page) ?? "1")
  };

  const data = await getExploreData(filters);

  return (
    <PageShell>
      <FlashBanner notice={getValue(params.notice)} error={getValue(params.error)} />

      <section className="space-y-5">
        <SectionHeading
          eyebrow="탐색"
          title="프로젝트 탐색"
          description="먼저 검색과 정렬만으로 좁히고, 더 필요할 때만 세부 필터를 열어 쓰는 방식으로 단순화했습니다."
        />

        <form className="grid gap-4 rounded-[32px] border border-line bg-[rgba(255,253,248,0.94)] p-5 shadow-soft">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_0.8fr_auto]">
            <input
              type="search"
              name="query"
              defaultValue={filters.query}
              placeholder="프로젝트명, 태그, 메이커 검색"
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted"
            />
            <select name="sort" defaultValue={filters.sort} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground">
              <option value="trending">트렌딩</option>
              <option value="latest">최신순</option>
              <option value="updated">최근 업데이트</option>
              <option value="comments">댓글 많은 순</option>
            </select>
            <button className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white">검색</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/projects?sort=trending" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              트렌딩
            </Link>
            <Link href="/projects?sort=latest" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              최신 공개
            </Link>
            <Link href="/projects?activity=feedback" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              피드백 요청
            </Link>
            <Link href="/projects?openSource=true" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              오픈소스
            </Link>
          </div>

          <details className="rounded-[28px] border border-line bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">세부 필터 열기</summary>
            <div className="mt-4 grid gap-4 lg:grid-cols-4">
              <select name="category" defaultValue={filters.category ?? "all"} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground">
                <option value="all">전체 카테고리</option>
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select name="platform" defaultValue={filters.platform ?? "all"} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground">
                <option value="all">전체 플랫폼</option>
                {platformOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select name="stage" defaultValue={filters.stage ?? "all"} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground">
                <option value="all">전체 스테이지</option>
                {stageOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select name="pricing" defaultValue={filters.pricing ?? "all"} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground">
                <option value="all">전체 가격</option>
                {pricingOptions.map((item) => (
                  <option key={item.value} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select name="activity" defaultValue={filters.activity ?? "all"} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground lg:col-span-2">
                <option value="all">전체 활동</option>
                {Object.entries(projectPostLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-foreground lg:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="openSource" defaultChecked={filters.openSource} />
                  오픈소스
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="noSignup" defaultChecked={filters.noSignup} />
                  가입 없이 체험
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="soloMaker" defaultChecked={filters.soloMaker} />
                  1인 메이커
                </label>
              </div>
            </div>
          </details>

          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-foreground">
              필터 초기화
            </Link>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-foreground-muted">
          <div>총 {data.total}개 프로젝트</div>
          <div>
            {data.page} / {data.totalPages} 페이지
          </div>
        </div>

        {data.items.length ? (
          <ProjectGrid items={data.items} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} />
        ) : (
          <EmptyState
            title="조건에 맞는 프로젝트가 없습니다."
            description="검색어나 필터를 조금 완화하면 더 많은 프로젝트를 볼 수 있습니다."
            action={
              <Link href="/projects" className="mx-auto rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white">
                전체 보기
              </Link>
            }
          />
        )}

        {data.totalPages > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: data.totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const nextParams = new URLSearchParams();

              Object.entries(params).forEach(([key, value]) => {
                const single = getValue(value);
                if (single) nextParams.set(key, single);
              });

              nextParams.set("page", String(pageNumber));

              return (
                <Link
                  key={pageNumber}
                  href={`/projects?${nextParams.toString()}`}
                  className={
                    pageNumber === data.page
                      ? "rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground"
                  }
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
