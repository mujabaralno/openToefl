import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/** Warna tile ikon, sama dengan empat StatCard di design system dashboard. */
type StatTone = "purple" | "blue" | "green" | "amber"

const tones: Record<StatTone, { tile: string; dot: string }> = {
  purple: { tile: "bg-violet-200 dark:bg-violet-900", dot: "bg-violet-500" },
  blue: { tile: "bg-blue-200 dark:bg-blue-900", dot: "bg-sky-500" },
  green: { tile: "bg-emerald-200 dark:bg-emerald-900", dot: "bg-emerald-500" },
  amber: { tile: "bg-amber-200 dark:bg-amber-900", dot: "bg-amber-500" },
}

interface StatCardProps {
  label: string
  /** The metric value. Omit (or pass null) to show a placeholder em-dash. */
  value?: string | number | null
  /** Supporting line under the value. */
  hint?: string
  icon: LucideIcon
  /** Warna tile ikon dan penanda hint. Default: purple. */
  tone?: StatTone
  /** Render skeletons instead of values while data is loading. */
  loading?: boolean
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "purple",
  loading = false,
}: StatCardProps) {
  const displayValue =
    value === null || value === undefined || value === "" ? "—" : value

  return (
    <Card className="gap-3 rounded-none border-4 border-border py-4 shadow">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 px-4">
        <CardTitle className="font-mono text-xs leading-none font-bold tracking-normal text-muted-foreground uppercase">
          {label}
        </CardTitle>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center border-2 border-border text-foreground",
            tones[tone].tile
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        {loading ? (
          <Skeleton className="h-9 w-24 rounded-none border-2 border-border/30 bg-muted" />
        ) : (
          <p className="font-serif text-[32px] leading-none text-foreground tabular-nums">
            {displayValue}
          </p>
        )}
        {loading ? (
          <div className="border-t-2 border-border/30 pt-2">
            <Skeleton className="h-4 w-28 rounded-none border-2 border-border/30 bg-muted" />
          </div>
        ) : (
          hint && (
            <p className="flex items-center gap-2 border-t-2 border-border/30 pt-2 text-lg leading-tight text-muted-foreground">
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0", tones[tone].dot)}
              />
              {hint}
            </p>
          )
        )}
      </CardContent>
    </Card>
  )
}