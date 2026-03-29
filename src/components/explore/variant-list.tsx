/* Variant 1: 리스트 — 현재 구현 그대로 */
import Link from "next/link";

import { ProjectRow } from "@/components/projects/project-row";
import { ExploreSidebar } from "@/components/projects/explore-sidebar";
import { EmptyState } from "@/components/ui/empty-state";
import type { ExploreVariantProps } from "./types";

const sortLabels: Record<string, string> = {
  trending: "트렌딩",
  latest: "최신 공개",
  updated: "최근 업데이트",
  comments: "댓글 많은 순",
};

export function VariantList({ data, filters, viewer, savedProjectIds, params }: ExploreVariantProps) {
  return (
    <div className="flex gap-6">
      <ExploreSidebar
        activeSort={filters.sort}
        activeCategories={filters.categories}
        activeActivity={filters.activity}
        activeFlags={{
          openSource: filters.openSource,
          noSignup: filters.noSignup,
          soloMaker: filters.soloMaker,
        }}
        currentParams={params}
      />

      <div className="min-w-0 flex-1 space-y-4">
        <form className="flex flex-wrap gap-2">
          <input
            type="search"
            name="query"
            defaultValue={filters.query}
            placeholder="프로젝트 검색..."
            className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 text-sm text-foreground placeholder:text-foreground-muted"
          />
          {filters.categories.map((c) => (
            <input key={c} type="hidden" name="categories" value={c} />
          ))}
          <select
            name="sort"
            defaultValue={filters.sort}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-sm text-foreground"
          >
            <option value="trending">트렌딩</option>
            <option value="latest">최신순</option>
            <option value="updated">최근 업데이트</option>
            <option value="comments">댓글 많은 순</option>
          </select>
          <button className="h-10 rounded-xl bg-foreground px-5 text-sm font-semibold text-background">
            검색
          </button>
        </form>

        {(filters.categories.length > 0 || filters.activity || filters.openSource || filters.noSignup || filters.soloMaker) && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-foreground-muted">필터:</span>
            {filters.categories.map((c) => (
              <span key={c} className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">{c}</span>
            ))}
            {filters.activity && (
              <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">{filters.activity}</span>
            )}
            {filters.openSource && <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">오픈소스</span>}
            {filters.noSignup && <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">가입 없이 체험</span>}
            {filters.soloMaker && <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">1인 메이커</span>}
            <Link href="/projects" className="text-xs text-foreground-muted underline hover:text-foreground">초기화</Link>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-foreground-muted">
          <span>총 {data.total}개 · {sortLabels[filters.sort] ?? filters.sort}</span>
          <span>{data.page} / {data.totalPages} 페이지</span>
        </div>

        {data.items.length ? (
          <div className="space-y-2">
            {data.items.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                rank={(filters.page - 1) * (data.pageSize ?? 20) + index + 1}
                viewer={viewer}
                saved={savedProjectIds.includes(project.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 프로젝트가 없습니다."
            description="검색어나 필터를 완화하면 더 많은 프로젝트를 볼 수 있습니다."
            action={
              <Link href="/projects" className="mx-auto rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">전체 보기</Link>
            }
          />
        )}

        {data.totalPages > 1 && (
          <Pagination data={data} params={params} />
        )}
      </div>
    </div>
  );
}

function Pagination({ data, params }: { data: ExploreVariantProps["data"]; params: ExploreVariantProps["params"] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {Array.from({ length: data.totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        const nextParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (key === "page") return;
          if (Array.isArray(value)) value.forEach((v) => nextParams.append(key, v));
          else if (value) nextParams.set(key, value);
        });
        nextParams.set("page", String(pageNumber));
        return (
          <Link
            key={pageNumber}
            href={`/projects?${nextParams.toString()}`}
            className={
              pageNumber === data.page
                ? "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                : "rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
            }
          >
            {pageNumber}
          </Link>
        );
      })}
    </div>
  );
}
