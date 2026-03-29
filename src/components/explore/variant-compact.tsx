/* eslint-disable @next/next/no-img-element */
/* Variant 4: 핀보드 — Pinterest 스타일 Masonry 레이아웃 */
import Link from "next/link";
import { ArrowUpRight, MessageSquareText, BookMarked } from "lucide-react";

import { OutboundLink } from "@/components/analytics/outbound-link";
import { ProjectEventBeacon } from "@/components/analytics/project-event-beacon";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryLabels, stageLabels } from "@/lib/constants";
import { formatRelative } from "@/lib/utils/date";
import type { ExploreVariantProps } from "./types";
import type { ProjectCardModel } from "@/lib/services/read-models";

export function VariantCompact({ data, filters, viewer, savedProjectIds, params }: ExploreVariantProps) {
  // 2-column masonry: alternate items into columns
  const col1: typeof data.items = [];
  const col2: typeof data.items = [];
  data.items.forEach((item, i) => (i % 2 === 0 ? col1 : col2).push(item));

  return (
    <div className="space-y-6">
      {/* 검색 + 정렬 */}
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
          <button className="h-10 rounded-full bg-foreground px-5 text-sm font-semibold text-background">검색</button>
        </form>
        <div className="flex items-center gap-1.5">
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
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isActive ? "bg-foreground text-background" : "border border-line text-foreground-muted hover:bg-surface-muted"
                }`}
              >
                {labels[s]}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-foreground-muted">총 {data.total}개 · {data.page} / {data.totalPages} 페이지</div>

      {/* 핀보드 */}
      {data.items.length ? (
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {data.items.map((project, index) => (
            <PinCard
              key={project.id}
              project={project}
              saved={savedProjectIds.includes(project.id)}
              tall={index % 3 === 0}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 프로젝트가 없습니다."
          description="필터를 완화해 보세요."
          action={<Link href="/projects" className="mx-auto rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">전체 보기</Link>}
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

function PinCard({ project, saved, tall }: { project: ProjectCardModel; saved: boolean; tall: boolean }) {
  return (
    <article className="mb-4 break-inside-avoid overflow-hidden rounded-[20px] border border-line bg-surface shadow-soft transition hover:shadow-md">
      <ProjectEventBeacon projectId={project.id} kind="project_card_impression" source="projects_card" />

      {/* 커버 이미지 — 높이 변형으로 masonry 느낌 */}
      <div className={`relative overflow-hidden bg-surface-muted ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        {/* 오버레이 Try 버튼 */}
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-3 opacity-0 transition hover:opacity-100">
          <OutboundLink
            projectId={project.id}
            source="projects_try"
            href={project.liveUrl}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-foreground shadow-sm transition hover:-translate-y-0.5"
          >
            Try <ArrowUpRight className="size-3" />
          </OutboundLink>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="space-y-2.5 p-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-foreground-muted">
            {categoryLabels[project.category] ?? project.category}
          </span>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-foreground-muted">
            {stageLabels[project.stage as keyof typeof stageLabels] ?? project.stage}
          </span>
        </div>

        <div>
          <Link href={`/p/${project.slug}`} className="text-sm font-bold leading-snug text-foreground hover:underline">
            {project.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground-muted">
            {project.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-2.5">
          <span className="text-[11px] font-medium text-foreground-muted">{project.makerAlias}</span>
          <div className="flex items-center gap-2.5 text-[11px] text-foreground-muted">
            <span className="inline-flex items-center gap-0.5">
              <MessageSquareText className="size-3" />{project.metrics.comments}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <BookMarked className="size-3" />{project.metrics.saves}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
