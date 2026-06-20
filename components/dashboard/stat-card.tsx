import { type LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  label: string
  /** The metric value. Omit (or pass null) to show a placeholder em-dash. */
  value?: string | number | null
  /** Supporting line under the value. */
  hint?: string
  icon: LucideIcon
  /** Render skeletons instead of values while data is loading. */
  loading?: boolean
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  loading = false,
}: StatCardProps) {
  const displayValue =
    value === null || value === undefined || value === "" ? "—" : value

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </CardTitle>
        <Icon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="font-mono text-3xl leading-none font-semibold text-foreground tabular-nums">
            {displayValue}
          </p>
        )}
        {loading ? (
          <Skeleton className="mt-1 h-3 w-28" />
        ) : (
          hint && <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </CardContent>
    </Card>
  )
}
