/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, BookMarked, MessageSquareText } from "lucide-react";

import { OutboundLink } from "@/components/analytics/outbound-link";
import { ProjectEventBeacon } from "@/components/analytics/project-event-beacon";
import type { SessionProfile } from "@/lib/auth/session";
import { categoryLabels, platformLabels, stageLabels } from "@/lib/constants";
import type { ProjectCardModel } from "@/lib/services/read-models";
import { formatRelative } from "@/lib/utils/date";

type ProjectRowProps = {
  project: ProjectCardModel;
  rank?: number;
  viewer: SessionProfile | null;
  saved?: boolean;
};

export function ProjectRow({ project, rank, viewer, saved = false }: ProjectRowProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-3 transition hover:bg-surface-muted">
      <ProjectEventBeacon projectId={project.id} kind="project_card_impression" source="projects_card" />

      {/* 순위 */}
      {rank !== undefined && (
        <span className="hidden w-6 shrink-0 text-center text-sm font-bold text-foreground-muted sm:block">
          {rank}
        </span>
      )}

      {/* 로고 */}
      <div className="size-10 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-muted">
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 이름 + 설명 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/p/${project.slug}`}
            className="text-sm font-bold text-foreground hover:underline"
          >
            {project.title}
          </Link>
          <span className="rounded-full border border-line bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground-muted">
            {categoryLabels[project.category] ?? project.category}
          </span>
          <span className="hidden rounded-full border border-line bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground-muted sm:inline">
            {platformLabels[project.platform as keyof typeof platformLabels] ?? project.platform}
          </span>
          <span className="hidden rounded-full border border-line bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground-muted sm:inline">
            {stageLabels[project.stage as keyof typeof stageLabels] ?? project.stage}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-foreground-muted">{project.tagline}</p>
      </div>

      {/* 메트릭 */}
      <div className="hidden shrink-0 items-center gap-3 text-xs text-foreground-muted sm:flex">
        <span className="inline-flex items-center gap-1">
          <MessageSquareText className="size-3.5" />
          {project.metrics.comments}
        </span>
        <span className="inline-flex items-center gap-1">
          <BookMarked className="size-3.5" />
          {project.metrics.saves}
        </span>
        <span className="hidden lg:inline">{formatRelative(project.latestActivityAt)}</span>
      </div>

      {/* 액션 버튼 */}
      <div className="flex shrink-0 items-center gap-2">
        <OutboundLink
          projectId={project.id}
          source="projects_try"
          href={project.liveUrl}
          className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background transition hover:opacity-80"
        >
          Try <ArrowUpRight className="size-3" />
        </OutboundLink>
        {viewer ? (
          <form action={`/api/projects/${project.id}/save`} method="post">
            <input type="hidden" name="redirectTo" value={`/p/${project.slug}`} />
            <button className="hidden rounded-full border border-line bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-surface-muted sm:inline-flex">
              {saved ? "저장됨" : "저장"}
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}
