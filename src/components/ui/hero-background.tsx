"use client";

import { MosaicBackground } from "@/components/ui/mosaic-background";

export function HeroBackground({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden min-h-[520px]">
      <MosaicBackground />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(215,101,66,0.12),transparent_50%)] pointer-events-none z-[1]" />
      <div className="relative z-[2] pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto">
        {children}
      </div>
    </section>
  );
}
