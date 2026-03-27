# 콘텐츠 렌더링과 Sanitization 기준

## 1. 문서 목적

이 문서는 프로젝트 본문, 활동 본문, 댓글, 짧은 소개 문구를 어떤 규칙으로 저장하고 렌더링할지 고정한다.

목표는 아래 세 가지다.

- 공개 화면의 텍스트 품질을 일정하게 유지한다.
- XSS와 악성 링크 삽입을 막는다.
- 작성 경험과 렌더링 결과가 예측 가능하도록 만든다.

이 문서는 "보통의 공개 상용 서비스" 수준을 기준으로 한다. 과도한 커스텀 문법은 넣지 않고, 안전하고 단순한 규칙을 우선한다.

## 2. 적용 범위

이 문서는 아래 필드에 적용한다.

- `projects.overview_md`
- `projects.problem_md`
- `projects.target_users_md`
- `projects.why_made_md`
- `project_posts.body_md`
- `project_posts.requested_feedback_md`
- `comments.body_md`

아래 필드는 Markdown이 아니라 plain text로 취급한다.

- `projects.title`
- `projects.tagline`
- `projects.short_description`
- `project_posts.title`
- `project_posts.summary`
- `projects.maker_alias`

## 3. 기본 원칙

- 저장 포맷은 원문 Markdown 텍스트를 기준으로 한다.
- 렌더링 시에는 항상 sanitize된 HTML만 사용한다.
- 사용자 입력 HTML은 허용하지 않는다.
- iframe, script, embed 같은 활성 콘텐츠는 허용하지 않는다.
- 카드와 목록에서는 rich text를 직접 렌더링하지 않고 plain text 요약만 사용한다.

## 4. Canonical 문법 기준

### 4-1. 허용 Markdown 요소

본문과 댓글의 `markdown-lite`는 아래만 허용한다.

- 문단
- 줄바꿈
- 굵게
- 기울임
- 인라인 코드
- 코드 블록
- 순서 있는 목록
- 순서 없는 목록
- 인용문
- 링크
- 수평선

### 4-2. 허용하지 않는 요소

- raw HTML
- heading
- table
- task list
- 이미지 인라인 Markdown
- iframe / embed
- 자동 스타일 속성
- mention, hashtag custom syntax

설명:

- heading을 막는 이유는 상세 페이지에서 본문보다 페이지 자체의 계층 구조가 우선이기 때문이다.
- 인라인 이미지와 embed를 막는 이유는 본문 렌더링을 미디어 업로드 규칙과 분리하기 위해서다.

## 5. 필드별 입력 규칙

### 5-1. Plain text 필드

아래 필드는 plain text only로 처리한다.

- 제목
- 한 줄 소개
- 짧은 설명
- maker alias
- 활동 제목
- 활동 요약

규칙:

- HTML 태그는 모두 제거한다.
- 개행은 공백으로 정규화한다.
- 앞뒤 공백은 제거한다.

### 5-2. Markdown 필드

본문 필드는 Markdown 원문으로 저장할 수 있다.

규칙:

- 서버에서 길이 제한을 둔다.
- 비어 있는 강조/링크 등 무의미한 문법은 normalize할 수 있다.
- 연속 공백과 과도한 빈 줄은 normalize할 수 있다.

권장 길이:

- 프로젝트 본문 필드: 각 3,000자 이내
- 활동 본문: 5,000자 이내
- 댓글: 1,000자 이내

## 6. 링크 처리 기준

링크는 가장 악용되기 쉬운 지점이므로 별도 규칙을 둔다.

### 6-1. 허용 프로토콜

- `https`
- `http`
- `mailto`

그 외 프로토콜은 모두 차단한다.

예:

- `javascript:`
- `data:`
- `file:`
- `vbscript:`

### 6-2. 링크 수 제한

- 댓글: 최대 2개
- 프로젝트 본문 각 필드: 최대 5개
- 활동 본문: 최대 5개

초과 시:

- 저장 단계에서 validation error를 반환한다.

### 6-3. 외부 링크 렌더링 속성

사용자 생성 링크는 모두 아래 속성으로 렌더링한다.

- `rel="nofollow ugc noopener noreferrer"`
- `target="_blank"`

원칙:

- 내부 앱 라우트 링크로 보이더라도 사용자 생성 본문 안에서는 외부 링크와 동일하게 취급한다.

## 7. 미디어와 임베드 기준

본문 내부의 임의 미디어 삽입은 허용하지 않는다.

허용 방식:

- 업로드된 대표 이미지
- 갤러리 이미지
- 활동의 `media_json`
- 명시적 `demo_url`

허용하지 않는 방식:

- Markdown 이미지 `![]()`
- 외부 iframe 영상 임베드
- raw HTML video/audio 태그

이 원칙을 두는 이유는 카드/상세 상단의 미디어 규칙과 본문 렌더링을 분리하기 위해서다.

## 8. Sanitization 기준

### 8-1. 처리 순서

1. 서버에서 입력 validation
2. Markdown 파싱
3. HTML sanitize
4. 안전한 링크 속성 주입
5. 렌더

중요:

- 클라이언트 sanitize에만 의존하지 않는다.
- 서버와 클라이언트가 다른 렌더링 결과를 내지 않도록, 가능하면 서버 기준 파이프라인 하나로 통일한다.

### 8-2. 제거 대상

- 모든 raw HTML 태그
- 이벤트 핸들러 속성
- inline style
- 허용되지 않은 URL scheme
- 빈 링크 노드
- 중첩이 비정상적인 블록

### 8-3. 출력 보장

sanitize 이후 출력 HTML은 아래만 포함해야 한다.

- `p`
- `br`
- `strong`
- `em`
- `code`
- `pre`
- `ul`
- `ol`
- `li`
- `blockquote`
- `a`
- `hr`

## 9. 댓글 전용 규칙

댓글은 본문보다 더 엄격하게 제한한다.

- 최대 길이 1,000자
- 링크 최대 2개
- 코드 블록 허용 가능하지만 20줄 이내 권장
- heading, 인라인 이미지, 표, iframe 불가

추가 규칙:

- 댓글 수정 시 최초 작성 후 15분 이내까지만 허용
- 댓글 삭제는 soft delete
- 삭제 후 일반 사용자에게는 "삭제된 댓글입니다" placeholder를 보여준다

## 10. 카드/목록 렌더링 규칙

카드, 탐색 결과, 메타 요약에는 Markdown 렌더링을 직접 쓰지 않는다.

사용 규칙:

- `tagline`, `short_description`, `summary` 같은 plain text 필드만 사용
- 길이 제한 후 clamp 처리
- HTML decode 후 plain text로만 노출

즉, 상세 본문과 카드 요약은 같은 소스에서 파생되더라도 렌더링 방식은 다르다.

## 11. 신고와 운영 기준

아래는 자동 또는 수동 검토 대상이다.

- 링크 수 제한 초과
- 금지 프로토콜 포함
- 복붙성 과도한 템플릿 본문
- 의미 없는 반복 문자
- 외부 홍보 링크만 과도하게 포함된 경우

운영자는 필요 시 아래 조치를 할 수 있다.

- 댓글 `hidden`
- 활동 `pending` 또는 `hidden`
- 프로젝트 `limited` 또는 `reject`

## 12. 구현 권장사항

- 저장은 Markdown 원문, 렌더는 sanitize된 HTML 파이프라인으로 분리한다.
- sanitize 라이브러리는 서버와 클라이언트에서 같은 결과를 내는 조합을 사용한다.
- 카드/목록에는 절대 `dangerouslySetInnerHTML`를 사용하지 않는다.
- 테스트에는 XSS payload, 금지 프로토콜, 긴 링크 스팸 케이스를 포함한다.

## 13. 이 문서가 닫는 결정

이 문서 기준으로 아래는 고정한다.

- raw HTML 불가
- markdown-lite 범위 고정
- 인라인 이미지와 iframe 불가
- 사용자 생성 링크는 모두 `nofollow ugc noopener noreferrer`
- plain text 필드와 markdown 필드 구분
- sanitize는 서버 기준 파이프라인으로 수행
