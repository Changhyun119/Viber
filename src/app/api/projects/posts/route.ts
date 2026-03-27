import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireCurrentProfile } from "@/lib/auth/session";
import { buildRedirectPath, parseRequiredString } from "@/lib/http";
import { submitProjectPost } from "@/lib/services/mutations";
import { postSubmissionSchema } from "@/lib/validations/forms";

export async function POST(request: Request) {
  const viewer = await requireCurrentProfile();
  const formData = await request.formData();

  try {
    const parsed = postSubmissionSchema.parse({
      kind: parseRequiredString(formData.get("kind")),
      projectId: parseRequiredString(formData.get("projectId")),
      title: parseRequiredString(formData.get("title")),
      summary: parseRequiredString(formData.get("summary")),
      bodyMd: parseRequiredString(formData.get("bodyMd")),
      requestedFeedbackMd: parseRequiredString(formData.get("requestedFeedbackMd")),
      mediaCsv: parseRequiredString(formData.get("mediaCsv"))
    });

    const result = await submitProjectPost({
      ...parsed,
      user: viewer
    });

    revalidatePath(`/p/${result.slug}`);
    revalidatePath("/me/projects");

    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/me/projects", {
          notice: result.status === "published" ? "활동을 바로 공개했습니다." : "활동을 등록했고 공개 전 상태로 저장했습니다."
        }),
        request.url
      )
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/me/projects", {
          error: error instanceof Error ? error.message : "활동 추가에 실패했습니다."
        }),
        request.url
      )
    );
  }
}
