import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

import { OutboundLink } from "@/components/analytics/outbound-link";
import type { RankingClickSource } from "@/lib/utils/ranking";
import { categoryLabels, platformLabels, stageLabels } from "@/lib/constants";
import type { SerializedProjectCard } from "./types";

export function formatRelativeFromString(isoDate: string) {
  return formatDistanceToNowStrict(new Date(isoDate), { addSuffix: true, locale: ko });
}

export function getCategoryLabel(category: string) {
  return categoryLabels[category] ?? category;
}

export function getPlatformLabel(platform: string) {
  return platformLabels[platform as keyof typeof platformLabels] ?? platform;
}

export function getStageLabel(stage: string) {
  return stageLabels[stage as keyof typeof stageLabels] ?? stage;
}

export function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold text-foreground-muted">
      {children}
    </span>
  );
}

export function TryButton({
  project,
  source,
  size = "default",
}: {
  project: SerializedProjectCard;
  source: RankingClickSource;
  size?: "default" | "sm";
}) {
  return (
    <OutboundLink
      projectId={project.id}
      source={source}
      href={project.liveUrl}
      className={`inline-flex items-center gap-1.5 rounded-full bg-foreground text-background font-bold transition hover:-translate-y-0.5 ${
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      Try
      <ArrowUpRight className={size === "sm" ? "size-3" : "size-4"} />
    </OutboundLink>
  );
}

export function DetailLink({ slug, label = "상세 보기" }: { slug: string; label?: string }) {
  return (
    <Link
      href={`/p/${slug}`}
      className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
    >
      {label}
    </Link>
  );
}

export function CTASection() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[36px] border border-line bg-surface shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(215,101,66,0.12),transparent_60%)]" />
        <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            당신의 프로젝트, 무료로 등록하세요
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-foreground-muted">
            복잡한 절차 없이 바로 등록. 커뮤니티의 피드백으로 프로젝트를 성장시키세요.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5"
            >
              지금 등록하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
            >
              먼저 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
