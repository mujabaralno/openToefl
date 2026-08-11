import { cn } from "@/lib/utils";

interface StatusDotProps {
  className?: string;
  tone?: "active" | "warning";
}

export function StatusDot({ className, tone = "active" }: StatusDotProps) {
  const color =
    tone === "warning"
      ? "bg-[hsl(var(--status-warning))]"
      : "bg-[hsl(var(--status-active))]";

  return <span className={cn("inline-flex size-2 rounded-full", color, className)} />;
}
