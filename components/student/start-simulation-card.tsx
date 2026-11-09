import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

// Tombol utama gaya pixel (lime, border ink, bayangan keras, efek pressed)
const primaryButtonClass = cn(
  "h-14 rounded-none border-3 border-primary-foreground bg-primary px-6 text-primary-foreground shadow-sm",
  "font-mono text-sm font-bold tracking-wider uppercase transition-transform",
  "hover:-translate-x-px hover:-translate-y-px hover:bg-primary hover:shadow",
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs",
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring"
)

/**
 * Primary action on the student dashboard: a compact "exam slip" laying out
 * the authentic TOEFL ITP format, with the call to start a full simulation.
 */
export function StartSimulationCard() {
  return (
    <Card className="rounded-none border-4 border-border shadow">
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-5 lg:max-w-xl lg:flex-1">
          <div className="flex flex-col gap-3">
            <p className="self-start border-2 border-primary-foreground bg-primary px-2 py-1 font-mono text-[11px] leading-none font-bold tracking-wider text-primary-foreground uppercase">
              Simulasi Penuh
            </p>
            <h2 className="font-serif text-sm leading-snug text-foreground sm:text-base">
              Mulai simulasi TOEFL ITP
            </h2>
            <p className="text-xl leading-tight text-muted-foreground">
              Tiga seksi berurutan dengan timer ketat dan mode layar penuh,
              persis format resmi ETS.
            </p>
          </div>

          {/* "Exam slip": tabel kecil format ujian */}
          <dl className="flex flex-col border-3 border-border bg-card">
            {sections.map((section) => (
              <div
                key={section.name}
                className="flex items-center justify-between gap-4 border-b-2 border-border/30 px-3 py-2.5"
              >
                <dt className="font-mono text-xs font-bold text-foreground">
                  {section.name}
                </dt>
                <dd className="shrink-0 text-lg leading-none tabular-nums text-muted-foreground">
                  {section.questions} soal · {section.minutes} mnt
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 bg-muted px-3 py-2.5">
              <dt className="font-mono text-xs font-bold text-foreground">
                Total
              </dt>
              <dd className="shrink-0 text-lg leading-none font-bold tabular-nums text-foreground">
                {totalQuestions} soal · {totalMinutes} mnt
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 lg:flex-col lg:items-end">
          <Button asChild size="lg" className={primaryButtonClass}>
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