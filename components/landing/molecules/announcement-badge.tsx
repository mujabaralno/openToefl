import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/landing/atoms/status-dot";

interface AnnouncementBadgeProps {
  label: string;
  className?: string;
}

export function AnnouncementBadge({ label, className }: AnnouncementBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-border px-4 py-1.5 shadow-sm transition-colors hover:border-primary/30",
        "bg-card",
        className
      )}
    >
      <StatusDot />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
