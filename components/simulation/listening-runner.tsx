"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Play, Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AnswerOptions } from "@/components/simulation/answer-options"
import { TimerBadge } from "@/components/simulation/timer-badge"
import { useListeningSession } from "@/hooks/use-listening-session"
import { finishSectionAction } from "@/server/actions/simulation"
import { SECTION_CONFIG } from "@/lib/simulation"
import type { AnswerKey, QuestionRow } from "@/types/question"

interface ListeningRunnerProps {
  attemptId: string
  /** Questions already ordered (Part A, then B & C grouped). */
  questions: QuestionRow[]
}

/**
 * Listening engine: each question's audio plays once (no controls / replay),
 * then a fixed answer window counts down and auto-advances. Only the options
 * are shown — the question is spoken. Strictly linear.
 */
export function ListeningRunner({ attemptId, questions }: ListeningRunnerProps) {
  const router = useRouter()
  const [isFinishing, startFinish] = React.useTransition()
  const finishingRef = React.useRef(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const answersRef = React.useRef<Record<string, AnswerKey>>({})
  const [needsManualPlay, setNeedsManualPlay] = React.useState(false)

  const finish = React.useCallback(() => {
    if (finishingRef.current) return
    finishingRef.current = true
    startFinish(async () => {
      try {
        const result = await finishSectionAction(
          attemptId,
          "listening",
          answersRef.current
        )
        if (result.success && result.nextHref) {
          router.push(result.nextHref)
        } else {
          toast.error(result.message ?? "Gagal melanjutkan.")
          finishingRef.current = false
        }
      } catch {
        toast.error("Terjadi kesalahan sistem.")
        finishingRef.current = false
      }
    })
  }, [attemptId, router])

  const {
    index,
    total,
    currentQuestion,
    phase,
    answerSeconds,
    answers,
    setAnswer,
    handleAudioEnded,
  } = useListeningSession(questions, finish)

  // Keep the latest answers available to the (stable) finish callback.
  React.useEffect(() => {
    answersRef.current = answers
  }, [answers])

  if (questions.length === 0) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">
          Belum ada soal aktif untuk seksi Listening.
        </p>
        <Button onClick={finish} disabled={isFinishing}>
          Lanjut ke seksi berikutnya
        </Button>
      </div>
    )
  }

  if (!currentQuestion) return null

  function attemptPlay(element: HTMLAudioElement) {
    element
      .play()
      .then(() => setNeedsManualPlay(false))
      .catch(() => setNeedsManualPlay(true))
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-col">
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Simulasi TOEFL ITP
          </span>
          <span className="truncate font-medium text-foreground">
            {SECTION_CONFIG.listening.label}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            Soal {index + 1} / {total}
          </span>
          {phase === "playing" ? (
            <span className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm text-muted-foreground">
              <Volume2 className="size-4" aria-hidden="true" />
              Memutar
            </span>
          ) : (
            <TimerBadge seconds={answerSeconds} lowThresholdSeconds={5} />
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          <p className="text-sm text-muted-foreground">
            {phase === "playing"
              ? "Dengarkan audio. Audio tidak bisa diulang."
              : "Pilih jawaban yang paling tepat."}
          </p>

          {needsManualPlay && currentQuestion.audio_url && (
            <Button
              className="w-fit"
              onClick={() => audioRef.current && attemptPlay(audioRef.current)}
            >
              <Play />
              Putar Audio
            </Button>
          )}

          <AnswerOptions
            question={currentQuestion}
            selected={answers[currentQuestion.id]}
            onSelect={(answer) => setAnswer(currentQuestion.id, answer)}
          />

          {currentQuestion.audio_url && (
            <audio
              ref={audioRef}
              key={currentQuestion.id}
              src={currentQuestion.audio_url}
              autoPlay
              onCanPlay={(event) => attemptPlay(event.currentTarget)}
              onEnded={handleAudioEnded}
              onError={handleAudioEnded}
              className="sr-only"
            />
          )}
        </div>
      </main>
    </div>
  )
}
