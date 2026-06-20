"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnswerOptions } from "@/components/simulation/answer-options"
import { TimerBadge } from "@/components/simulation/timer-badge"
import { submitPracticeAction } from "@/server/actions/practice"
import type { AnswerKey } from "@/types/question"
import type { PracticeItem } from "@/types/practice"

interface PracticeRunnerProps {
  attemptId: string
  items: PracticeItem[]
  durationSeconds: number | null
}

export function PracticeRunner({
  attemptId,
  items,
  durationSeconds,
}: PracticeRunnerProps) {
  const router = useRouter()
  const [answers, setAnswers] = React.useState<Record<string, AnswerKey>>({})
  const [seconds, setSeconds] = React.useState(durationSeconds ?? 0)
  const [isSubmitting, startSubmit] = React.useTransition()
  const answersRef = React.useRef<Record<string, AnswerKey>>({})
  const submittingRef = React.useRef(false)
  const deadlineRef = React.useRef(0)

  const submit = React.useCallback(() => {
    if (submittingRef.current) return
    submittingRef.current = true
    startSubmit(async () => {
      try {
        const result = await submitPracticeAction(attemptId, answersRef.current)
        if (result.success) {
          router.refresh()
        } else {
          toast.error(result.message ?? "Gagal menyimpan latihan.")
          submittingRef.current = false
        }
      } catch {
        toast.error("Terjadi kesalahan sistem.")
        submittingRef.current = false
      }
    })
  }, [attemptId, router])

  React.useEffect(() => {
    answersRef.current = answers
  }, [answers])

  React.useEffect(() => {
    if (!durationSeconds) return
    deadlineRef.current = Date.now() + durationSeconds * 1000
    const id = window.setInterval(() => {
      const remaining = Math.ceil((deadlineRef.current - Date.now()) / 1000)
      if (remaining > 0) {
        setSeconds(remaining)
        return
      }
      window.clearInterval(id)
      setSeconds(0)
      submit()
    }, 1000)
    return () => window.clearInterval(id)
  }, [durationSeconds, submit])

  const answeredCount = Object.keys(answers).length

  return (
    <div className="flex flex-col gap-4">
      {durationSeconds ? (
        <div className="sticky top-16 z-10 flex items-center justify-between gap-3 rounded-lg border border-border bg-background/95 px-3 py-2 backdrop-blur supports-backdrop-filter:bg-background/80">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {answeredCount} / {items.length} terjawab
          </span>
          <TimerBadge seconds={seconds} lowThresholdSeconds={30} />
        </div>
      ) : (
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {answeredCount} / {items.length} terjawab · tanpa batas waktu
        </p>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <Card key={item.question.id}>
            <CardContent className="flex flex-col gap-4">
              <p className="leading-relaxed font-medium text-foreground">
                <span className="mr-2 font-mono text-muted-foreground">
                  {index + 1}.
                </span>
                {item.question.section === "listening"
                  ? "Dengarkan audio, lalu pilih jawaban."
                  : item.question.question_text}
              </p>
              {item.question.section === "listening" && item.question.audio_url && (
                <audio
                  controls
                  src={item.question.audio_url}
                  className="w-full"
                >
                  Browser Anda tidak mendukung pemutar audio.
                </audio>
              )}
              <AnswerOptions
                question={item.question}
                selected={answers[item.question.id]}
                onSelect={(answer) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [item.question.id]: answer,
                  }))
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={submit} disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Menilai…" : "Selesai & lihat hasil"}
      </Button>
    </div>
  )
}
