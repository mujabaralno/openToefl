"use client"

import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatClock } from "@/lib/simulation"

interface TimerBadgeProps {
  seconds: number
  /** Below this, the badge turns destructive to signal time is nearly up. */
  lowThresholdSeconds?: number
}

export function TimerBadge({
  seconds,
  lowThresholdSeconds = 120,
}: TimerBadgeProps) {
  // Visually flag the final stretch without leaving the token system.
  const isLow = seconds <= lowThresholdSeconds

  return (
    <div
      role="timer"
      aria-live="off"
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-sm font-medium tabular-nums",
        isLow && "border-destructive text-destructive"
      )}
    >
      <Clock className="size-4" aria-hidden="true" />
      {formatClock(seconds)}
    </div>
  )
}
