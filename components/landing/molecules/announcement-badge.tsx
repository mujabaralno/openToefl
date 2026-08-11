import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AnnouncementBadgeProps {
  label: string;
  className?: string;
}

export function AnnouncementBadge({ label, className }: AnnouncementBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-2 rounded-md border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-none",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      {label}
    </Badge>
  );
}
