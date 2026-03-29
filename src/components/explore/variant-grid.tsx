/* eslint-disable @next/next/no-img-element */
/* Variant 2: 그리드 — 카드 기반 그리드 레이아웃 */
import Link from "next/link";
import { ArrowUpRight, BookMarked, MessageSquareText } from "lucide-react";

import { OutboundLink } from "@/components/analytics/outbound-link";
import { ProjectEventBeacon } from "@/components/analytics/project-event-beacon";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryLabels, platformLabels, stageLabels } from "@/lib/constants";
import { formatRelative } from "@/lib/utils/date";
import type { ExploreVariantProps } from "./types";
import type { ProjectCardModel } from "@/lib/services/read-models";

export function VariantGrid({ data, filters, viewer, savedProjectIds, params }: ExploreVariantProps) {
  return (
    <div className="space-y-6">
      {/* 상단 검색 + 필터 바 */}
      <div className="flex flex-wrap items-center gap-3">
        <form className="flex min-w-0 flex-1 gap-2">
          <input
            type="search"
            name="query"
            defaultValue={filters.query}
            placeholder="프로젝트 검색..."
            className="h-10 min-w-0 flex-1 rounded-full border border-line bg-surface px-5 text-sm text-foreground placeholder:text-foreground-muted"
          />
          {filters.categories.map((c) => (
            <input key={c} type="hidden" name="categories" value={c} />
          ))}
          <button className="h-10 rounded-full bg-foreground px-5 text-sm font-semibold text-background">
            검색
          </button>
        </form>
        <div className="flex items-center gap-2">
          {(["trending", "latest", "updated", "comments"] as const).map((s) => {
            const labels: Record<string, string> = { trending: "트렌딩", latest: "최신", updated: "업데이트", comments: "댓글" };
            const isActive = filters.sort === s;
            const nextParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              if (key === "sort" || key === "page") return;
              if (Array.isArray(value)) value.forEach((v) => nextParams.append(key, v));
              else if (value) nextParams.set(key, value);
            });
            nextParams.set("sort", s);
            return (
              <Link
                key={s}
                href={`/projects?${nextParams.toString()}`}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  isActive ? "bg-foreground text-background" : "border border-line text-foreground-muted hover:bg-surface-muted"
                }`}
              >
                {labels[s]}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-foreground-muted">
        총 {data.total}개 · {data.page} / {data.totalPages} 페이지
      </div>

      {/* 그리드 */}
      {data.items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.items.map((project) => (
            <GridCard
              key={project.id}
              project={project}
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

      {/* 페이지네이션 */}
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
                    ? "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                    : "rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
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

function GridCard({ project, saved }: { project: ProjectCardModel; viewer: ExploreVariantProps["viewer"]; saved: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition hover:shadow-md">
      <ProjectEventBeacon projectId={project.id} kind="project_card_impression" source="projects_card" />
      <div className="aspect-[16/10] overflow-hidden bg-surface-muted">
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-line bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground-muted">
            {categoryLabels[project.category] ?? project.category}
          </span>
          <span className="rounded-full border border-line bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground-muted">
            {stageLabels[project.stage as keyof typeof stageLabels] ?? project.stage}
          </span>
        </div>
        <div>
          <Link href={`/p/${project.slug}`} className="text-base font-bold text-foreground hover:underline">
            {project.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground-muted">{project.tagline}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-foreground-muted">
            <span className="inline-flex items-center gap-1"><MessageSquareText className="size-3.5" />{project.metrics.comments}</span>
            <span className="inline-flex items-center gap-1"><BookMarked className="size-3.5" />{project.metrics.saves}</span>
            <span>{formatRelative(project.latestActivityAt)}</span>
          </div>
          <OutboundLink
            projectId={project.id}
            source="projects_try"
            href={project.liveUrl}
            className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background transition hover:opacity-80"
          >
            Try <ArrowUpRight className="size-3" />
          </OutboundLink>
        </div>
      </div>
    </article>
  );
}
