import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireAdminProfile } from "@/lib/auth/session";
import { getAdminProjectsData } from "@/lib/services/read-models";

export default async function AdminFeaturePage() {
  await requireAdminProfile("/admin/feature");
  const projects = await getAdminProjectsData();
  const publishedProjects = projects.filter((project) => project.status === "published");

  return (
    <PageShell>
      <SectionHeading eyebrow="피처드" title="피처드 편성" description="공개 중인 프로젝트만 홈 추천으로 올리고, 순서를 함께 조정합니다." />

      <div className="grid gap-4">
        {publishedProjects.map((project) => (
          <article key={project.id} className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge label="공개 중" tone="success" />
                  {project.featured ? <StatusBadge label={`현재 피처드 #${project.featuredOrder ?? 1}`} tone="info" /> : null}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">{project.title}</h2>
                <p className="text-sm leading-7 text-foreground-muted">{project.shortDescription}</p>
              </div>
            </div>
            <form action="/api/admin/moderation/action" method="post" className="mt-4 flex flex-wrap items-center gap-3">
              <input type="hidden" name="targetType" value="project" />
              <input type="hidden" name="targetId" value={project.id} />
              <input type="hidden" name="redirectTo" value="/admin/feature" />
              <input type="hidden" name="action" value={project.featured ? "unfeature" : "feature"} />
              <input
                type="number"
                name="featuredOrder"
                min={1}
                max={12}
                defaultValue={project.featuredOrder ?? 1}
                className="w-28 rounded-2xl border border-line bg-white px-4 py-2 text-sm text-foreground"
              />
              <button className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
                {project.featured ? "피처드 해제" : "피처드 지정"}
              </button>
            </form>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
