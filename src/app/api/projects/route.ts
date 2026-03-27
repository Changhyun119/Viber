import { NextResponse } from "next/server";

import { getExploreData } from "@/lib/services/read-models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "9");
  const sort = searchParams.get("sort") as "trending" | "latest" | "updated" | "comments" | null;

  const data = await getExploreData({
    query: searchParams.get("query") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    platform: searchParams.get("platform") ?? undefined,
    stage: searchParams.get("stage") ?? undefined,
    pricing: searchParams.get("pricing") ?? undefined,
    activity: searchParams.get("activity") ?? undefined,
    openSource: searchParams.get("openSource") === "true",
    noSignup: searchParams.get("noSignup") === "true",
    soloMaker: searchParams.get("soloMaker") === "true",
    sort: sort ?? "trending",
    page,
    pageSize
  });

  return NextResponse.json(data);
}
