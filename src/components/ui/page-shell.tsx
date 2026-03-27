import { cn } from "@/lib/utils/cn";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("mx-auto flex w-full max-w-[1180px] flex-col gap-10 px-4 py-8 md:py-10", className)}>{children}</div>;
}
