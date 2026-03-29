import type { SessionProfile } from "@/lib/auth/session";
import type { ProjectPostType, ProjectStatus, VerificationState } from "@/db/schema";

export type SerializedProjectCard = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  liveUrl: string;
  makerAlias: string;
  category: string;
  platform: string;
  stage: string;
  status: ProjectStatus;
  verificationState: VerificationState;
  coverImageUrl: string;
  gallery: string[];
  badges: string[];
  tags: { slug: string; name: string }[];
  latestActivityType: ProjectPostType | null;
  latestActivityTitle: string | null;
  latestActivityAt: string;
  publishedAt: string | null;
  metrics: {
    saves: number;
    comments: number;
    uniqueClicks: number;
    score: number;
  };
  featured: boolean;
  featuredOrder: number | null;
  linkHealth: {
    status: string;
    label: string;
    note: string | null;
  } | null;
};

export type SerializedHomepageData = {
  featured: SerializedProjectCard[];
  launches: SerializedProjectCard[];
  feedback: SerializedProjectCard[];
  updates: SerializedProjectCard[];
  tags: { slug: string; name: string }[];
};

export type LandingVariantProps = {
  data: SerializedHomepageData;
  viewer: SessionProfile | null;
  savedProjectIds: string[];
};
