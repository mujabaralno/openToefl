"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Maximize, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { startSimulationAction } from "@/server/actions/simulation"

export function SimulationStartButton() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  async function handleStart() {
    setError(null)

    const element = document.documentElement
    if (typeof element.requestFullscreen !== "function") {
      setError(
        "Browser Anda tidak mendukung mode layar penuh. Gunakan desktop dengan browser terbaru."
      )
      return
    }

    try {
      await element.requestFullscreen()
    } catch {
      setError(
        "Mode layar penuh ditolak. Izinkan layar penuh untuk memulai tes."
      )
      return
    }

    startTransition(async () => {
      const result = await startSimulationAction()
      if (result.success && result.attemptId) {
        router.push(`/simulation/${result.attemptId}/listening`)
      } else {
        setError(result.message ?? "Gagal memulai tes.")
        if (document.fullscreenElement) {
          await document.exitFullscreen().catch(() => {})
        }
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      <Button size="lg" onClick={handleStart} disabled={isPending} className="w-fit">
        <Maximize />
        {isPending ? "Menyiapkan tes…" : "Mulai Test"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Tes berjalan dalam mode layar penuh. Keluar dari layar penuh dapat
        dianggap pelanggaran.
      </p>
    </div>
  )
}
