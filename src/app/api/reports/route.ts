import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/session";
import { getVisitorSessionHash } from "@/lib/auth/visitor";
import { buildRedirectPath, parseOptionalString, parseRequiredString } from "@/lib/http";
import { createReport } from "@/lib/services/mutations";
import { reportActionSchema } from "@/lib/validations/forms";

export async function POST(request: Request) {
  const viewer = await getCurrentProfile();
  const formData = await request.formData();

  try {
    const parsed = reportActionSchema.parse({
      targetType: parseRequiredString(formData.get("targetType")),
      targetId: parseRequiredString(formData.get("targetId")),
      reason: parseRequiredString(formData.get("reason")),
      note: parseOptionalString(formData.get("note")) ?? "",
      redirectTo: parseRequiredString(formData.get("redirectTo"))
    });
    const rateLimitIdentifier = await getVisitorSessionHash(viewer?.id);
    await createReport({
      reporterUserId: viewer?.id,
      targetType: parsed.targetType,
      targetId: parsed.targetId,
      reason: parsed.reason,
      note: parsed.note || null,
      rateLimitIdentifier
    });

    revalidatePath(parsed.redirectTo);

    return NextResponse.redirect(new URL(buildRedirectPath(parsed.redirectTo, { notice: "신고가 접수되었습니다." }), request.url), { status: 303 });
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        buildRedirectPath("/", {
          error: error instanceof Error ? error.message : "신고 접수에 실패했습니다."
        }),
        request.url
      ),
      { status: 303 }
    );
  }
}
