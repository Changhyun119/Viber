"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { LandingVariantProps } from "./types";
import { VariantClassic } from "./variant-classic";
import { VariantFeature } from "./variant-feature";
import { VariantMinimal } from "./variant-minimal";
import { FeatureProducts } from "./variant-feature/products";
import { FeatureTrending } from "./variant-feature/trending";
import { FeatureNew } from "./variant-feature/new";
import { FeatureFeedback } from "./variant-feature/feedback";
import { MinimalProducts } from "./variant-minimal/products";
import { MinimalTrending } from "./variant-minimal/trending";
import { MinimalNew } from "./variant-minimal/new";
import { MinimalFeedback } from "./variant-minimal/feedback";

/* ── types ── */
const VARIANT_KEYS = ["classic", "feature", "minimal"] as const;
type VariantKey = (typeof VARIANT_KEYS)[number];
type SubPage = "home" | "products" | "trending" | "new" | "feedback";

const VARIANTS: { key: VariantKey; label: string }[] = [
  { key: "classic", label: "1. 기본" },
  { key: "feature", label: "2. 기능중심" },
  { key: "minimal", label: "3. 다크 미니멀" },
];

/* ── context ── */
type VariantNavContextType = {
  subPage: SubPage;
  navigate: (page: SubPage) => void;
};

export const VariantNavContext = createContext<VariantNavContextType>({
  subPage: "home",
  navigate: () => {},
});

export function useVariantNav() {
  return useContext(VariantNavContext);
}

/* ── main component ── */
export function LandingVariantSwitcher(props: LandingVariantProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL search params
  const paramV = searchParams.get("v") as VariantKey | null;
  const paramP = searchParams.get("p") as SubPage | null;

  const activeKey: VariantKey =
    paramV && VARIANT_KEYS.includes(paramV) ? paramV : "classic";
  const activeIdx = VARIANTS.findIndex((v) => v.key === activeKey);
  const subPage: SubPage =
    paramP && ["home", "products", "trending", "new", "feedback"].includes(paramP)
      ? paramP
      : "home";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Push URL changes
  const pushParams = useCallback(
    (v: VariantKey, p: SubPage) => {
      const params = new URLSearchParams();
      if (v !== "classic") params.set("v", v);
      if (p !== "home") params.set("p", p);
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router],
  );

  const handleSelectVariant = (idx: number) => {
    pushParams(VARIANTS[idx].key, "home");
  };

  const handleNavigate = useCallback(
    (page: SubPage) => {
      pushParams(activeKey, page);
    },
    [activeKey, pushParams],
  );

  function renderContent() {
    if (activeKey === "classic") {
      return <VariantClassic {...props} />;
    }

    if (activeKey === "feature") {
      switch (subPage) {
        case "products": return <FeatureProducts />;
        case "trending": return <FeatureTrending />;
        case "new":      return <FeatureNew />;
        case "feedback": return <FeatureFeedback />;
        default:         return <VariantFeature {...props} />;
      }
    }

    if (activeKey === "minimal") {
      switch (subPage) {
        case "products": return <MinimalProducts />;
        case "trending": return <MinimalTrending />;
        case "new":      return <MinimalNew />;
        case "feedback": return <MinimalFeedback />;
        default:         return <VariantMinimal {...props} />;
      }
    }

    return null;
  }

  return (
    <VariantNavContext.Provider value={{ subPage, navigate: handleNavigate }}>
      <div>
        {/* UI Version 토글 바 */}
        <div className="sticky top-0 z-[60] border-b border-neutral-800 bg-[#111]/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1180px] items-center gap-3 overflow-x-auto px-4 py-2 sm:px-6">
            <span className="hidden shrink-0 text-xs font-medium text-neutral-400 lg:block">
              UI Version
            </span>
            <div className="flex items-center gap-1.5">
              {VARIANTS.map((v, idx) => (
                <button
                  key={v.key}
                  onClick={() => handleSelectVariant(idx)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    activeIdx === idx
                      ? "bg-white text-black"
                      : "border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 선택된 변형 렌더링 */}
        {mounted ? renderContent() : null}
      </div>
    </VariantNavContext.Provider>
  );
}
