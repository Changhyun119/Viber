"use client";

import { useEffect, useState } from "react";

import type { LandingVariantProps } from "./types";
import { VariantClassic } from "./variant-classic";
import { VariantFeature } from "./variant-feature";
import { VariantMinimal } from "./variant-minimal";

const VARIANTS = [
  { key: "classic", label: "1. 기본", Component: VariantClassic },
  { key: "feature", label: "2. 기능중심", Component: VariantFeature },
  { key: "minimal", label: "3. 다크 미니멀", Component: VariantMinimal },
] as const;

const STORAGE_KEY = "landing-variant";

export function LandingVariantSwitcher(props: LandingVariantProps) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const idx = parseInt(stored, 10);
      if (idx >= 0 && idx < VARIANTS.length) setActive(idx);
    }
    setMounted(true);
  }, []);

  const handleSelect = (idx: number) => {
    setActive(idx);
    localStorage.setItem(STORAGE_KEY, String(idx));
  };

  const { Component } = VARIANTS[active];

  return (
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

      {/* 선택된 변형 렌더링 (각 variant가 자체 헤더/푸터 포함) */}
      {mounted ? <Component {...props} /> : <Component {...props} />}
    </div>
  );
}
