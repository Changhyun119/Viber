import { NextResponse } from "next/server";

import { getVisitorSessionHash } from "@/lib/auth/visitor";
import { getCurrentProfile } from "@/lib/auth/session";
import { recordProjectAnalysisEvent } from "@/lib/services/mutations";
import { projectEventSchema } from "@/lib/validations/forms";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const viewer = await getCurrentProfile();
  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = projectEventSchema.parse(body);
    const sessionHash = await getVisitorSessionHash(viewer?.id);

    await recordProjectAnalysisEvent({
      projectId: id,
      kind: parsed.kind,
      source: parsed.source,
      sessionHash
    });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "이벤트 기록에 실패했습니다."
      },
      { status: 400 }
    );
  }
}
