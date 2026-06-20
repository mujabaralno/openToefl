import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SectionLine {
  name: string
  questions: number
  minutes: number
}

const sections: SectionLine[] = [
  { name: "Listening Comprehension", questions: 50, minutes: 35 },
  { name: "Structure & Written Expression", questions: 40, minutes: 25 },
  { name: "Reading Comprehension", questions: 50, minutes: 55 },
]

const totalQuestions = sections.reduce((sum, s) => sum + s.questions, 0)
const totalMinutes = sections.reduce((sum, s) => sum + s.minutes, 0)

/**
 * Primary action on the student dashboard: a compact "exam slip" laying out
 * the authentic TOEFL ITP format, with the call to start a full simulation.
 */
export function StartSimulationCard() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Simulasi Penuh
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Mulai simulasi TOEFL ITP
            </h2>
            <p className="text-sm text-muted-foreground">
              Tiga seksi berurutan dengan timer ketat dan mode layar penuh,
              persis format resmi ETS.
            </p>
          </div>

          <dl className="flex flex-col divide-y divide-border border-y border-border font-mono text-xs">
            {sections.map((section) => (
              <div
                key={section.name}
                className="flex items-center justify-between gap-4 py-2"
              >
                <dt className="text-foreground">{section.name}</dt>
                <dd className="shrink-0 tabular-nums text-muted-foreground">
                  {section.questions} soal · {section.minutes} mnt
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 py-2 font-semibold">
              <dt className="text-foreground">Total</dt>
              <dd className="shrink-0 tabular-nums text-foreground">
                {totalQuestions} soal · {totalMinutes} mnt
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 lg:flex-col lg:items-end">
          <Button asChild size="lg">
            <Link href="/simulation">
              Mulai Simulasi
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
