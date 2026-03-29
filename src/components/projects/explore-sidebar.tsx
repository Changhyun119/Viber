import Link from "next/link";
import { TrendingUp, Clock, MessageSquare, RefreshCw, Code2, Zap, Users, CheckSquare, Square } from "lucide-react";

import { categoryOptions } from "@/lib/constants";

type ExploreSidebarProps = {
  activeSort?: string;
  activeCategories?: string[];
  activeActivity?: string;
  activeFlags?: {
    openSource?: boolean;
    noSignup?: boolean;
    soloMaker?: boolean;
  };
  currentParams: Record<string, string | string[] | undefined>;
};

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground-muted">
        {title}
      </p>
      {children}
    </div>
  );
}

function SortLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-foreground text-background"
          : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
      }`}
    >
      <span className="size-4 shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

function buildCategoryHref(
  currentParams: Record<string, string | string[] | undefined>,
  categoryValue: string,
  activeCategories: string[]
): string {
  const params = new URLSearchParams();

  // 기존 파라미터 유지 (category 제외)
  Object.entries(currentParams).forEach(([key, value]) => {
    if (key === "categories" || key === "page") return;
    const single = Array.isArray(value) ? value[0] : value;
    if (single) params.set(key, single);
  });

  // 카테고리 토글
  const next = activeCategories.includes(categoryValue)
    ? activeCategories.filter((c) => c !== categoryValue)
    : [...activeCategories, categoryValue];

  next.forEach((c) => params.append("categories", c));

  return `/projects?${params.toString()}`;
}

export function ExploreSidebar({
  activeSort,
  activeCategories = [],
  activeActivity,
  activeFlags,
  currentParams,
}: ExploreSidebarProps) {
  return (
    <aside className="hidden w-48 shrink-0 flex-col gap-5 lg:flex">

      <SideSection title="정렬">
        <SortLink href="/projects?sort=trending" icon={<TrendingUp className="size-4" />} label="트렌딩" active={activeSort === "trending" && !activeActivity} />
        <SortLink href="/projects?sort=latest" icon={<Clock className="size-4" />} label="최신 공개" active={activeSort === "latest"} />
        <SortLink href="/projects?sort=updated" icon={<RefreshCw className="size-4" />} label="최근 업데이트" active={activeSort === "updated"} />
        <SortLink href="/projects?sort=comments" icon={<MessageSquare className="size-4" />} label="댓글 많은 순" active={activeSort === "comments"} />
      </SideSection>

      <SideSection title="피드백">
        <SortLink href="/projects?activity=feedback" icon={<Zap className="size-4" />} label="피드백 요청" active={activeActivity === "feedback"} />
        <SortLink href="/projects?activity=launch" icon={<TrendingUp className="size-4" />} label="런치" active={activeActivity === "launch"} />
        <SortLink href="/projects?activity=update" icon={<RefreshCw className="size-4" />} label="업데이트" active={activeActivity === "update"} />
      </SideSection>

      <SideSection title="카테고리 (복수선택)">
        {categoryOptions.map((cat) => {
          const isActive = activeCategories.includes(cat.value);
          const href = buildCategoryHref(currentParams, cat.value, activeCategories);
          return (
            <Link
              key={cat.value}
              href={href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <span className="size-4 shrink-0">
                {isActive ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
              </span>
              {cat.label}
            </Link>
          );
        })}
      </SideSection>

      <SideSection title="태그">
        <SortLink href="/projects?openSource=true" icon={<Code2 className="size-4" />} label="오픈소스" active={activeFlags?.openSource} />
        <SortLink href="/projects?noSignup=true" icon={<Zap className="size-4" />} label="가입 없이 체험" active={activeFlags?.noSignup} />
        <SortLink href="/projects?soloMaker=true" icon={<Users className="size-4" />} label="1인 메이커" active={activeFlags?.soloMaker} />
      </SideSection>

      <div className="border-t border-line pt-3">
        <Link href="/projects" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground-muted transition hover:bg-surface-muted hover:text-foreground">
          전체 초기화
        </Link>
      </div>
    </aside>
  );
}
