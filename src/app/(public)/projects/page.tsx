import { FlashBanner } from "@/components/ui/flash-banner";
import { SectionHeading } from "@/components/ui/section-heading";
import { ExploreVariantSwitcher } from "@/components/explore/explore-variant-switcher";
import { getCurrentProfile } from "@/lib/auth/session";
import { getExploreData, getViewerState } from "@/lib/services/read-models";

type ProjectsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getValues(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getBoolean(value: string | string[] | undefined) {
  const v = getValue(value);
  return v === "true" || v === "on" || v === "1";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const viewer = await getCurrentProfile();
  const viewerState = await getViewerState(viewer?.id);

  const categories = getValues(params.categories);
  const filters = {
    query: getValue(params.query),
    categories,
    platform: getValue(params.platform),
    stage: getValue(params.stage),
    pricing: getValue(params.pricing),
    activity: getValue(params.activity),
    openSource: getBoolean(params.openSource),
    noSignup: getBoolean(params.noSignup),
    soloMaker: getBoolean(params.soloMaker),
    sort: (getValue(params.sort) as "trending" | "latest" | "updated" | "comments" | undefined) ?? "trending",
    page: Number(getValue(params.page) ?? "1"),
  };

  const data = await getExploreData(filters);

  return (
    <div>
      <FlashBanner notice={getValue(params.notice)} error={getValue(params.error)} />

      <div className="mx-auto max-w-[1180px] px-4 pt-8 sm:px-6">
        <SectionHeading
          eyebrow="탐색"
          title="프로젝트 탐색"
          description="모든 프로젝트를 한눈에 탐색하세요."
        />
      </div>

      <ExploreVariantSwitcher
        data={data}
        filters={filters}
        viewer={viewer}
        savedProjectIds={viewerState.savedProjectIds}
        params={params}
      />
    </div>
  );
}
