import { NextResponse } from "next/server";

import { getProjectDetailBySlug } from "@/lib/services/read-models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = await getProjectDetailBySlug(id);

  if (!project) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    project: {
      id: project.id,
      slug: project.slug,
      title: project.title
    },
    posts: project.posts
  });
}
