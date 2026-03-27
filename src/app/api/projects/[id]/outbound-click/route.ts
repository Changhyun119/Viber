import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/session";
import { getVisitorSessionHash } from "@/lib/auth/visitor";
import { recordProjectClick } from "@/lib/services/mutations";
import { outboundClickSchema } from "@/lib/validations/forms";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const viewer = await getCurrentProfile();
  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = outboundClickSchema.parse(body);
    const sessionHash = await getVisitorSessionHash(viewer?.id);

    await recordProjectClick({
      projectId: id,
      source: parsed.source,
      sessionHash,
      userId: viewer?.id
    });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "outbound click 기록에 실패했습니다."
      },
      { status: 400 }
    );
  }
}
