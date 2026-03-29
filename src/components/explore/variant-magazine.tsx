/* eslint-disable @next/next/no-img-element */
/* Variant 3: 매거진 — 첫 번째 항목 크게, 나머지 2컬럼 */
import Link from "next/link";
import { ArrowUpRight, BookMarked, MessageSquareText } from "lucide-react";

import { OutboundLink } from "@/components/analytics/outbound-link";
import { ProjectEventBeacon } from "@/components/analytics/project-event-beacon";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryLabels, stageLabels } from "@/lib/constants";
import { formatRelative } from "@/lib/utils/date";
import type { ExploreVariantProps } from "./types";
import type { ProjectCardModel } from "@/lib/services/read-models";

export function VariantMagazine({ data, filters, viewer, savedProjectIds, params }: ExploreVariantProps) {
  const [hero, ...rest] = data.items;

  return (
    <div className="space-y-6">
      {/* 검색바 */}
      <form className="flex gap-2">
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

      <div className="text-sm text-foreground-muted">총 {data.total}개 · {data.page} / {data.totalPages} 페이지</div>

      {data.items.length === 0 ? (
        <EmptyState
          title="조건에 맞는 프로젝트가 없습니다."
          description="검색어나 필터를 완화하면 더 많은 프로젝트를 볼 수 있습니다."
          action={<Link href="/projects" className="mx-auto rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">전체 보기</Link>}
        />
      ) : (
        <>
          {/* 히어로 카드 */}
          {hero && <HeroCard project={hero} saved={savedProjectIds.includes(hero.id)} />}

          {/* 나머지 2컬럼 */}
          {rest.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {rest.map((project) => (
                <CompactCard key={project.id} project={project} saved={savedProjectIds.includes(project.id)} />
              ))}
            </div>
          )}
        </>
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

function HeroCard({ project, saved }: { project: ProjectCardModel; saved: boolean }) {
  return (
    <article className="group grid overflow-hidden rounded-[28px] border border-line bg-surface shadow-soft md:grid-cols-[1.2fr_0.8fr]">
      <ProjectEventBeacon projectId={project.id} kind="project_card_impression" source="projects_card" />
      <div className="aspect-[16/10] overflow-hidden bg-surface-muted md:aspect-auto">
        <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover transition group-hover:scale-105" />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold text-foreground-muted">
            {categoryLabels[project.category] ?? project.category}
          </span>
          <span className="rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold text-foreground-muted">
            {stageLabels[project.stage as keyof typeof stageLabels] ?? project.stage}
          </span>
        </div>
        <div>
          <Link href={`/p/${project.slug}`} className="text-2xl font-extrabold tracking-tight text-foreground hover:underline md:text-3xl">
            {project.title}
          </Link>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground-muted">{project.tagline}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-foreground-muted">
          <span>{project.makerAlias}</span>
          <span className="inline-flex items-center gap-1"><MessageSquareText className="size-3.5" />{project.metrics.comments}</span>
          <span className="inline-flex items-center gap-1"><BookMarked className="size-3.5" />{project.metrics.saves}</span>
          <span>{formatRelative(project.latestActivityAt)}</span>
        </div>
        <div className="flex gap-2">
          <OutboundLink
            projectId={project.id}
            source="projects_try"
            href={project.liveUrl}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition hover:-translate-y-0.5"
          >
            Try <ArrowUpRight className="size-4" />
          </OutboundLink>
          <Link href={`/p/${project.slug}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
            상세 보기
          </Link>
        </div>
      </div>
    </article>
  );
}

function CompactCard({ project, saved }: { project: ProjectCardModel; saved: boolean }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <ProjectEventBeacon projectId={project.id} kind="project_card_impression" source="projects_card" />
      <div className="aspect-[16/10] overflow-hidden bg-surface-muted">
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold text-foreground-muted">
            {categoryLabels[project.category] ?? project.category}
          </span>
          <span className="rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-[11px] font-semibold text-foreground-muted">
            {stageLabels[project.stage as keyof typeof stageLabels] ?? project.stage}
          </span>
        </div>
        <div>
          <Link href={`/p/${project.slug}`} className="text-base font-bold text-foreground hover:underline">
            {project.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-foreground-muted">{project.tagline}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-foreground-muted">
            <span>{project.makerAlias}</span>
            <span className="inline-flex items-center gap-0.5"><MessageSquareText className="size-3.5" />{project.metrics.comments}</span>
            <span className="inline-flex items-center gap-0.5"><BookMarked className="size-3.5" />{project.metrics.saves}</span>
          </div>
          <OutboundLink
            projectId={project.id}
            source="projects_try"
            href={project.liveUrl}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background transition hover:opacity-90"
          >
            Try <ArrowUpRight className="size-3.5" />
          </OutboundLink>
        </div>
      </div>
    </article>
  );
}
