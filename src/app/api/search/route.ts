import { NextResponse } from "next/server";

import { getExploreData } from "@/lib/services/read-models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const data = await getExploreData({
    query,
    sort: "trending",
    page: 1,
    pageSize: 12
  });

  return NextResponse.json({
    query,
    total: data.total,
    items: data.items
  });
}
