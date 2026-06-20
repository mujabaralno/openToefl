"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { QuestionDisplay } from "@/components/simulation/question-display"
import { SimulationHeader } from "@/components/simulation/simulation-header"
import { useSimulationGuard } from "@/components/simulation/simulation-guard-context"
import { useSimulationSection } from "@/hooks/use-simulation-section"
import { finishSectionAction } from "@/server/actions/simulation"
import { SECTION_CONFIG, getNextSection } from "@/lib/simulation"
import type {
  AnswerKey,
  PassageRow,
  QuestionRow,
  QuestionSection,
} from "@/types/question"

interface SectionRunnerProps {
  attemptId: string
  section: QuestionSection
  questions: QuestionRow[]
  passages: PassageRow[]
  initialSeconds: number
}

export function SectionRunner({
  attemptId,
  section,
  questions,
  passages,
  initialSeconds,
}: SectionRunnerProps) {
  const router = useRouter()
  const guard = useSimulationGuard()
  const [isFinishing, startFinish] = React.useTransition()
  const isLastSection = getNextSection(section) === null
  const answersRef = React.useRef<Record<string, AnswerKey>>({})

  const passagesById = React.useMemo(
    () => new Map(passages.map((passage) => [passage.id, passage])),
    [passages]
  )

  const finish = React.useCallback(() => {
    startFinish(async () => {
      try {
        const result = await finishSectionAction(
          attemptId,
          section,
          answersRef.current
        )
        if (result.success && result.nextHref) {
          if (isLastSection) {
            // Test is over: stop anti-cheat before we exit fullscreen ourselves,
            // otherwise the exit would be flagged as a violation.
            guard.disarm()
            if (
              typeof document !== "undefined" &&
              document.fullscreenElement
            ) {
              await document.exitFullscreen().catch(() => {})
            }
          }
          router.push(result.nextHref)
        } else {
          toast.error(result.message ?? "Gagal melanjutkan.")
        }
      } catch {
        toast.error("Terjadi kesalahan sistem.")
      }
    })
  }, [attemptId, section, router, guard, isLastSection])

  const { state, currentQuestion, total, answeredCount, setAnswer, goTo, next, previous } =
    useSimulationSection(questions, initialSeconds, finish)

  // Keep the latest answers available to the (stable) finish callback.
  React.useEffect(() => {
    answersRef.current = state.answers
  }, [state.answers])

  if (questions.length === 0) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">
          Belum ada soal aktif untuk seksi {SECTION_CONFIG[section].shortLabel}.
        </p>
        <Button onClick={finish} disabled={isFinishing}>
          {isLastSection ? "Selesai Tes" : "Lanjut ke seksi berikutnya"}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SimulationHeader
        sectionLabel={SECTION_CONFIG[section].label}
        isLastSection={isLastSection}
        seconds={state.timeRemainingSeconds}
        answeredCount={answeredCount}
        questions={questions}
        answers={state.answers}
        currentIndex={state.currentQuestionIndex}
        onJump={goTo}
        onFinish={finish}
        isFinishing={isFinishing}
      />

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-5xl">
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              passage={
                currentQuestion.passage_id
                  ? passagesById.get(currentQuestion.passage_id)
                  : undefined
              }
              questionNumber={state.currentQuestionIndex + 1}
              selected={state.answers[currentQuestion.id]}
              onSelect={(answer) => setAnswer(currentQuestion.id, answer)}
            />
          )}
        </div>
      </main>

      <footer className="flex items-center justify-between gap-3 border-t border-border bg-background px-4 py-3 sm:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={previous}
          disabled={state.currentQuestionIndex === 0}
        >
          <ChevronLeft />
          Sebelumnya
        </Button>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          Soal {state.currentQuestionIndex + 1} / {total}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={next}
          disabled={state.currentQuestionIndex >= total - 1}
        >
          Berikutnya
          <ChevronRight />
        </Button>
      </footer>
    </div>
  )
}
