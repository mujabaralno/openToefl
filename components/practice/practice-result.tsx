import Link from "next/link"
import { Check, X } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { parseOptions, sectionLabels } from "@/lib/questions"
import { ANSWER_KEYS } from "@/lib/validations/question"
import type { PracticeAttemptRow, PracticeItem } from "@/types/practice"

interface PracticeResultProps {
  attempt: PracticeAttemptRow
  items: PracticeItem[]
}

export function PracticeResult({ attempt, items }: PracticeResultProps) {
  const score = attempt.score_percentage ?? 0
  const correct = attempt.correct_count ?? 0

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {sectionLabels[attempt.section]}
          </p>
          <p className="font-mono text-5xl font-semibold text-foreground tabular-nums">
            {score}%
          </p>
          <p className="text-sm text-muted-foreground">
            {correct} dari {attempt.total_questions} benar
          </p>
          <Progress value={score} className="max-w-xs" />
        </CardContent>
      </Card>

      <Accordion
        type="single"
        collapsible
        className="rounded-xl border border-border bg-card px-4"
      >
        {items.map((item, index) => {
          const options = parseOptions(item.question.options)
          return (
            <AccordionItem key={item.question.id} value={item.question.id}>
              <AccordionTrigger>
                <span className="flex flex-1 items-center gap-2">
                  <span className="font-mono text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span className="line-clamp-1 text-left">
                    {item.question.section === "listening"
                      ? `Soal ${index + 1}`
                      : item.question.question_text || `Soal ${index + 1}`}
                  </span>
                </span>
                <Badge
                  variant={item.isCorrect ? "secondary" : "destructive"}
                  className="ml-auto mr-2"
                >
                  {item.isCorrect ? "Benar" : "Salah"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3">
                {item.question.section === "listening" &&
                  item.question.audio_url && (
                    <audio
                      controls
                      src={item.question.audio_url}
                      className="w-full"
                    >
                      Browser Anda tidak mendukung pemutar audio.
                    </audio>
                  )}
                <ul className="flex flex-col gap-1.5">
                  {ANSWER_KEYS.map((key) => {
                    const isCorrect = key === item.question.correct_answer
                    const isSelected = key === item.selectedAnswer
                    return (
                      <li
                        key={key}
                        className={cn(
                          "flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm",
                          isCorrect && "border-primary bg-primary/5",
                          isSelected &&
                            !isCorrect &&
                            "border-destructive bg-destructive/5"
                        )}
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {key}
                        </span>
                        <span className="flex-1 text-foreground">
                          {options[key]}
                        </span>
                        {isCorrect && (
                          <Check
                            className="size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                        )}
                        {isSelected && !isCorrect && (
                          <X
                            className="size-4 shrink-0 text-destructive"
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    )
                  })}
                </ul>

                {item.selectedAnswer === null && (
                  <p className="text-xs text-muted-foreground">
                    Soal ini tidak dijawab.
                  </p>
                )}

                {item.question.explanation && (
                  <div className="rounded-lg border border-border p-3">
                    <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      Penjelasan
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.question.explanation}
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href="/practice">Latihan lagi</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
