import Link from "next/link"
import { Clock, Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/dashboard/page-header"
import { AiAnalysisSection } from "@/components/simulation/ai-analysis-section"
import { formatDuration } from "@/lib/simulation"
import { getScoreCategory } from "@/lib/scoring"
import type { TestAttemptRow } from "@/types/user"

interface SectionTotals {
  listening: number
  structure: number
  reading: number
}

interface ResultViewProps {
  attempt: TestAttemptRow
  totals: SectionTotals
  initialAnalysis: string | null
}

function percent(raw: number | null, total: number): number {
  if (!raw || total <= 0) return 0
  return Math.min(100, Math.round((raw / total) * 100))
}

export function ResultView({
  attempt,
  totals,
  initialAnalysis,
}: ResultViewProps) {
  const total = attempt.total_score ?? 0
  const category = getScoreCategory(total)
  const duration =
    attempt.completed_at && attempt.started_at
      ? formatDuration(attempt.started_at, attempt.completed_at)
      : "—"

  const sections = [
    {
      key: "listening",
      label: "Listening",
      raw: attempt.listening_raw,
      converted: attempt.listening_converted,
      total: totals.listening,
    },
    {
      key: "structure",
      label: "Structure",
      raw: attempt.structure_raw,
      converted: attempt.structure_converted,
      total: totals.structure,
    },
    {
      key: "reading",
      label: "Reading",
      raw: attempt.reading_raw,
      converted: attempt.reading_converted,
      total: totals.reading,
    },
  ]

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Hasil Simulasi"
        title="Skor TOEFL ITP Anda"
        description="Skor resmi dikonversi ke skala 310–677."
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Total Skor
          </p>
          <p className="font-mono text-6xl font-semibold text-foreground tabular-nums">
            {total}
          </p>
          <Badge>{category}</Badge>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" />
            Durasi pengerjaan: {duration}
          </p>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.key}>
            <CardHeader>
              <CardTitle className="text-sm tracking-wide text-muted-foreground uppercase">
                {section.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-3xl font-semibold text-foreground tabular-nums">
                  {section.converted ?? "—"}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  scaled
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {section.raw ?? 0} / {section.total} benar
                  </span>
                  <span className="tabular-nums">
                    {percent(section.raw, section.total)}%
                  </span>
                </div>
                <Progress value={percent(section.raw, section.total)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <AiAnalysisSection
        attemptId={attempt.id}
        initialMarkdown={initialAnalysis}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" disabled>
          <Download />
          Download PDF
        </Button>
        <Button asChild>
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
