/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Flame,
  Triangle,
  MessageSquare,
  Github,
  Twitter,
} from "lucide-react";

import type { LandingVariantProps, SerializedProjectCard } from "../types";
import { OutboundLink } from "@/components/analytics/outbound-link";
import { getCategoryLabel } from "../shared";

/* ── palette ── */
const ACCENT = "#d76542";
const ACCENT_LIGHT = "#fdf2ee";

/* ── category config ── */
const CATEGORY_TABS = [
  { key: "all", label: "All", emoji: "🔥" },
  { key: "ai", label: "AI", emoji: "🤖" },
  { key: "tool", label: "Tool", emoji: "🛠️" },
  { key: "web", label: "Web", emoji: "🌐" },
  { key: "game", label: "Game", emoji: "🎮" },
  { key: "api", label: "API", emoji: "⚡" },
];

const CATEGORY_COLORS: Record<string, string> = {
  ai: "#8B5CF6",
  tool: "#F59E0B",
  web: "#06B6D4",
  game: "#EC4899",
  api: "#3B82F6",
  service: "#10B981",
};

/* ── dummy data ── */
const DUMMY_FEATURED = {
  title: "ChatFlow AI",
  category: "ai",
  tagline: "코드 없이 5분 만에 나만의 AI 챗봇을 만드는 노코드 빌더",
  tries: 1240,
  votes: 342,
};

const DUMMY_GRID = [
  { title: "PaletteGen", category: "ai", tagline: "브랜드, 제품을 입력하면 AI가 완벽한 컬러 팔레트를 생성" },
  { title: "DevShortcuts", category: "tool", tagline: "개발자를 위한 터미널 단축키 & 스니펫 관리 CLI 툴" },
  { title: "LinkSphere", category: "web", tagline: "팀 북마크를 한 곳에 모아 공유하는 협업 링크 허브" },
  { title: "PixelQuest", category: "game", tagline: "도트그래픽으로 8비트 클래식하게 즐기는 레트로 퍼즐 RPG" },
  { title: "WeatherAPI Pro", category: "api", tagline: "초 단위 날씨 데이터를 제공하는 무료 REST API 서비스" },
  { title: "MarkFlow", category: "tool", tagline: "실시간 협업이 가능한 마크다운 에디터 + 미리보기" },
];

const DUMMY_NEW = [
  { title: "ChatFlow AI", category: "ai", tagline: "코드 없이 5분 만에 나만의 AI 챗봇을 만드는 노코드 빌더", votes: 342 },
  { title: "PaletteGen", category: "ai", tagline: "브랜드, 제품을 입력하면 AI가 완벽한 컬러 팔레트를 생성", votes: 289 },
  { title: "DevShortcuts", category: "tool", tagline: "개발자를 위한 터미널 단축키 & 스니펫 관리 CLI 툴\n5시간 전", votes: 256 },
  { title: "LinkSphere", category: "web", tagline: "팀 북마크를 한 곳에 모아 공유하는 협업 링크 허브\n8시간 전", votes: 196 },
  { title: "PixelQuest", category: "game", tagline: "도트그래픽으로 8비트 클래식하게 즐기는 레트로 퍼즐 RPG", votes: 187 },
  { title: "WeatherAPI Pro", category: "api", tagline: "초 단위 날씨 데이터를 제공하는 무료 REST API 서비스", votes: 154 },
  { title: "MarkFlow", category: "tool", tagline: "실시간 협업이 가능한 마크다운 에디터 + 미리보기", votes: 134 },
  { title: "MindMapper AI", category: "ai", tagline: "AI가 텍스트를 읽고 마인드 스토핑 마인드맵으로 변환\n12시간 전", votes: 98 },
];

const DUMMY_FEEDBACK = [
  { title: "ChatFlow AI", category: "ai", tagline: "코드 없이 5분 만에 나만의 AI 챗봇을 만드는 노코드 빌더", question: "자연어 응답이 자연스러운지 테스트 부탁드립니다" },
  { title: "DevShortcuts", category: "tool", tagline: "개발자를 위한 터미널 단축키 & 스니펫 관리 CLI 툴", question: "CLI/V1 편의성, 실행한 결과 공유와 피드백 준다면하하?" },
  { title: "WeatherAPI Pro", category: "api", tagline: "초 단위 날씨 데이터를 제공하는 무료 REST API 서비스", question: "날씨 속도나 API 요청 관련 문제 없는지 검증해주세요!" },
];

const ROTATING_WORDS = ["API", "앱", "SaaS", "게임", "도구", "AI", "웹사이트", "플러그인"];

const V2_NAV = [
  { href: "/", label: "Home", active: true },
  { href: "/products", label: "Products" },
  { href: "/trending", label: "Trending" },
  { href: "/new", label: "New" },
  { href: "/feedback", label: "Feedback" },
];

export function VariantFeature({ data, viewer }: LandingVariantProps) {
  const [catTab, setCatTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rotateIdx, setRotateIdx] = useState(0);
  const [displayText, setDisplayText] = useState(ROTATING_WORDS[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(ROTATING_WORDS[0].length);

  useEffect(() => {
    const word = ROTATING_WORDS[rotateIdx % ROTATING_WORDS.length];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // typing
        if (charIdx < word.length) {
          setDisplayText(word.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        } else {
          // pause then start deleting
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        // deleting
        if (charIdx > 0) {
          setDisplayText(word.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        } else {
          setIsDeleting(false);
          setRotateIdx((prev) => prev + 1);
          const nextWord = ROTATING_WORDS[(rotateIdx + 1) % ROTATING_WORDS.length];
          setDisplayText("");
          setCharIdx(0);
        }
      }
    }, isDeleting ? 60 : 120);

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, rotateIdx]);

  const hasData = data.featured.length > 0;

  const featuredProjects = hasData ? data.featured : [];
  const launchProjects = hasData ? data.launches : [];
  const feedbackProjects = hasData ? data.feedback : [];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1a1a1a]">
      {/* V2 헤더 */}
      <header className="sticky top-[38px] z-50 border-b border-neutral-200 bg-[#FFFDF8]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5 text-lg font-bold" style={{ color: ACCENT }}>
            🚀 Viber
          </Link>
          <nav className="flex items-center gap-1">
            {V2_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  item.active
                    ? "text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                style={item.active ? { backgroundColor: ACCENT } : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-lg cursor-pointer">☀️</span>
            {viewer ? (
              <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold" style={{ color: ACCENT }}>{viewer.displayName}</span>
            ) : (
              <Link href="/auth/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: ACCENT }}>로그인</Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pb-12 pt-12 text-center sm:pb-16 sm:pt-16">
        {/* subtle warm gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fef3ec] to-[#FFFDF8]" />
        <div className="relative mx-auto max-w-3xl">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}
          >
            🚀 바이브코딩 커뮤니티 쇼케이스
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            내가 만든{" "}
            <span style={{ color: ACCENT }}>
              {displayText}
              <span className="animate-blink">|</span>
            </span>
            <br />
            여기서 시작
          </h1>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
            .animate-blink { animation: blink 1s step-end infinite; font-weight: 300; }
          ` }} />
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-neutral-500 sm:text-base">
            개발자들이 만든 앱, 툴, 서비스를 직접 체험하고 피드백을 남기세요.
          </p>

          {/* search */}
          <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="프로젝트 이름 또는 키워드 검색..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              ✨ 프로젝트 등록하기 (무료)
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300"
            >
              프로젝트 탐험하기
            </Link>
          </div>

          {/* stats bar */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              <strong className="text-neutral-700">1,240</strong> 프로젝트
            </span>
            <span>
              <strong className="text-neutral-700">48,800</strong> Try
            </span>
          </div>
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Flame className="h-7 w-7" style={{ color: ACCENT }} />
          Trending
        </h2>

        {/* category tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCatTab(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                catTab === tab.key
                  ? "text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
              style={catTab === tab.key ? { backgroundColor: ACCENT } : undefined}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* featured card */}
        <div className="mt-8">
          {hasData && featuredProjects[0] ? (
            <FeaturedCard project={featuredProjects[0]} />
          ) : (
            <DummyFeaturedCard />
          )}
        </div>

        {/* grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasData
            ? featuredProjects.slice(1, 7).map((p) => <ProjectCard key={p.id} project={p} />)
            : DUMMY_GRID.map((p, i) => <DummyCard key={i} {...p} />)}
        </div>
      </section>

      {/* ── New Projects ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            🆕 New Projects
          </h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">이번주</span>
          </div>
        </div>

        <div className="mt-8 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {hasData
            ? launchProjects.slice(0, 8).map((p, i) => <NewProjectRow key={p.id} project={p} />)
            : DUMMY_NEW.map((p, i) => <DummyNewRow key={i} {...p} />)}
        </div>
      </section>

      {/* ── Feedback ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          💬 피드백 요청 중
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          제작자가 여러분의 의견을 기다리고 있어요.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasData
            ? feedbackProjects.slice(0, 3).map((p) => <FeedbackCard key={p.id} project={p} />)
            : DUMMY_FEEDBACK.map((p, i) => <DummyFeedbackCard key={i} {...p} />)}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { value: `${hasData ? data.featured.length : 0}+`, label: "등록된 프로젝트" },
            { value: "0+", label: "총 Try 횟수" },
            { value: "0+", label: "누적 피드백" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold sm:text-4xl" style={{ color: ACCENT }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            당신의 프로젝트를
            <br />
            <span style={{ color: ACCENT }}>세상에 선보이세요</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-500">
            등록 무료, 실사용자 피드백 획득, 롱테일 트래픽까지.
            <br />
            바이브코딩 커뮤니티가 당신의 프로젝트를 응원합니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              ✨ 프로젝트 등록하기 (무료)
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300"
            >
              나도록 가이드 보기
            </Link>
          </div>
          <p className="mt-6 text-xs text-neutral-400">
            지금 1,240개의 프로젝트가 Viber에 등록되고 있어요 ✨
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-1.5 text-lg font-bold">
              <span style={{ color: ACCENT }}>🚀</span> Viber
            </p>
            <p className="mt-2 text-xs leading-5 text-neutral-500">
              바이브코딩 프로젝트 쇼케이스 플랫폼.
              <br />
              만든 것을 세상에 보여주세요.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">운영중</p>
            <div className="mt-3 flex flex-col gap-2">
              {["About", "Terms", "Privacy", "FAQ"].map((l) => (
                <span key={l} className="text-xs text-neutral-500 hover:text-neutral-700 cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">커뮤니티</p>
            <div className="mt-3 flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                <Github className="h-3 w-3" /> GitHub
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                <Twitter className="h-3 w-3" /> X (Twitter)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                💬 Discord
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-5xl items-center justify-between border-t border-neutral-100 pt-6">
          <span className="text-xs text-neutral-400">&copy; 2026 Viber. All rights reserved.</span>
          <span className="text-xs text-neutral-400">
            Made with ❤️ by the Vibe Coding Community
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════ */

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] ?? "#6B7280";
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {getCategoryLabel(category)}
    </span>
  );
}

/* ── Trending: featured ── */
function FeaturedCard({ project }: { project: SerializedProjectCard }) {
  return (
    <Link
      href={`/p/${project.slug}`}
      className="block overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {project.coverImageUrl && (
            <img src={project.coverImageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{project.title}</h3>
              <CategoryBadge category={project.category} />
            </div>
            <p className="mt-1 text-sm text-neutral-500">{project.tagline}</p>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          #1 Trending
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
        <span>👁 {project.metrics.uniqueClicks.toLocaleString()} Tries</span>
        <span style={{ color: ACCENT }}>▲ {project.metrics.score} votes</span>
      </div>
      <div className="mt-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Try it <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function DummyFeaturedCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">🤖</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{DUMMY_FEATURED.title}</h3>
              <CategoryBadge category={DUMMY_FEATURED.category} />
            </div>
            <p className="mt-1 text-sm text-neutral-500">{DUMMY_FEATURED.tagline}</p>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          #1 Trending
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
        <span>👁 {DUMMY_FEATURED.tries.toLocaleString()} Tries</span>
        <span style={{ color: ACCENT }}>▲ {DUMMY_FEATURED.votes} votes</span>
      </div>
      <div className="mt-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Try it <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

/* ── Trending: grid cards ── */
function ProjectCard({ project }: { project: SerializedProjectCard }) {
  return (
    <Link
      href={`/p/${project.slug}`}
      className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-md"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {project.coverImageUrl && (
              <img src={project.coverImageUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
            )}
            <h3 className="text-sm font-bold">{project.title}</h3>
          </div>
          <button className="text-neutral-300 hover:text-neutral-500">
            <Triangle className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-500">
          {project.tagline}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <CategoryBadge category={project.category} />
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Try it <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function DummyCard({ title, category, tagline }: { title: string; category: string; tagline: string }) {
  const emojis: Record<string, string> = { ai: "🤖", tool: "🛠️", web: "🌐", game: "🎮", api: "⚡" };
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-lg">
              {emojis[category] ?? "📦"}
            </div>
            <h3 className="text-sm font-bold">{title}</h3>
          </div>
          <button className="text-neutral-300">
            <Triangle className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-500">{tagline}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <CategoryBadge category={category} />
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Try it <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

/* ── New Projects rows ── */
function NewProjectRow({ project }: { project: SerializedProjectCard }) {
  return (
    <Link
      href={`/p/${project.slug}`}
      className="flex items-center gap-4 px-5 py-4 transition hover:bg-neutral-50"
    >
      {project.coverImageUrl ? (
        <img src={project.coverImageUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg">
          📦
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{project.title}</p>
          <CategoryBadge category={project.category} />
        </div>
        <p className="mt-0.5 truncate text-xs text-neutral-500">{project.tagline}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm text-neutral-400">{project.metrics.score}</span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Try it <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function DummyNewRow({ title, category, tagline, votes }: { title: string; category: string; tagline: string; votes: number }) {
  const emojis: Record<string, string> = { ai: "🤖", tool: "🛠️", web: "🌐", game: "🎮", api: "⚡" };
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg">
        {emojis[category] ?? "📦"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{title}</p>
          <CategoryBadge category={category} />
        </div>
        <p className="mt-0.5 truncate text-xs text-neutral-500">{tagline.split("\n")[0]}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm text-neutral-400">{votes}</span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          Try it <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

/* ── Feedback cards ── */
function FeedbackCard({ project }: { project: SerializedProjectCard }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{project.title}</p>
          <CategoryBadge category={project.category} />
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
            🟢 피드백 요청
          </span>
        </div>
        <p className="mt-2 text-xs text-neutral-500">{project.tagline}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/p/${project.slug}`}
          className="flex-1 rounded-full py-2 text-center text-xs font-semibold text-white"
          style={{ backgroundColor: "#22C55E" }}
        >
          Give Feedback 💬
        </Link>
        <OutboundLink
          projectId={project.id}
          source="home_try"
          href={project.liveUrl}
          className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700"
        >
          Try
        </OutboundLink>
      </div>
    </div>
  );
}

function DummyFeedbackCard({ title, category, tagline, question }: { title: string; category: string; tagline: string; question: string }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{title}</p>
          <CategoryBadge category={category} />
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
            🟢 피드백 요청
          </span>
        </div>
        <p className="mt-2 text-xs text-neutral-500">{tagline}</p>
        <p className="mt-2 text-xs italic text-neutral-400">&ldquo;{question}&rdquo;</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-full py-2 text-center text-xs font-semibold text-white" style={{ backgroundColor: "#22C55E" }}>
          Give Feedback 💬
        </button>
        <button className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700">
          Try
        </button>
      </div>
    </div>
  );
}
