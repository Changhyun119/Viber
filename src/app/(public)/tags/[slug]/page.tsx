import { notFound } from "next/navigation";

import { ProjectGrid } from "@/components/projects/project-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentProfile } from "@/lib/auth/session";
import { getTagPageData, getViewerState } from "@/lib/services/read-models";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const viewer = await getCurrentProfile();
  const viewerState = await getViewerState(viewer?.id);
  const items = await getTagPageData(slug);

  if (!items.length) {
    notFound();
  }

  const tagName = items.find((item) => item.tags.some((tag) => tag.slug === slug))?.tags.find((tag) => tag.slug === slug)?.name ?? slug;

  return (
    <PageShell>
      <SectionHeading eyebrow="태그" title={`#${tagName}`} description="같은 태그로 묶인 프로젝트를 한 번에 탐색할 수 있습니다." />
      {items.length ? (
        <ProjectGrid items={items} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} surface="tag" />
      ) : (
        <EmptyState title="아직 프로젝트가 없습니다." description="이 태그로 공개된 프로젝트가 생기면 여기에 표시됩니다." />
      )}
    </PageShell>
  );
}
