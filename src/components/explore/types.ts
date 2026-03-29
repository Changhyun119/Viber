import type { SessionProfile } from "@/lib/auth/session";
import type { ProjectCardModel } from "@/lib/services/read-models";

export type ExploreVariantProps = {
  data: {
    items: ProjectCardModel[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: {
    query?: string;
    categories: string[];
    platform?: string;
    stage?: string;
    pricing?: string;
    activity?: string;
    openSource: boolean;
    noSignup: boolean;
    soloMaker: boolean;
    sort: string;
    page: number;
  };
  viewer: SessionProfile | null;
  savedProjectIds: string[];
  params: Record<string, string | string[] | undefined>;
};
