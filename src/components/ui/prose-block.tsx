import { safeRenderMarkdownLite } from "@/lib/content/markdown";

type ProseBlockProps = {
  value: string;
  muted?: boolean;
};

export function ProseBlock({ value, muted = false }: ProseBlockProps) {
  const html = safeRenderMarkdownLite(value);

  if (!html) {
    return null;
  }

  return (
    <div
      className={
        muted
          ? "prose-block prose-block-muted text-sm leading-7 text-foreground-muted"
          : "prose-block text-sm leading-7 text-foreground md:text-base"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
