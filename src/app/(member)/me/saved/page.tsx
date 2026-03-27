import Link from "next/link";

import { ProjectGrid } from "@/components/projects/project-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireCurrentProfile } from "@/lib/auth/session";
import { getSavedProjects, getViewerState } from "@/lib/services/read-models";

export default async function SavedProjectsPage() {
  const viewer = await requireCurrentProfile("/me/saved");
  const viewerState = await getViewerState(viewer.id);
  const items = await getSavedProjects(viewer.id);

  return (
    <PageShell>
      <SectionHeading eyebrow="저장" title="저장한 프로젝트" description="다시 확인하고 싶은 프로젝트를 모아두는 개인 북마크 공간입니다." />
      {items.length ? (
        <ProjectGrid items={items} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} surface="projects" />
      ) : (
        <EmptyState
          title="저장한 프로젝트가 없습니다."
          description="탐색 페이지나 상세 페이지에서 저장 버튼을 누르면 여기에 모입니다."
          action={
            <Link href="/projects" className="mx-auto rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white">
              프로젝트 둘러보기
            </Link>
          }
        />
      )}
    </PageShell>
  );
}
