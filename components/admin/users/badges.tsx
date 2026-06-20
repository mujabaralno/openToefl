import { Badge } from "@/components/ui/badge"
import { accountStatusLabels, roleLabels } from "@/lib/users"
import type { Enums } from "@/types/database.types"
import type { AccountStatus } from "@/types/user"

export function RoleBadge({ role }: { role: Enums<"user_role"> }) {
  return (
    <Badge variant={role === "admin" ? "default" : "secondary"}>
      {roleLabels[role]}
    </Badge>
  )
}

const statusVariant: Record<
  AccountStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  active: "secondary",
  locked: "destructive",
  disabled: "outline",
}

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <Badge variant={statusVariant[status]}>{accountStatusLabels[status]}</Badge>
  )
}
