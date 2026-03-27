"use client";

import { useEffect } from "react";

import type { AnalysisEventKind } from "@/lib/utils/ranking";

type ProjectEventBeaconProps = {
  projectId: string;
  kind: AnalysisEventKind;
  source: string;
};

export function ProjectEventBeacon({ projectId, kind, source }: ProjectEventBeaconProps) {
  useEffect(() => {
    fetch(`/api/projects/${projectId}/events`, {
      method: "POST",
      keepalive: true,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        kind,
        source
      })
    }).catch(() => {});
  }, [kind, projectId, source]);

  return null;
}
