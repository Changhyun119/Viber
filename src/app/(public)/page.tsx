import { Suspense } from "react";
import { FlashBanner } from "@/components/ui/flash-banner";
import { LandingVariantSwitcher } from "@/components/landing/landing-variant-switcher";
import type { SerializedHomepageData } from "@/components/landing/types";
import { getCurrentProfile } from "@/lib/auth/session";
import { getHomepageData, getViewerState } from "@/lib/services/read-models";
import type { ProjectCardModel } from "@/lib/services/read-models";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getTextParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function serializeCards(cards: ProjectCardModel[]) {
  return cards.map((c) => ({
    ...c,
    latestActivityAt: c.latestActivityAt.toISOString(),
    publishedAt: c.publishedAt?.toISOString() ?? null,
  }));
}

function serializeHomepageData(data: Awaited<ReturnType<typeof getHomepageData>>): SerializedHomepageData {
  return {
    featured: serializeCards(data.featured),
    launches: serializeCards(data.launches),
    feedback: serializeCards(data.feedback),
    updates: serializeCards(data.updates),
    tags: data.tags,
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const viewer = await getCurrentProfile();
  const viewerState = await getViewerState(viewer?.id);
  const data = await getHomepageData();

  return (
    <div className="landing-fullpage">
      <FlashBanner notice={getTextParam(params.notice)} error={getTextParam(params.error)} />
      <Suspense>
        <LandingVariantSwitcher
          data={serializeHomepageData(data)}
          viewer={viewer}
          savedProjectIds={viewerState.savedProjectIds}
        />
      </Suspense>
    </div>
  );
}
