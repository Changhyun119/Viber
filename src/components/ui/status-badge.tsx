import { cn } from "@/lib/utils/cn";

type StatusBadgeProps = {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

const toneClassMap: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  default: "bg-[rgba(23,32,44,0.06)] text-foreground-muted",
  success: "bg-[rgba(47,106,97,0.12)] text-green",
  warning: "bg-[rgba(180,83,9,0.12)] text-warning",
  danger: "bg-[rgba(180,35,24,0.12)] text-danger",
  info: "bg-[rgba(96,104,153,0.12)] text-violet"
};

export function StatusBadge({ label, tone = "default" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide",
        toneClassMap[tone]
      )}
    >
      {label}
    </span>
  );
}
