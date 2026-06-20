"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface LockCountdownProps {
  /** ISO timestamp of when the lock expires, or null if open-ended. */
  lockedUntil: string | null
}

function format(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":")
}

export function LockCountdown({ lockedUntil }: LockCountdownProps) {
  const router = useRouter()
  const targetMs = React.useMemo(
    () => (lockedUntil ? new Date(lockedUntil).getTime() : null),
    [lockedUntil]
  )

  const computeRemaining = React.useCallback(
    () => (targetMs === null ? null : targetMs - Date.now()),
    [targetMs]
  )

  const [remaining, setRemaining] = React.useState<number | null>(
    computeRemaining
  )

  React.useEffect(() => {
    if (targetMs === null) return
    const tick = () => setRemaining(targetMs - Date.now())
    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [targetMs])

  const isExpired = remaining !== null && remaining <= 0

  if (targetMs === null) {
    return (
      <p className="text-sm text-muted-foreground">
        Hubungi admin untuk membuka kembali akun Anda.
      </p>
    )
  }

  if (isExpired) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-foreground">
          Masa penguncian telah berakhir. Anda bisa melanjutkan.
        </p>
        <Button onClick={() => router.replace("/dashboard")}>
          Lanjut ke Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        Terbuka kembali dalam
      </p>
      <p
        className="font-mono text-4xl font-semibold text-foreground tabular-nums"
        role="timer"
        aria-live="off"
      >
        {format(remaining ?? 0)}
      </p>
    </div>
  )
}
