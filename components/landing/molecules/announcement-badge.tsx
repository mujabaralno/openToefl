import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface AnnouncementBadgeProps {
  label: string
  className?: string
}

export function AnnouncementBadge({ label, className }: AnnouncementBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex h-auto items-center gap-2 rounded-none border border-border bg-card px-3 py-2 font-mono text-[9px] text-card-foreground sm:text-[10px]",
        className
      )}
    >
      <span className="size-2 border border-border bg-primary" aria-hidden="true" />
      {label}
    </Badge>
  )
}
