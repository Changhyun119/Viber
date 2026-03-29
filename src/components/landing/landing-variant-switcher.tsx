"use client";

import { useEffect, useState } from "react";

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

const VARIANTS = [
  { key: "classic", label: "1. 기본" },
  { key: "feature", label: "2. 기능중심" },
  { key: "minimal", label: "3. 다크 미니멀" },
] as const;

const STORAGE_KEY = "landing-variant";
const PAGE_KEY = "landing-page";

type SubPage = "home" | "products" | "trending" | "new" | "feedback";

export function LandingVariantSwitcher(props: LandingVariantProps) {
  const [active, setActive] = useState(0);
  const [subPage, setSubPage] = useState<SubPage>("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const idx = parseInt(stored, 10);
      if (idx >= 0 && idx < VARIANTS.length) setActive(idx);
    }
    setMounted(true);

    // Listen for sub-page navigation events from variants
    const handler = (e: CustomEvent<SubPage>) => {
      setSubPage(e.detail);
    };
    window.addEventListener("variant-navigate" as any, handler);
    return () => window.removeEventListener("variant-navigate" as any, handler);
  }, []);

  const handleSelect = (idx: number) => {
    setActive(idx);
    setSubPage("home"); // reset to home when switching variant
    localStorage.setItem(STORAGE_KEY, String(idx));
  };

  function renderContent() {
    const variant = VARIANTS[active].key;

    // V1 classic — always show landing (uses Next.js routes for sub-pages)
    if (variant === "classic") {
      return <VariantClassic {...props} />;
    }

    // V2 feature
    if (variant === "feature") {
      switch (subPage) {
        case "products": return <FeatureProducts />;
        case "trending": return <FeatureTrending />;
        case "new": return <FeatureNew />;
        case "feedback": return <FeatureFeedback />;
        default: return <VariantFeature {...props} />;
      }
    }

    // V3 minimal
    if (variant === "minimal") {
      switch (subPage) {
        case "products": return <MinimalProducts />;
        case "trending": return <MinimalTrending />;
        case "new": return <MinimalNew />;
        case "feedback": return <MinimalFeedback />;
        default: return <VariantMinimal {...props} />;
      }
    }

    return null;
  }

  return (
    <VariantNavContext.Provider value={{ subPage, navigate: setSubPage }}>
      <div>
        {/* UI Version 토글 바 — 최상단 */}
        <div className="sticky top-0 z-[60] border-b border-neutral-800 bg-[#111]/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1180px] items-center gap-3 overflow-x-auto px-4 py-2 sm:px-6">
            <span className="hidden shrink-0 text-xs font-medium text-neutral-400 lg:block">
              UI Version
            </span>
            <div className="flex items-center gap-1.5">
              {VARIANTS.map((v, idx) => (
                <button
                  key={v.key}
                  onClick={() => handleSelect(idx)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    active === idx
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
        {mounted ? renderContent() : renderContent()}
      </div>
    </VariantNavContext.Provider>
  );
}

/* ── Context for sub-page navigation ── */
import { createContext, useContext } from "react";

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
