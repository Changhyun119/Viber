import type { MetadataRoute } from "next";

import { getAdminProjectsData } from "@/lib/services/read-models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000";
  const projects = await getAdminProjectsData();

  return [
    "",
    "/projects",
    "/submit",
    "/policy/content",
    "/policy/privacy"
  ]
    .map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date()
    }))
    .concat(
      projects
        .filter((project) => ["published", "limited", "archived"].includes(project.status))
        .map((project) => ({
          url: `${baseUrl}/p/${project.slug}`,
          lastModified: project.latestActivityAt
        }))
    );
}
