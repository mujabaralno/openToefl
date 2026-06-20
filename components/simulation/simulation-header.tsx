"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { QuestionNavigator } from "@/components/simulation/question-navigator"
import { TimerBadge } from "@/components/simulation/timer-badge"
import type { QuestionRow } from "@/types/question"
import type { SimulationState } from "@/types/simulation"

interface SimulationHeaderProps {
  sectionLabel: string
  isLastSection: boolean
  seconds: number
  answeredCount: number
  questions: QuestionRow[]
  answers: SimulationState["answers"]
  currentIndex: number
  onJump: (index: number) => void
  onFinish: () => void
  isFinishing: boolean
}

export function SimulationHeader({
  sectionLabel,
  isLastSection,
  seconds,
  answeredCount,
  questions,
  answers,
  currentIndex,
  onJump,
  onFinish,
  isFinishing,
}: SimulationHeaderProps) {
  const total = questions.length

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 sm:px-6">
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Simulasi TOEFL ITP
        </span>
        <span className="truncate font-medium text-foreground">
          {sectionLabel}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:inline">
          {answeredCount}/{total} terjawab
        </span>
        <TimerBadge seconds={seconds} />
        <QuestionNavigator
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          onJump={onJump}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={isFinishing}>
              {isLastSection ? "Selesai Tes" : "Selesai Seksi"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isLastSection ? "Selesaikan tes?" : "Selesaikan seksi ini?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isLastSection
                  ? "Tes akan disubmit dan tidak bisa diubah lagi."
                  : "Anda tidak bisa kembali ke seksi ini setelah lanjut. Pastikan semua jawaban sudah diisi."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isFinishing}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isFinishing}
                onClick={(event) => {
                  event.preventDefault()
                  onFinish()
                }}
              >
                {isFinishing
                  ? "Memproses…"
                  : isLastSection
                    ? "Selesai Tes"
                    : "Lanjut"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  )
}
