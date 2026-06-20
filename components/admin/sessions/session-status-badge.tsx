import { Badge } from "@/components/ui/badge"
import { sessionStatusLabels, type SessionStatus } from "@/lib/sessions"

const statusVariant: Record<
  SessionStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  ongoing: "default",
  scheduled: "secondary",
  ended: "outline",
  inactive: "outline",
}

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return (
    <Badge variant={statusVariant[status]}>{sessionStatusLabels[status]}</Badge>
  )
}
