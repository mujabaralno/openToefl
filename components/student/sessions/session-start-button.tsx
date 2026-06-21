"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, Maximize, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { startSimulationAction } from "@/server/actions/simulation"
import { type SessionStatus } from "@/lib/sessions"
import { type SessionAttempt } from "@/types/session"

interface SessionStartButtonProps {
  sessionId: string
  status: SessionStatus
  attempt: SessionAttempt | null
}

/** Request fullscreen, surfacing a toast if it's unsupported or rejected. */
async function enterFullscreen(): Promise<boolean> {
  const element = document.documentElement
  if (typeof element.requestFullscreen !== "function") {
    toast.error("Browser Anda tidak mendukung mode layar penuh. Gunakan desktop.")
    return false
  }
  try {
    await element.requestFullscreen()
    return true
  } catch {
    toast.error("Mode layar penuh ditolak. Izinkan layar penuh untuk memulai.")
    return false
  }
}

export function SessionStartButton({
  sessionId,
  status,
  attempt,
}: SessionStartButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  // Already finished → just view the result (no fullscreen needed).
  if (attempt && attempt.status === "completed") {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push(`/simulation/${attempt.id}/result`)}
      >
        <Eye />
        Lihat Hasil
      </Button>
    )
  }

  if (attempt && attempt.status === "violated") {
    return (
      <Button variant="outline" className="w-full" disabled>
        Pelanggaran terdeteksi
      </Button>
    )
  }

  // In-progress → resume into the current section, re-entering fullscreen.
  if (attempt && attempt.status === "in_progress") {
    const attemptId = attempt.id
    const section = attempt.currentSection ?? "listening"
    async function resume() {
      if (!(await enterFullscreen())) return
      router.push(`/simulation/${attemptId}/${section}`)
    }
    return (
      <Button className="w-full" disabled={isPending} onClick={resume}>
        <Play />
        Lanjutkan Simulasi
      </Button>
    )
  }

  // No attempt yet — only startable while the session is running.
  if (status !== "ongoing") {
    const label =
      status === "scheduled"
        ? "Belum dimulai"
        : status === "ended"
          ? "Sesi berakhir"
          : "Sesi nonaktif"
    return (
      <Button variant="outline" className="w-full" disabled>
        {label}
      </Button>
    )
  }

  function start() {
    startTransition(async () => {
      if (!(await enterFullscreen())) return
      const result = await startSimulationAction(sessionId)
      if (result.success && result.attemptId) {
        router.push(`/simulation/${result.attemptId}/listening`)
      } else {
        toast.error(result.message ?? "Gagal memulai simulasi.")
        if (document.fullscreenElement) {
          await document.exitFullscreen().catch(() => {})
        }
      }
    })
  }

  return (
    <Button className="w-full" disabled={isPending} onClick={start}>
      <Maximize />
      {isPending ? "Menyiapkan tes…" : "Mulai Simulasi"}
    </Button>
  )
}
