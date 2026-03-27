export const rankingClickSources = [
  "home_try",
  "projects_try",
  "tag_try",
  "detail_try",
  "detail_demo",
  "detail_docs",
  "detail_github",
  "activity_try"
] as const;

export const analysisEventKinds = ["project_card_impression", "project_detail_view"] as const;

export type RankingClickSource = (typeof rankingClickSources)[number];
export type AnalysisEventKind = (typeof analysisEventKinds)[number];

export type RankingV1Input = {
  uniqueTryClicks7d: number;
  newSaves30d: number;
  commentSignal30d: number;
  lastActivityAt: Date | string;
};

export type RankingV1Breakdown = {
  baseScore: number;
  finalScore: number;
  freshnessMultiplier: number;
  freshnessMultiplierBasisPoints: number;
  qualityMultiplier: number;
  qualityMultiplierBasisPoints: number;
};

function getFreshnessMultiplier(daysSinceActivity: number) {
  if (daysSinceActivity <= 3) {
    return 1.15;
  }

  if (daysSinceActivity <= 7) {
    return 1.0;
  }

  if (daysSinceActivity <= 14) {
    return 0.85;
  }

  if (daysSinceActivity <= 30) {
    return 0.7;
  }

  return 0.55;
}

function getQualityMultiplier(input: RankingV1Input) {
  if (input.uniqueTryClicks7d >= 20 && input.newSaves30d + input.commentSignal30d === 0) {
    return 0.6;
  }

  return 1.0;
}

export function calculateTrendingScoreV1(input: RankingV1Input): RankingV1Breakdown {
  const lastActivityMs = new Date(input.lastActivityAt).getTime();
  const daysSinceActivity = Math.max(0, (Date.now() - lastActivityMs) / (1000 * 60 * 60 * 24));
  const freshnessMultiplier = getFreshnessMultiplier(daysSinceActivity);
  const qualityMultiplier = getQualityMultiplier(input);
  const baseScore = input.uniqueTryClicks7d + input.newSaves30d * 4 + input.commentSignal30d * 5;
  const finalScore = Math.round(baseScore * freshnessMultiplier * qualityMultiplier * 100);

  return {
    baseScore,
    finalScore,
    freshnessMultiplier,
    freshnessMultiplierBasisPoints: Math.round(freshnessMultiplier * 100),
    qualityMultiplier,
    qualityMultiplierBasisPoints: Math.round(qualityMultiplier * 100)
  };
}

export function sortByTrendingScore<T extends { score: number; lastActivityAt: Date; publishedAt: Date | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    const activityDelta = right.lastActivityAt.getTime() - left.lastActivityAt.getTime();
    if (activityDelta !== 0) {
      return activityDelta;
    }

    return (right.publishedAt?.getTime() ?? 0) - (left.publishedAt?.getTime() ?? 0);
  });
}
