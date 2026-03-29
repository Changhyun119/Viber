"use client";

import { useEffect, useState, useCallback } from "react";

const phrases = [
  "발견하고 피드백하세요",
  "만들고 공유하세요",
  "성장하고 연결하세요",
  "탐색하고 영감받으세요",
];

const DISPLAY_DURATION = 3000;
const TRANSITION_DURATION = 600;

export function RotatingText() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"visible" | "exiting" | "entering">("visible");

  const advance = useCallback(() => {
    setPhase("exiting");

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
      setPhase("entering");

      setTimeout(() => {
        setPhase("visible");
      }, 50);
    }, TRANSITION_DURATION);
  }, []);

  useEffect(() => {
    if (phase === "visible") {
      const timer = setTimeout(advance, DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
    if (phase === "entering") {
      return;
    }
  }, [phase, advance]);

  const motionStyle: React.CSSProperties = {
    transition: `opacity ${TRANSITION_DURATION}ms ease, transform ${TRANSITION_DURATION}ms ease`,
    ...(phase === "exiting"
      ? { opacity: 0, transform: "translateY(-12px)" }
      : phase === "entering"
        ? { opacity: 0, transform: "translateY(12px)" }
        : { opacity: 1, transform: "translateY(0)" }),
  };

  return (
    <span className="relative inline-block text-accent">
      <span style={motionStyle} className="inline-block">
        {phrases[index]}
      </span>
    </span>
  );
}
