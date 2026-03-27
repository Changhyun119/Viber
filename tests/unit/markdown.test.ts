import { describe, expect, test } from "vitest";

import {
  normalizePlainTextInput,
  prepareMarkdownField,
  preparePlainTextField,
  safeRenderMarkdownLite
} from "@/lib/content/markdown";

describe("markdown sanitization", () => {
  test("plain text 입력은 HTML과 줄바꿈을 제거한다", () => {
    expect(normalizePlainTextInput("  <b>hello</b>\nworld  ")).toBe("hello world");
    expect(
      preparePlainTextField(" <b>메이커</b>\n별칭  ", {
        label: "메이커 별칭",
        minLength: 2,
        maxLength: 20
      })
    ).toBe("메이커 별칭");
  });

  test("markdown-lite는 허용된 링크만 통과시키고 외부 링크 속성을 붙인다", () => {
    const normalized = prepareMarkdownField("[문서](https://example.com/docs)\n\n`code`", {
      label: "본문",
      maxLength: 3000,
      maxLinks: 5
    });

    const html = safeRenderMarkdownLite(normalized);

    expect(html).toContain('href="https://example.com/docs"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="nofollow ugc noopener noreferrer"');
    expect(html).toContain("<code>code</code>");
  });

  test("금지된 문법은 저장 단계에서 거절한다", () => {
    expect(() =>
      prepareMarkdownField("# 제목", {
        label: "본문",
        maxLength: 3000,
        maxLinks: 5
      })
    ).toThrow("제목(heading)");

    expect(() =>
      prepareMarkdownField("![img](https://example.com/a.png)", {
        label: "본문",
        maxLength: 3000,
        maxLinks: 5
      })
    ).toThrow("인라인 이미지");

    expect(() =>
      prepareMarkdownField("[bad](javascript:alert(1))", {
        label: "본문",
        maxLength: 3000,
        maxLinks: 5
      })
    ).toThrow("http, https, mailto");
  });
});
