import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { tags } from "@/db/schema";

export async function GET() {
  const items = await db.query.tags.findMany({
    orderBy: [asc(tags.name)]
  });

  return NextResponse.json(items);
}
