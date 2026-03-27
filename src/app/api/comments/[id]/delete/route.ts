import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireCurrentProfile } from "@/lib/auth/session";
import { buildRedirectPath, parseRequiredString } from "@/lib/http";
import { softDeleteComment } from "@/lib/services/mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const viewer = await requireCurrentProfile();
  const { id } = await context.params;
  const formData = await request.formData();

  try {
    const result = await softDeleteComment({
      commentId: id,
      user: viewer
    });
    revalidatePath(`/p/${result.slug}`);

    return NextResponse.redirect(
      new URL(
        buildRedirectPath(parseRequiredString(formData.get("redirectTo")), {
          notice: "댓글을 삭제했습니다."
        }),
        request.url
      )
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/", {
          error: error instanceof Error ? error.message : "댓글 삭제에 실패했습니다."
        }),
        request.url
      )
    );
  }
}
