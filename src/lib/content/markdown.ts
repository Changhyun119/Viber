import sanitizeHtml from "sanitize-html";
import { Marked } from "marked";

const markdownParser = new Marked({
  gfm: true,
  breaks: true
});

const allowedMarkdownTags = ["p", "br", "strong", "em", "code", "pre", "ul", "ol", "li", "blockquote", "a", "hr"];
const allowedSchemes = ["http", "https", "mailto"];

type PlainTextPolicy = {
  label: string;
  minLength?: number;
  maxLength: number;
  allowEmpty?: boolean;
};

type MarkdownPolicy = {
  label: string;
  maxLength: number;
  maxLinks: number;
  allowEmpty?: boolean;
};

type MarkdownValidationResult = {
  normalized: string;
  linkCount: number;
};

function stripHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

function normalizeWhitespace(value: string) {
  return value.replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function assertProtocol(url: string, label: string) {
  const normalized = url.trim();

  if (!normalized) {
    throw new Error(`${label} 링크가 비어 있습니다.`);
  }

  const protocolMatch = normalized.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);

  if (!protocolMatch) {
    throw new Error(`${label} 링크는 http, https, mailto만 사용할 수 있습니다.`);
  }

  const protocol = protocolMatch[1]?.toLowerCase();

  if (!protocol || !allowedSchemes.includes(protocol)) {
    throw new Error(`${label} 링크는 http, https, mailto만 사용할 수 있습니다.`);
  }
}

function walkMarkedTokens(tokens: unknown[], visit: (token: Record<string, unknown>) => void) {
  for (const token of tokens) {
    if (!token || typeof token !== "object") continue;

    const record = token as Record<string, unknown>;
    visit(record);

    if (Array.isArray(record.tokens)) {
      walkMarkedTokens(record.tokens, visit);
    }

    if (Array.isArray(record.items)) {
      for (const item of record.items) {
        if (!item || typeof item !== "object") continue;
        const itemRecord = item as Record<string, unknown>;
        visit(itemRecord);

        if (Array.isArray(itemRecord.tokens)) {
          walkMarkedTokens(itemRecord.tokens, visit);
        }
      }
    }
  }
}

function collectMarkdownLinkTargets(value: string) {
  const tokens = markdownParser.lexer(value);
  const links: string[] = [];
  const disallowed: string[] = [];

  walkMarkedTokens(tokens, (token) => {
    const type = typeof token.type === "string" ? token.type : "";

    if (type === "heading") {
      disallowed.push("heading");
      return;
    }

    if (type === "html") {
      disallowed.push("html");
      return;
    }

    if (type === "table") {
      disallowed.push("table");
      return;
    }

    if (type === "image") {
      disallowed.push("image");
      return;
    }

    if (type === "list_item" && token.task === true) {
      disallowed.push("task");
      return;
    }

    if (type === "link" && typeof token.href === "string") {
      links.push(token.href);
    }
  });

  return {
    links,
    disallowed
  };
}

function countBareLinks(value: string) {
  const withoutMarkdownLinks = value.replace(/\[[^[\]]*]\(([^)]+)\)/g, " ");
  return withoutMarkdownLinks.match(/\b(?:https?:\/\/|mailto:)[^\s<>()]+/gi) ?? [];
}

function assertMarkdownStructure(value: string, label: string) {
  if (/<[a-z!/][^>]*>/i.test(value)) {
    throw new Error(`${label}에는 HTML 태그를 직접 넣을 수 없습니다.`);
  }

  const { disallowed } = collectMarkdownLinkTargets(value);

  if (disallowed.includes("heading")) {
    throw new Error(`${label}에는 제목(heading) 문법을 사용할 수 없습니다.`);
  }

  if (disallowed.includes("html")) {
    throw new Error(`${label}에는 HTML 문법을 사용할 수 없습니다.`);
  }

  if (disallowed.includes("table")) {
    throw new Error(`${label}에는 표 문법을 사용할 수 없습니다.`);
  }

  if (disallowed.includes("image")) {
    throw new Error(`${label}에는 본문 인라인 이미지를 사용할 수 없습니다.`);
  }

  if (disallowed.includes("task")) {
    throw new Error(`${label}에는 체크리스트 문법을 사용할 수 없습니다.`);
  }
}

export function normalizePlainTextInput(value: string) {
  return stripHtml(value).replace(/\s*\n+\s*/g, " ").replace(/\s+/g, " ").trim();
}

export function preparePlainTextField(value: string, policy: PlainTextPolicy) {
  const normalized = normalizePlainTextInput(value);

  if (!normalized) {
    if (policy.allowEmpty) {
      return "";
    }

    throw new Error(`${policy.label}을(를) 입력해 주세요.`);
  }

  if (policy.minLength && normalized.length < policy.minLength) {
    throw new Error(`${policy.label}은(는) ${policy.minLength}자 이상 입력해 주세요.`);
  }

  if (normalized.length > policy.maxLength) {
    throw new Error(`${policy.label}은(는) ${policy.maxLength}자 이하로 입력해 주세요.`);
  }

  return normalized;
}

export function validateMarkdownField(value: string, policy: MarkdownPolicy): MarkdownValidationResult {
  const normalized = normalizeWhitespace(value);

  if (!normalized) {
    if (policy.allowEmpty) {
      return {
        normalized: "",
        linkCount: 0
      };
    }

    throw new Error(`${policy.label}을(를) 입력해 주세요.`);
  }

  if (normalized.length > policy.maxLength) {
    throw new Error(`${policy.label}은(는) ${policy.maxLength}자 이하로 입력해 주세요.`);
  }

  assertMarkdownStructure(normalized, policy.label);

  const markdownLinks = collectMarkdownLinkTargets(normalized).links;

  for (const href of markdownLinks) {
    assertProtocol(href, policy.label);
  }

  const bareLinks = countBareLinks(normalized);

  for (const href of bareLinks) {
    assertProtocol(href, policy.label);
  }

  const linkCount = markdownLinks.length + bareLinks.length;

  if (linkCount > policy.maxLinks) {
    throw new Error(`${policy.label}에는 링크를 최대 ${policy.maxLinks}개까지만 넣을 수 있습니다.`);
  }

  return {
    normalized,
    linkCount
  };
}

export function prepareMarkdownField(value: string, policy: MarkdownPolicy) {
  return validateMarkdownField(value, policy).normalized;
}

export function renderMarkdownLite(value: string) {
  const normalized = normalizeWhitespace(value);
  const emptyAttributes: Record<string, string> = {};

  if (!normalized) {
    return "";
  }

  const rawHtml = markdownParser.parse(normalized);

  if (rawHtml instanceof Promise) {
    throw new Error("비동기 마크다운 파서는 현재 지원하지 않습니다.");
  }

  return sanitizeHtml(rawHtml, {
    allowedTags: allowedMarkdownTags,
    allowedAttributes: {
      a: ["href", "target", "rel"]
    },
    allowedSchemes,
    transformTags: {
      a: (_tagName, attrs) => {
        const href = typeof attrs.href === "string" ? attrs.href.trim() : "";

        if (!href) {
          return {
            tagName: "span",
            attribs: emptyAttributes,
            text: ""
          };
        }

        const protocolMatch = href.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
        const protocol = protocolMatch?.[1]?.toLowerCase();

        if (!protocol || !allowedSchemes.includes(protocol)) {
          return {
            tagName: "span",
            attribs: emptyAttributes,
            text: ""
          };
        }

        return {
          tagName: "a",
          attribs: {
            href,
            target: "_blank",
            rel: "nofollow ugc noopener noreferrer"
          }
        };
      }
    }
  });
}

export function safeRenderMarkdownLite(value: string) {
  try {
    return renderMarkdownLite(value);
  } catch {
    const fallback = normalizePlainTextInput(value);
    if (!fallback) {
      return "";
    }

    return sanitizeHtml(`<p>${fallback}</p>`, {
      allowedTags: ["p"],
      allowedAttributes: {}
    });
  }
}
