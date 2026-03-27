import { NextResponse } from "next/server";

import { requireAdminProfile } from "@/lib/auth/session";
import { getModerationQueue } from "@/lib/services/read-models";

export async function GET() {
  await requireAdminProfile("/admin/moderation");
  const queue = await getModerationQueue();
  return NextResponse.json(queue);
}
