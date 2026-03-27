"use client";

import type { PropsWithChildren } from "react";

import type { RankingClickSource } from "@/lib/utils/ranking";

type OutboundLinkProps = PropsWithChildren<{
  projectId: string;
  source: RankingClickSource;
  href: string;
  className?: string;
}>;

export function OutboundLink({ projectId, source, href, className, children }: OutboundLinkProps) {
  const handleClick = () => {
    fetch(`/api/projects/${projectId}/outbound-click`, {
      method: "POST",
      keepalive: true,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        source
      })
    }).catch(() => {});
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
