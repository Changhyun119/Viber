import Link from "next/link";
import { ArrowRight, Triangle, Cpu, Wrench, Globe, Gamepad2, HeartHandshake, Moon } from "lucide-react";

import type { LandingVariantProps, SerializedProjectCard } from "../types";
import { getCategoryLabel } from "../shared";

const V3_NAV = [
  { href: "/products", label: "프로젝트" },
  { href: "/trending", label: "트렌딩" },
  { href: "/feedback", label: "피드백" },
];

/* ── dummy data (DB가 비어 있을 때 사용) ── */
const DUMMY_PROJECTS: {
  rank: number;
  title: string;
  desc: string;
  icon: string;
  score: number;
}[] = [
  { rank: 1, title: "AI 글쓰기 도우미", desc: "블로그 포스트를 AI로 자동 생성하는 크롬 확장 프로그램", icon: "✏️", score: 342 },
  { rank: 2, title: "인디 퀘스트", desc: "1인 개발자가 만든 2D 로그라이크 RPG 게임", icon: "🎮", score: 289 },
  { rank: 3, title: "DevFlow", desc: "개발자를 위한 워크플로우 자동화 CLI 도구", icon: "⚡", score: 256 },
  { rank: 4, title: "노마드 허브", desc: "디지털 노마드를 위한 도시별 리뷰 & 커뮤니티 플랫폼", icon: "🌍", score: 196 },
  { rank: 5, title: "DataLens", desc: "CSV/JSON 데이터를 드래그앤드롭으로 시각화하는 웹 도구", icon: "📊", score: 187 },
  { rank: 6, title: "MatchMaker", desc: "사이드 프로젝트 팀 매칭 서비스", icon: "🤝", score: 176 },
];

const CATEGORIES = [
  { label: "AI", icon: Cpu, count: 5, color: "#8B5CF6" },
  { label: "Tool", icon: Wrench, count: 6, color: "#3B82F6" },
  { label: "Web", icon: Globe, count: 5, color: "#06B6D4" },
  { label: "Game", icon: Gamepad2, count: 3, color: "#F59E0B" },
  { label: "Service", icon: HeartHandshake, count: 3, color: "#EC4899" },
];

const STATS = [
  { value: "1,034+", label: "등록 프로젝트" },
  { value: "892", label: "인디 메이커" },
  { value: "15,420+", label: "업보트" },
  { value: "3,847", label: "피드백" },
];

const PROBLEMS = [
  {
    problem: '"사이드 프로젝트 만들었는데 보여줄 곳이 없어요"',
    solution: "Viber에 올리세요. 수백 명의 메이커가 봅니다.",
  },
  {
    problem: '"피드백이 필요한데 주변에 개발자가 없어요"',
    solution: "커뮤니티가 실질적인 피드백을 줍니다.",
  },
  {
    problem: '"다른 메이커들은 뭘 만들고 있는지 궁금해요"',
    solution: "트렌딩 프로젝트를 확인하세요.",
  },
];

export function VariantMinimal({ data, viewer }: LandingVariantProps) {
  const hasProjects = data.featured.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* V3 헤더 — 미니멀 */}
      <header className="sticky top-[38px] z-50 border-b border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="text-base font-bold text-white">Viber</Link>
          <nav className="flex items-center gap-6">
            {V3_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-neutral-400 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <Moon className="h-4 w-4 cursor-pointer text-neutral-500 hover:text-white" />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center px-4 pb-24 pt-20 text-center sm:pt-28">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
          Viber
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-6 text-neutral-400 sm:text-base">
          인디 메이커의 프로덕트를 발견하고,
          <br />
          피드백을 주고받는 공간.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            둘러보기 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-neutral-500"
          >
            프로젝트 등록하기
          </Link>
        </div>
      </section>

      {/* ── Why Viber ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          왜 Viber인가요?
        </h2>
        <div className="mt-12 space-y-10">
          {PROBLEMS.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-12"
            >
              <p className="text-sm leading-6 text-neutral-500 sm:w-1/2">
                {item.problem}
              </p>
              <p className="text-sm font-medium leading-6 text-white sm:w-1/2">
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            지금 뜨는 프로젝트
          </h2>
          <Link
            href="/projects"
            className="hidden items-center gap-1 text-sm text-neutral-400 transition hover:text-white sm:inline-flex"
          >
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 divide-y divide-neutral-800">
          {hasProjects
            ? data.featured.slice(0, 6).map((p, i) => (
                <ProjectRow key={p.id} rank={i + 1} project={p} />
              ))
            : DUMMY_PROJECTS.map((p) => (
                <DummyProjectRow key={p.rank} {...p} />
              ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          카테고리
        </h2>
        <div className="mt-10 flex flex-wrap gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={`/projects?category=${cat.label.toLowerCase()}`}
                className="flex w-[130px] flex-col items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/50 px-4 py-6 transition hover:border-neutral-600"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: cat.color }} />
                </div>
                <span className="text-sm font-semibold">{cat.label}</span>
                <span className="text-xs text-neutral-500">
                  {cat.count} projects
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          당신의 프로덕트를 세상에 알리세요.
          <br />
          <span className="text-neutral-400">Viber가 연결합니다.</span>
        </h2>
        <div className="mt-8">
          <Link
            href="/submit"
            className="inline-flex items-center rounded-full border border-neutral-700 px-8 py-3 text-sm font-semibold text-white transition hover:border-neutral-500 hover:bg-neutral-900"
          >
            시작하기
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-800 px-6 py-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-xs text-neutral-600">&copy; 2026 Viber</span>
          <div className="flex gap-6">
            <Link href="/projects" className="text-xs text-neutral-500 hover:text-white">프로젝트</Link>
            <Link href="/projects?sort=trending" className="text-xs text-neutral-500 hover:text-white">트렌딩</Link>
            <Link href="/projects?activity=feedback" className="text-xs text-neutral-500 hover:text-white">피드백</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function ProjectRow({ rank, project }: { rank: number; project: SerializedProjectCard }) {
  return (
    <Link
      href={`/p/${project.slug}`}
      className="flex items-center gap-4 py-4 transition hover:bg-neutral-900/40 sm:gap-6"
    >
      <span className="w-8 shrink-0 text-center text-sm font-medium text-neutral-600">
        {String(rank).padStart(2, "0")}
      </span>
      {project.coverImageUrl ? (
        <img
          src={project.coverImageUrl}
          alt=""
          className="h-9 w-9 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-lg">
          {getCategoryLabel(project.category).charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{project.title}</p>
        <p className="truncate text-xs text-neutral-500">{project.tagline}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-sm text-neutral-400">
        <span>{project.metrics.score}</span>
        <Triangle className="h-3 w-3 fill-current" />
      </div>
    </Link>
  );
}

function DummyProjectRow({
  rank,
  title,
  desc,
  icon,
  score,
}: {
  rank: number;
  title: string;
  desc: string;
  icon: string;
  score: number;
}) {
  return (
    <div className="flex items-center gap-4 py-4 sm:gap-6">
      <span className="w-8 shrink-0 text-center text-sm font-medium text-neutral-600">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-lg">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-neutral-500">{desc}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-sm text-neutral-400">
        <span>{score}</span>
        <Triangle className="h-3 w-3 fill-current" />
      </div>
    </div>
  );
}
