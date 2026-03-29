/* eslint-disable @next/next/no-img-element */
/* Variant 5: 테이블 — 스프레드시트 스타일의 데이터 중심 뷰 */
import Link from "next/link";
import { ArrowUpRight, MessageSquareText, BookMarked } from "lucide-react";

import { OutboundLink } from "@/components/analytics/outbound-link";
import { ProjectEventBeacon } from "@/components/analytics/project-event-beacon";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryLabels, platformLabels, stageLabels } from "@/lib/constants";
import { formatRelative } from "@/lib/utils/date";
import type { ExploreVariantProps } from "./types";

export function VariantTable({ data, filters, viewer, savedProjectIds, params }: ExploreVariantProps) {
  return (
    <div className="space-y-4">
      {/* 검색 */}
      <form className="flex gap-2">
        <input
          type="search"
          name="query"
          defaultValue={filters.query}
          placeholder="프로젝트 검색..."
          className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 text-sm text-foreground placeholder:text-foreground-muted"
        />
        {filters.categories.map((c) => (
          <input key={c} type="hidden" name="categories" value={c} />
        ))}
        <select
          name="sort"
          defaultValue={filters.sort}
          className="h-9 rounded-lg border border-line bg-surface px-3 text-sm text-foreground"
        >
          <option value="trending">트렌딩</option>
          <option value="latest">최신순</option>
          <option value="updated">최근 업데이트</option>
          <option value="comments">댓글 많은 순</option>
        </select>
        <button className="h-9 rounded-lg bg-foreground px-4 text-sm font-semibold text-background">검색</button>
      </form>

      <div className="text-xs text-foreground-muted">
        총 {data.total}개 · {data.page} / {data.totalPages} 페이지
      </div>

      {data.items.length ? (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-muted text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-4 py-3">프로젝트</th>
                <th className="hidden px-4 py-3 md:table-cell">카테고리</th>
                <th className="hidden px-4 py-3 lg:table-cell">단계</th>
                <th className="hidden px-4 py-3 sm:table-cell">플랫폼</th>
                <th className="px-4 py-3 text-center">댓글</th>
                <th className="px-4 py-3 text-center">저장</th>
                <th className="hidden px-4 py-3 md:table-cell">최근 활동</th>
                <th className="px-4 py-3 text-center">링크</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {data.items.map((project, index) => (
                <tr key={project.id} className="transition hover:bg-surface-muted">
                  <ProjectEventBeacon projectId={project.id} kind="project_card_impression" source="projects_card" />
                  <td className="px-4 py-3 text-center text-xs font-bold text-foreground-muted">
                    {(filters.page - 1) * (data.pageSize ?? 20) + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-muted">
                        <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/p/${project.slug}`} className="font-semibold text-foreground hover:underline">
                          {project.title}
                        </Link>
                        <p className="line-clamp-1 text-xs text-foreground-muted">{project.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-foreground-muted md:table-cell">
                    {categoryLabels[project.category] ?? project.category}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-foreground-muted lg:table-cell">
                    {stageLabels[project.stage as keyof typeof stageLabels] ?? project.stage}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-foreground-muted sm:table-cell">
                    {platformLabels[project.platform as keyof typeof platformLabels] ?? project.platform}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-foreground-muted">
                      <MessageSquareText className="size-3" />{project.metrics.comments}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-foreground-muted">
                      <BookMarked className="size-3" />{project.metrics.saves}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-foreground-muted md:table-cell">
                    {formatRelative(project.latestActivityAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <OutboundLink
                      projectId={project.id}
                      source="projects_try"
                      href={project.liveUrl}
                      className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background transition hover:opacity-80"
                    >
                      Try <ArrowUpRight className="size-3" />
                    </OutboundLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 프로젝트가 없습니다."
          description="필터를 완화해 보세요."
          action={<Link href="/projects" className="mx-auto rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">전체 보기</Link>}
        />
      )}

      {data.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                    ? "rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
                    : "rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted"
                }
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
