# 랜딩페이지 UI 백업 (v0 — 원본)

> 작성일: 2026-03-27
> 복구 대상 파일: `src/app/(public)/page.tsx`
> 관련 컴포넌트: 아래 각 섹션 참고

---

## 1. 페이지 파일 전체 코드

**파일 경로**: `src/app/(public)/page.tsx`

```tsx
import Link from "next/link";

import { ProjectGrid } from "@/components/projects/project-grid";
import { FlashBanner } from "@/components/ui/flash-banner";
import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentProfile } from "@/lib/auth/session";
import { getHomepageData, getViewerState } from "@/lib/services/read-models";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getTextParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const viewer = await getCurrentProfile();
  const viewerState = await getViewerState(viewer?.id);
  const data = await getHomepageData();

  return (
    <PageShell>
      <FlashBanner notice={getTextParam(params.notice)} error={getTextParam(params.error)} />

      <section className="grid gap-6 rounded-[36px] border border-line bg-[rgba(255,253,248,0.94)] px-6 py-7 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-9">
        <div className="space-y-5">
          <div className="inline-flex rounded-full bg-[rgba(215,101,66,0.1)] px-4 py-2 text-sm font-semibold text-accent">
            프로젝트 중심 쇼케이스 커뮤니티
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold tracking-tight text-foreground">
              바이브코딩 산출물을
              <br />
              바로 눌러보고 피드백 받는 곳
            </h1>
            <p className="max-w-2xl text-base leading-8 text-foreground-muted md:text-lg">
              프로젝트를 올리고, 사람들이 실제로 눌러본 뒤 반응을 남기고, 업데이트가 같은 흐름 아래 계속 쌓이도록 설계했습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white">
              프로젝트 둘러보기
            </Link>
            <Link href="/submit" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground">
              내 프로젝트 올리기
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-line bg-white px-4 py-4">
              <div className="text-sm font-semibold text-foreground">1. 눌러보고</div>
              <div className="mt-1 text-sm text-foreground-muted">카드에서 체험 가능한 프로젝트부터 바로 시작합니다.</div>
            </div>
            <div className="rounded-3xl border border-line bg-white px-4 py-4">
              <div className="text-sm font-semibold text-foreground">2. 반응 남기고</div>
              <div className="mt-1 text-sm text-foreground-muted">저장, 댓글, 피드백 요청 흐름으로 다시 돌아옵니다.</div>
            </div>
            <div className="rounded-3xl border border-line bg-white px-4 py-4">
              <div className="text-sm font-semibold text-foreground">3. 업데이트를 추적합니다</div>
              <div className="mt-1 text-sm text-foreground-muted">프로젝트 아래 활동 이력이 계속 이어집니다.</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[32px] border border-line bg-[#111827] p-6 text-white shadow-soft">
            <div className="text-sm font-semibold text-white/70">빠르게 시작하기</div>
            <div className="mt-4 grid gap-3">
              <Link href="/projects?sort=latest" className="rounded-3xl bg-white/8 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/12">
                새로 올라온 프로젝트부터 보기
              </Link>
              <Link href="/projects?activity=feedback" className="rounded-3xl bg-white/8 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/12">
                지금 피드백이 필요한 프로젝트 보기
              </Link>
              <Link
                href={viewer ? "/me/projects" : "/submit"}
                className="rounded-3xl bg-white/8 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                {viewer ? "내 프로젝트 관리하러 가기" : "내 프로젝트 올리기"}
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-line bg-white p-5 shadow-soft">
            <div className="mb-3 text-sm font-semibold text-foreground-muted">자주 보는 태그</div>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Link key={tag.slug} href={`/tags/${tag.slug}`} className="rounded-full border border-line bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground">
                  {tag.name}
                </Link>
              ))}
            </div>
            {viewer ? <div className="mt-4 text-sm text-foreground-muted">현재 저장한 프로젝트 {viewerState.savedProjectIds.length}개</div> : null}
          </div>

          <div className="rounded-[32px] border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-semibold text-foreground">이 공간의 기준</div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground-muted">
              <li>프로젝트 카드가 글보다 먼저 보입니다.</li>
              <li>좋아요보다 실제 체험과 반응이 중요합니다.</li>
              <li>업데이트와 피드백 요청은 프로젝트 아래에 쌓입니다.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="추천" title="오늘 바로 눌러볼 만한 프로젝트" description="메인 노출은 좋아요 숫자 대신 실제 체험과 반응률을 기준으로 편성합니다." />
        <ProjectGrid items={data.featured} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} featured />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="신규 공개"
          title="새로 공개된 프로젝트"
          description="최근 런치한 프로젝트만 빠르게 훑고, 마음에 들면 바로 체험으로 이어집니다."
          action={
            <Link href="/projects?sort=latest" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              전체 보기
            </Link>
          }
        />
        <ProjectGrid items={data.launches} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="피드백 요청"
          title="지금 답이 필요한 프로젝트"
          description="메이커가 막히는 지점이 분명한 프로젝트만 모았습니다."
          action={
            <Link href="/projects?activity=feedback" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
              더 보기
            </Link>
          }
        />
        <ProjectGrid items={data.feedback} viewer={viewer} savedProjectIds={viewerState.savedProjectIds} />
      </section>
    </PageShell>
  );
}
```

---

## 2. 섹션별 구조 설명

### 섹션 1 — 히어로 (2컬럼 그리드)

**레이아웃**: `lg:grid-cols-[1.1fr_0.9fr]` — 좌측(1.1), 우측(0.9)
**배경**: `rounded-[36px] border border-line bg-[rgba(255,253,248,0.94)] shadow-soft`

**좌측 컨텐츠**
- 뱃지: `inline-flex rounded-full bg-[rgba(215,101,66,0.1)] text-accent` → "프로젝트 중심 쇼케이스 커뮤니티"
- H1: `text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold tracking-tight` → "바이브코딩 산출물을 / 바로 눌러보고 피드백 받는 곳"
- 설명 텍스트: `text-base leading-8 text-foreground-muted md:text-lg`
- CTA 버튼 2개:
  - 프로젝트 둘러보기: `rounded-full bg-[#111827] text-white`
  - 내 프로젝트 올리기: `rounded-full border border-line bg-white text-foreground`
- 3단계 카드 (3컬럼 그리드): `rounded-3xl border border-line bg-white px-4 py-4`
  - "1. 눌러보고", "2. 반응 남기고", "3. 업데이트를 추적합니다"

**우측 컨텐츠**
- 다크 카드: `rounded-[32px] bg-[#111827] text-white` — "빠르게 시작하기" + 링크 3개
  - 새로 올라온 프로젝트 (`/projects?sort=latest`)
  - 피드백이 필요한 프로젝트 (`/projects?activity=feedback`)
  - 내 프로젝트 관리/올리기 (로그인 상태에 따라 분기)
- 태그 카드: `rounded-[32px] bg-white` — `data.tags` 순회하여 태그 링크 렌더링
  - 로그인 시 "현재 저장한 프로젝트 N개" 표시
- 기준 카드: `rounded-[32px] bg-white` — 운영 원칙 3가지 `<ul>` 목록

### 섹션 2 — 추천 프로젝트
- `SectionHeading` eyebrow="추천" title="오늘 바로 눌러볼 만한 프로젝트"
- `ProjectGrid` → `data.featured`, `featured=true` (첫 번째 카드 large)

### 섹션 3 — 신규 공개
- `SectionHeading` eyebrow="신규 공개" + 전체 보기 버튼 (`/projects?sort=latest`)
- `ProjectGrid` → `data.launches`

### 섹션 4 — 피드백 요청
- `SectionHeading` eyebrow="피드백 요청" + 더 보기 버튼 (`/projects?activity=feedback`)
- `ProjectGrid` → `data.feedback`

---

## 3. 사용된 컴포넌트 목록

| 컴포넌트 | 경로 |
|---------|------|
| `PageShell` | `src/components/ui/page-shell.tsx` |
| `FlashBanner` | `src/components/ui/flash-banner.tsx` |
| `SectionHeading` | `src/components/ui/section-heading.tsx` |
| `ProjectGrid` | `src/components/projects/project-grid.tsx` |
| `ProjectCard` | `src/components/projects/project-card.tsx` |
| `SiteHeader` | `src/components/layout/site-header.tsx` |
| `SiteFooter` | `src/components/layout/site-footer.tsx` |

---

## 4. 데이터 의존성

```ts
// src/lib/services/read-models.ts 에서 가져오는 데이터
const data = await getHomepageData();
// data.featured  — 추천 프로젝트 (체험·반응률 기반)
// data.launches  — 최신 공개 프로젝트
// data.feedback  — 피드백 요청 중인 프로젝트
// data.tags      — 자주 보는 태그 목록

const viewerState = await getViewerState(viewer?.id);
// viewerState.savedProjectIds — 로그인 유저의 저장 목록
```

---

## 5. 전체 레이아웃 구조 (SiteHeader 포함)

**SiteHeader** (`src/components/layout/site-header.tsx`)
- `sticky top-0 z-50 border-b border-line bg-[rgba(250,248,244,0.9)] backdrop-blur`
- 로고: Sparkles 아이콘 + "PROJECT SHOWCASE / 바이브 쇼케이스"
- 네비게이션: 홈 / 탐색 / 등록하기
- 우측: 로그인 상태에 따라 LoginForms / LoggedInControls
- 하단 태그 바: "읽기는 바로" / "프로젝트 중심" / "업데이트는 owner만"

**SiteFooter** (`src/components/layout/site-footer.tsx`)
- `border-t border-line bg-[rgba(255,253,248,0.76)]`
- 좌: "바이브 쇼케이스" + 설명
- 우: 운영 정책 / 개인정보 안내 / 프로젝트 등록 링크

---

## 6. 디자인 토큰 (Tailwind CSS 커스텀 변수)

| 토큰 | 설명 |
|------|------|
| `border-line` | 기본 테두리 색상 |
| `text-foreground` | 기본 텍스트 |
| `text-foreground-muted` | 보조 텍스트 |
| `text-accent` | 강조 텍스트 (오렌지) |
| `bg-surface-muted` | 배경 서피스 |
| `shadow-soft` | 부드러운 그림자 |
| `rounded-[36px]` / `rounded-[32px]` / `rounded-3xl` | 큰/중간/기본 라운딩 |
| `bg-[#111827]` | 다크 강조 배경 (네이비) |
| `bg-[rgba(255,253,248,0.94)]` | 크림 흰색 배경 |

---

## 7. 복구 방법

1. `src/app/(public)/page.tsx` 내용을 위 **섹션 1의 전체 코드**로 교체
2. `src/components/ui/mosaic-background.tsx` 와 `src/components/ui/hero-background.tsx` 가 있다면 삭제 (원본에 없음)
3. 서버 재시작: `npm run dev`
