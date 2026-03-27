import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { buildSignInPath, getCurrentProfile } from "@/lib/auth/session";
import { getVisitorSessionHash } from "@/lib/auth/visitor";
import { buildRedirectPath, parseOptionalString, parseRequiredString } from "@/lib/http";
import { createComment } from "@/lib/services/mutations";
import { commentActionSchema } from "@/lib/validations/forms";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const formData = await request.formData();

  try {
    const parsed = commentActionSchema.parse({
      bodyMd: parseRequiredString(formData.get("bodyMd")),
      postId: parseOptionalString(formData.get("postId")) ?? "",
      parentId: parseOptionalString(formData.get("parentId")) ?? "",
      redirectTo: parseRequiredString(formData.get("redirectTo"))
    });
    const viewer = await getCurrentProfile();

    if (!viewer) {
      return NextResponse.redirect(new URL(buildSignInPath(parsed.redirectTo), request.url), { status: 303 });
    }

    const rateLimitIdentifier = await getVisitorSessionHash(viewer.id);
    const result = await createComment({
      projectId: id,
      user: viewer,
      bodyMd: parsed.bodyMd,
      postId: parsed.postId || null,
      parentId: parsed.parentId || null,
      rateLimitIdentifier
    });

    revalidatePath(`/p/${result.slug}`);

    return NextResponse.redirect(new URL(buildRedirectPath(parsed.redirectTo, { notice: "댓글을 등록했습니다." }), request.url), { status: 303 });
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/projects", {
          error: error instanceof Error ? error.message : "댓글 등록에 실패했습니다."
        }),
        request.url
      ),
      { status: 303 }
    );
  }
}
