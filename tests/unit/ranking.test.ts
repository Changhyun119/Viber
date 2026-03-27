import { describe, expect, test, vi } from "vitest";

import { calculateTrendingScoreV1, sortByTrendingScore } from "@/lib/utils/ranking";

describe("ranking v1", () => {
  test("저장과 댓글에 클릭보다 더 큰 가중치를 준다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-26T12:00:00.000Z"));

    const result = calculateTrendingScoreV1({
      uniqueTryClicks7d: 10,
      newSaves30d: 2,
      commentSignal30d: 1,
      lastActivityAt: new Date("2026-03-25T12:00:00.000Z")
    });

    expect(result.baseScore).toBe(23);
    expect(result.freshnessMultiplierBasisPoints).toBe(115);
    expect(result.qualityMultiplierBasisPoints).toBe(100);
    expect(result.finalScore).toBe(2645);

    vi.useRealTimers();
  });

  test("반응 없는 클릭만 많은 프로젝트는 quality penalty를 받는다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-26T12:00:00.000Z"));

    const result = calculateTrendingScoreV1({
      uniqueTryClicks7d: 24,
      newSaves30d: 0,
      commentSignal30d: 0,
      lastActivityAt: new Date("2026-03-18T12:00:00.000Z")
    });

    expect(result.freshnessMultiplierBasisPoints).toBe(85);
    expect(result.qualityMultiplierBasisPoints).toBe(60);
    expect(result.finalScore).toBe(1224);

    vi.useRealTimers();
  });

  test("동점이면 최근 활동과 공개일 순으로 정렬한다", () => {
    const items = sortByTrendingScore([
      {
        score: 100,
        lastActivityAt: new Date("2026-03-20T10:00:00.000Z"),
        publishedAt: new Date("2026-03-10T10:00:00.000Z"),
        id: "older-activity"
      },
      {
        score: 100,
        lastActivityAt: new Date("2026-03-21T10:00:00.000Z"),
        publishedAt: new Date("2026-03-09T10:00:00.000Z"),
        id: "recent-activity"
      },
      {
        score: 100,
        lastActivityAt: new Date("2026-03-21T10:00:00.000Z"),
        publishedAt: new Date("2026-03-11T10:00:00.000Z"),
        id: "recent-published"
      }
    ]);

    expect(items.map((item) => item.id)).toEqual(["recent-published", "recent-activity", "older-activity"]);
  });
});
