import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { buildSignInPath, getCurrentProfile } from "@/lib/auth/session";
import { getVisitorSessionHash } from "@/lib/auth/visitor";
import { buildRedirectPath, parseRequiredString } from "@/lib/http";
import { createComment } from "@/lib/services/mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const formData = await request.formData();
  const projectId = parseRequiredString(formData.get("projectId"));
  const redirectTo = parseRequiredString(formData.get("redirectTo"));

  try {
    const viewer = await getCurrentProfile();

    if (!viewer) {
      return NextResponse.redirect(new URL(buildSignInPath(redirectTo), request.url), { status: 303 });
    }

    const rateLimitIdentifier = await getVisitorSessionHash(viewer.id);
    const result = await createComment({
      projectId,
      user: viewer,
      bodyMd: parseRequiredString(formData.get("bodyMd")),
      parentId: id,
      rateLimitIdentifier
    });

    revalidatePath(`/p/${result.slug}`);

    return NextResponse.redirect(
      new URL(
        buildRedirectPath(redirectTo, {
          notice: "답글을 등록했습니다."
        }),
        request.url
      ),
      { status: 303 }
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/projects", {
          error: error instanceof Error ? error.message : "답글 등록에 실패했습니다."
        }),
        request.url
      ),
      { status: 303 }
    );
  }
}
