import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireCurrentProfile } from "@/lib/auth/session";
import { buildRedirectPath, parseRequiredString } from "@/lib/http";
import { toggleSaveProject } from "@/lib/services/mutations";
import { saveActionSchema } from "@/lib/validations/forms";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const viewer = await requireCurrentProfile();
  const { id } = await context.params;
  const formData = await request.formData();

  try {
    const parsed = saveActionSchema.parse({
      redirectTo: parseRequiredString(formData.get("redirectTo"))
    });
    const result = await toggleSaveProject(id, viewer.id);
    revalidatePath(parsed.redirectTo);
    revalidatePath("/me/saved");

    return NextResponse.redirect(
      new URL(
        buildRedirectPath(parsed.redirectTo, {
          notice: result.saved ? "저장 목록에 추가했습니다." : "저장 목록에서 제거했습니다."
        }),
        request.url
      )
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/projects", {
          error: error instanceof Error ? error.message : "저장 처리에 실패했습니다."
        }),
        request.url
      )
    );
  }
}
