import { cn } from "@/lib/utils";

interface StatusDotProps {
  className?: string;
}

export function StatusDot({ className }: StatusDotProps) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          "bg-[hsl(var(--status-active))]",
          className
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          "bg-[hsl(var(--status-active))]",
          className
        )}
      />
    </span>
  );
}
