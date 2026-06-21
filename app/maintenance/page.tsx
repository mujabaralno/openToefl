import { type Metadata } from "next"
import { Wrench } from "lucide-react"

import { StatusDot } from "@/components/landing/atoms/status-dot"
import { getAppSettingsRow } from "@/server/queries/app-settings"

export const metadata: Metadata = {
  title: "Sedang Maintenance | PTESOL",
  description: "PTESOL sedang dalam pemeliharaan.",
}

const DEFAULT_MESSAGE =
  "PTESOL sedang kami siapkan kembali. Halaman ini akan otomatis aktif lagi setelah selesai — silakan kembali beberapa saat lagi."

export default async function MaintenancePage() {
  const settings = await getAppSettingsRow()
  const message = settings?.maintenance_message?.trim() || DEFAULT_MESSAGE
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      {/* Brand grid — the same radial-masked lattice as the landing hero. */}
      <div
        className="bg-grid-pattern pointer-events-none absolute inset-0 -z-10 opacity-50"
        aria-hidden="true"
      />

      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Signature: the landing's live-status pill, inverted to "paused". */}
        <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
          <StatusDot tone="warning" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pemeliharaan Sistem
          </span>
        </span>

        <div className="mt-10 flex size-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <Wrench className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>

        <h1 className="mt-8 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Sebentar lagi kembali
        </h1>

        <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
          {message}
        </p>

        {/* Quiet brand stamp — the exam-room-calm mono micro-label, not a footer. */}
        <div className="mt-12 flex w-full flex-col items-center gap-3">
          <span className="h-px w-12 bg-border" aria-hidden="true" />
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            PTESOL · Simulasi TOEFL ITP
          </p>
          {supportEmail && (
            <a
              href={`mailto:${supportEmail}`}
              className="rounded-sm text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Butuh bantuan? Hubungi admin
            </a>
          )}
        </div>
      </div>
    </main>
  )
}
