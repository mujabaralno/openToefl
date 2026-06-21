import { cn } from "@/lib/utils";

interface StatusDotProps {
  className?: string;
  /** Hue of the dot. "active" = live (green-blue), "warning" = paused (amber). */
  tone?: "active" | "warning";
}

export function StatusDot({ className, tone = "active" }: StatusDotProps) {
  const color =
    tone === "warning"
      ? "bg-[hsl(var(--status-warning))]"
      : "bg-[hsl(var(--status-active))]";

  return (
    <span className="relative flex h-2 w-2">
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
          color,
          className
        )}
      />
      <span
        className={cn("relative inline-flex h-2 w-2 rounded-full", color, className)}
      />
    </span>
  );
}
