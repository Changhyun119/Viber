import type { SessionProfile } from "@/lib/auth/session";
import type { ProjectCommentModel } from "@/lib/services/read-models";
import { formatRelative } from "@/lib/utils/date";
import { ProseBlock } from "@/components/ui/prose-block";

type CommentThreadProps = {
  comments: ProjectCommentModel[];
  viewer: SessionProfile | null;
  projectId: string;
  projectSlug: string;
};

function CommentItem({
  comment,
  replies,
  viewer,
  projectSlug,
  projectId
}: {
  comment: ProjectCommentModel;
  replies: ProjectCommentModel[];
  viewer: SessionProfile | null;
  projectSlug: string;
  projectId: string;
}) {
  const canEdit = viewer && viewer.id === comment.author.id && comment.status === "active";

  return (
    <article className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-semibold text-foreground">{comment.author.displayName}</div>
          <div className="text-sm text-foreground-muted">{formatRelative(comment.createdAt)}</div>
        </div>
        {comment.postId ? <a href={`#post-${comment.postId}`} className="text-sm font-semibold text-foreground-muted">연결된 활동 보기</a> : null}
      </div>

      <div className="mt-4">
        {comment.status === "deleted" ? (
          <p className="text-sm font-medium text-foreground-muted">삭제된 댓글입니다.</p>
        ) : (
          <ProseBlock value={comment.bodyMd} muted />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {viewer ? (
          <details className="rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm text-foreground">
            <summary className="cursor-pointer font-semibold">답글 남기기</summary>
            <form action={`/api/comments/${comment.id}/replies`} method="post" className="mt-3 grid gap-2">
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="redirectTo" value={`/p/${projectSlug}#comments`} />
              <textarea
                name="bodyMd"
                rows={3}
                required
                placeholder="짧고 구체적인 피드백이 가장 도움이 됩니다."
                className="rounded-2xl border border-line bg-white px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted"
              />
              <button className="rounded-full bg-[#111827] px-4 py-2 font-semibold text-white">답글 등록</button>
            </form>
          </details>
        ) : null}

        <details className="rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm text-foreground">
          <summary className="cursor-pointer font-semibold">신고</summary>
          <form action="/api/reports" method="post" className="mt-3 grid gap-2">
            <input type="hidden" name="targetType" value="comment" />
            <input type="hidden" name="targetId" value={comment.id} />
            <input type="hidden" name="redirectTo" value={`/p/${projectSlug}#comments`} />
            <select name="reason" className="rounded-2xl border border-line bg-white px-3 py-2">
              <option value="spam">스팸</option>
              <option value="harassment">부적절한 내용</option>
              <option value="misleading">허위 또는 오해 소지</option>
            </select>
            <textarea name="note" rows={3} className="rounded-2xl border border-line bg-white px-3 py-2" placeholder="운영자가 참고할 내용을 남길 수 있습니다." />
            <button className="rounded-full border border-line bg-white px-4 py-2 font-semibold text-foreground">신고 접수</button>
          </form>
        </details>

        {canEdit ? (
          <details className="rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm text-foreground">
            <summary className="cursor-pointer font-semibold">수정</summary>
            <form action={`/api/comments/${comment.id}/edit`} method="post" className="mt-3 grid gap-2">
              <input type="hidden" name="redirectTo" value={`/p/${projectSlug}#comments`} />
              <textarea name="bodyMd" rows={3} defaultValue={comment.bodyMd} className="rounded-2xl border border-line bg-white px-3 py-2" />
              <button className="rounded-full bg-[#111827] px-4 py-2 font-semibold text-white">수정 저장</button>
            </form>
          </details>
        ) : null}

        {canEdit ? (
          <form action={`/api/comments/${comment.id}/delete`} method="post">
            <input type="hidden" name="redirectTo" value={`/p/${projectSlug}#comments`} />
            <button className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">삭제</button>
          </form>
        ) : null}
      </div>

      {replies.length ? (
        <div className="mt-4 space-y-3 border-l border-line pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="rounded-2xl bg-surface-muted px-4 py-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="font-semibold text-foreground">{reply.author.displayName}</div>
                <div className="text-xs text-foreground-muted">{formatRelative(reply.createdAt)}</div>
              </div>
              {reply.status === "deleted" ? <p className="text-sm text-foreground-muted">삭제된 댓글입니다.</p> : <ProseBlock value={reply.bodyMd} muted />}
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function CommentThread({ comments, viewer, projectId, projectSlug }: CommentThreadProps) {
  const rootComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="space-y-4">
      {viewer ? (
        <form action={`/api/projects/${projectId}/comments`} method="post" className="rounded-[28px] border border-line bg-white/90 p-5 shadow-soft">
          <input type="hidden" name="redirectTo" value={`/p/${projectSlug}#comments`} />
          <div className="mb-3 text-lg font-bold tracking-tight text-foreground">댓글 남기기</div>
          <div className="grid gap-3">
            <textarea
              name="bodyMd"
              rows={4}
              required
              placeholder="실제로 써본 느낌, 개선 아이디어, 막힌 지점을 남겨 주세요."
              className="rounded-3xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted"
            />
            <button className="w-fit rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white">댓글 등록</button>
          </div>
        </form>
      ) : (
        <div className="rounded-[28px] border border-dashed border-line bg-white/80 px-5 py-5 text-sm text-foreground-muted">
          댓글과 저장 기능은 로그인 후 사용할 수 있습니다.
        </div>
      )}

      {rootComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replies={comments.filter((reply) => reply.parentId === comment.id)}
          viewer={viewer}
          projectSlug={projectSlug}
          projectId={projectId}
        />
      ))}
    </div>
  );
}
