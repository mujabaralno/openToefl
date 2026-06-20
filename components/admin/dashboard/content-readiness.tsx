import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SECTION_CONFIG, SECTION_ORDER } from "@/lib/simulation"
import type { QuestionSection } from "@/types/question"

interface ContentReadinessProps {
  sectionCounts: Record<QuestionSection, number>
}

/**
 * How ready the question bank is to run a full simulation, per section. Turns an
 * empty bank into a clear next step instead of a blank panel.
 */
export function ContentReadiness({ sectionCounts }: ContentReadinessProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kesiapan bank soal</CardTitle>
        <CardDescription>
          Soal aktif per seksi terhadap kebutuhan satu simulasi penuh.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {SECTION_ORDER.map((section) => {
          const count = sectionCounts[section]
          const target = SECTION_CONFIG[section].questionCount
          const pct = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0
          const ready = count >= target

          return (
            <div key={section} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-foreground">
                  {SECTION_CONFIG[section].label}
                </span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {count} / {target}
                </span>
              </div>
              <Progress value={pct} />
              <div className="min-h-5">
                {ready ? (
                  <Badge variant="secondary">Siap</Badge>
                ) : (
                  <span className="font-mono text-[11px] tracking-wide text-muted-foreground">
                    kurang {target - count} soal
                  </span>
                )}
              </div>
            </div>
          )
        })}

        <Button asChild variant="outline" className="w-fit">
          <Link href="/admin/questions">
            Kelola soal
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
