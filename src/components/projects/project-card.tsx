/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, BookMarked, MessageSquareText } from "lucide-react";

import { OutboundLink } from "@/components/analytics/outbound-link";
import { ProjectEventBeacon } from "@/components/analytics/project-event-beacon";
import type { SessionProfile } from "@/lib/auth/session";
import { categoryLabels, platformLabels, projectPostLabels, projectStatusLabels, stageLabels, verificationLabels } from "@/lib/constants";
import type { ProjectCardModel } from "@/lib/services/read-models";
import { formatRelative } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import { StatusBadge } from "@/components/ui/status-badge";

type ProjectCardProps = {
  project: ProjectCardModel;
  viewer: SessionProfile | null;
  saved?: boolean;
  featured?: boolean;
  surface?: "home" | "projects" | "tag";
};

function getTone(project: ProjectCardModel) {
  if (project.status === "archived" || project.linkHealth?.status === "broken") return "danger" as const;
  if (project.status === "limited" || project.status === "pending") return "warning" as const;
  if (project.verificationState === "github_verified" || project.verificationState === "domain_verified") return "success" as const;
  return "default" as const;
}

function getSupportNote(project: ProjectCardModel) {
  if (project.linkHealth?.status === "broken") {
    return "링크 상태를 다시 확인해 주세요.";
  }

  if (project.status !== "published") {
    return projectStatusLabels[project.status];
  }

  if (project.verificationState !== "unverified") {
    return verificationLabels[project.verificationState];
  }

  return null;
}

function getTrySource(surface: "home" | "projects" | "tag") {
  if (surface === "home") return "home_try" as const;
  if (surface === "tag") return "tag_try" as const;
  return "projects_try" as const;
}

function getImpressionSource(surface: "home" | "projects" | "tag") {
  if (surface === "home") return "home_card";
  if (surface === "tag") return "tag_card";
  return "projects_card";
}

export function ProjectCard({ project, viewer, saved = false, featured = false, surface = "projects" }: ProjectCardProps) {
  const supportNote = getSupportNote(project);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[28px] border border-line bg-[rgba(255,253,248,0.96)] shadow-soft",
        featured ? "grid gap-0 lg:grid-cols-[1.1fr_0.9fr]" : "flex h-full flex-col"
      )}
    >
      <ProjectEventBeacon projectId={project.id} kind="project_card_impression" source={getImpressionSource(surface)} />
      <div className={cn("overflow-hidden bg-surface-muted", featured ? "h-full" : "aspect-[16/10]")}>
        <img src={project.coverImageUrl} alt={`${project.title} 대표 이미지`} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              {categoryLabels[project.category] ?? project.category} · {platformLabels[project.platform as keyof typeof platformLabels] ?? project.platform}
            </p>
            <div className="space-y-2">
              <h3 className={cn("font-extrabold tracking-tight text-foreground", featured ? "text-3xl" : "text-2xl")}>{project.title}</h3>
              <p className="line-clamp-2 text-sm leading-6 text-foreground-muted">{project.tagline}</p>
            </div>
          </div>
          <StatusBadge label={stageLabels[project.stage as keyof typeof stageLabels] ?? project.stage} tone={getTone(project)} />
        </div>

        <div className="flex flex-wrap gap-2">
          {project.badges.slice(0, 2).map((badge) => (
            <span key={badge} className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground-muted">
              {badge}
            </span>
          ))}
          {project.latestActivityType ? <StatusBadge label={projectPostLabels[project.latestActivityType]} tone="info" /> : null}
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground-muted">
            <span>{project.makerAlias}</span>
            <span>최근 활동 {formatRelative(project.latestActivityAt)}</span>
            <span className="inline-flex items-center gap-1">
              <MessageSquareText className="size-4" />
              {project.metrics.comments}
            </span>
            <span className="inline-flex items-center gap-1">
              <BookMarked className="size-4" />
              {project.metrics.saves}
            </span>
          </div>

          {supportNote ? (
            <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground-muted">{supportNote}</div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <OutboundLink
              projectId={project.id}
              source={getTrySource(surface)}
              href={project.liveUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Try
              <ArrowUpRight className="size-4" />
            </OutboundLink>
            <Link href={`/p/${project.slug}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
              상세 보기
            </Link>
            {viewer ? (
              <form action={`/api/projects/${project.id}/save`} method="post">
                <input type="hidden" name="redirectTo" value={`/p/${project.slug}`} />
                <button className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
                  {saved ? "저장됨" : "저장"}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
