import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireAdminProfile } from "@/lib/auth/session";
import { projectStatusLabels } from "@/lib/constants";
import { getModerationQueue } from "@/lib/services/read-models";
import { formatRelative } from "@/lib/utils/date";

function getActionLabel(action: string) {
  if (action === "publish") return "공개";
  if (action === "limit") return "제한";
  if (action === "reject") return "반려";
  if (action === "hide") return "숨김";
  if (action === "reviewing") return "검토 중";
  if (action === "resolved") return "해결";
  if (action === "rejected") return "기각";
  return action;
}

function ModerationForm({
  targetType,
  targetId,
  action,
  redirectTo
}: {
  targetType: "project" | "post" | "report";
  targetId: string;
  action: string;
  redirectTo: string;
}) {
  return (
    <form action="/api/admin/moderation/action" method="post">
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">{getActionLabel(action)}</button>
    </form>
  );
}

export default async function AdminModerationPage() {
  await requireAdminProfile();
  const queue = await getModerationQueue();

  return (
    <PageShell>
      <SectionHeading eyebrow="운영" title="운영 큐" description="보류 중인 프로젝트와 활동, 열린 신고를 한 곳에서 보고 바로 조치할 수 있게 정리했습니다." />

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">소유권 연결 대기</h2>
        <div className="grid gap-4">
          {queue.claimPendingProjects.length ? (
            queue.claimPendingProjects.map((project) => (
              <article key={project.id} className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge label="claim 대기" tone="warning" />
                      <StatusBadge label={project.verificationState} tone="default" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">{project.title}</h3>
                    <p className="text-sm leading-7 text-foreground-muted">{project.shortDescription}</p>
                    <p className="text-sm text-foreground-muted">운영 사전 승인 항목이 아니라 owner 연결 완료 후 즉시 공개될 제출입니다.</p>
                  </div>
                  <div className="text-sm text-foreground-muted">{formatRelative(project.latestActivityAt)}</div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-line bg-white/80 px-5 py-8 text-sm text-foreground-muted">
              현재 소유권 연결 대기 항목이 없습니다.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">보류 중인 프로젝트</h2>
        <div className="grid gap-4">
          {queue.pendingProjects.length ? (
            queue.pendingProjects.map((project) => (
              <article key={project.id} className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge label="공개 전" tone="warning" />
                      <StatusBadge label={project.verificationState} tone="default" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">{project.title}</h3>
                    <p className="text-sm leading-7 text-foreground-muted">{project.shortDescription}</p>
                  </div>
                  <div className="text-sm text-foreground-muted">{formatRelative(project.latestActivityAt)}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ModerationForm targetType="project" targetId={project.id} action="publish" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="project" targetId={project.id} action="limit" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="project" targetId={project.id} action="reject" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="project" targetId={project.id} action="hide" redirectTo="/admin/moderation" />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-line bg-white/80 px-5 py-8 text-sm text-foreground-muted">현재 보류 중인 프로젝트가 없습니다.</div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">링크 상태 경고</h2>
        <div className="grid gap-4">
          {queue.linkIssueProjects.length ? (
            queue.linkIssueProjects.map((project) => (
              <article key={project.id} className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        label={project.linkHealth?.label ?? "링크 경고"}
                        tone={project.linkHealth?.status === "broken" ? "danger" : "warning"}
                      />
                      <StatusBadge label={projectStatusLabels[project.status]} tone="default" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">{project.title}</h3>
                    <p className="text-sm leading-7 text-foreground-muted">{project.shortDescription}</p>
                    {project.linkHealth?.note ? <p className="text-sm text-foreground-muted">{project.linkHealth.note}</p> : null}
                  </div>
                  <div className="text-sm text-foreground-muted">{formatRelative(project.latestActivityAt)}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ModerationForm targetType="project" targetId={project.id} action="limit" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="project" targetId={project.id} action="archive" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="project" targetId={project.id} action="hide" redirectTo="/admin/moderation" />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-line bg-white/80 px-5 py-8 text-sm text-foreground-muted">
              현재 링크 상태 경고 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">보류 중인 활동</h2>
        <div className="grid gap-4">
          {queue.pendingPosts.length ? (
            queue.pendingPosts.map((post) => (
              <article key={post.id} className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={post.type} tone="info" />
                    <StatusBadge label="공개 전" tone="warning" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">{post.title}</h3>
                  <p className="text-sm leading-7 text-foreground-muted">{post.summary}</p>
                  <div className="text-sm text-foreground-muted">대상 프로젝트: {post.project.title}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ModerationForm targetType="post" targetId={post.id} action="publish" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="post" targetId={post.id} action="hide" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="post" targetId={post.id} action="reject" redirectTo="/admin/moderation" />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-line bg-white/80 px-5 py-8 text-sm text-foreground-muted">현재 보류 중인 활동이 없습니다.</div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">열린 신고</h2>
        <div className="grid gap-4">
          {queue.openReports.length ? (
            queue.openReports.map((report) => (
              <article key={report.id} className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={report.targetType} tone="default" />
                    <StatusBadge label={report.reason} tone="warning" />
                  </div>
                  <p className="text-sm leading-7 text-foreground-muted">{report.note ?? "추가 메모 없음"}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ModerationForm targetType="report" targetId={report.id} action="reviewing" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="report" targetId={report.id} action="resolved" redirectTo="/admin/moderation" />
                  <ModerationForm targetType="report" targetId={report.id} action="rejected" redirectTo="/admin/moderation" />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-line bg-white/80 px-5 py-8 text-sm text-foreground-muted">열린 신고가 없습니다.</div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
