import type { SessionProfile } from "@/lib/auth/session";
import type { ProjectCardModel } from "@/lib/services/read-models";
import { ProjectCard } from "@/components/projects/project-card";

type ProjectGridProps = {
  items: ProjectCardModel[];
  viewer: SessionProfile | null;
  savedProjectIds?: string[];
  featured?: boolean;
  surface?: "home" | "projects" | "tag";
};

export function ProjectGrid({ items, viewer, savedProjectIds = [], featured = false, surface = "projects" }: ProjectGridProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={featured ? "grid gap-6" : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"}>
      {items.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          viewer={viewer}
          saved={savedProjectIds.includes(project.id)}
          featured={featured && index === 0}
          surface={surface}
        />
      ))}
    </div>
  );
}
