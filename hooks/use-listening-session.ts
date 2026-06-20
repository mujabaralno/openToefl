"use client"

import * as React from "react"

import { LISTENING_SECONDS_PER_QUESTION } from "@/lib/simulation"
import type { AnswerKey, QuestionRow } from "@/types/question"

/** "playing" = audio is playing; "answering" = audio done, answer window ticking. */
export type ListeningPhase = "playing" | "answering"

interface UseListeningSession {
  index: number
  total: number
  currentQuestion: QuestionRow | undefined
  phase: ListeningPhase
  answerSeconds: number
  answers: Record<string, AnswerKey>
  setAnswer: (questionId: string, answer: AnswerKey) => void
  /** Called by the audio element when playback finishes (or fails). */
  handleAudioEnded: () => void
}

/**
 * A question waits for its audio to finish before the timer starts ONLY for
 * Part B/C (grouped). Part A runs the timer immediately with the audio playing
 * alongside.
 */
function gatesOnAudio(question: QuestionRow | undefined): boolean {
  return Boolean(question?.group_id && question.audio_url)
}

/**
 * Walks listening questions one at a time, auto-advancing when the per-question
 * window ends. Part A: timer starts immediately (audio plays alongside).
 * Part B/C: audio plays first, then the timer starts. Linear — no manual nav.
 */
export function useListeningSession(
  questions: QuestionRow[],
  onComplete: () => void
): UseListeningSession {
  const startsAnswering = !gatesOnAudio(questions[0])

  const [index, setIndex] = React.useState(0)
  const [phase, setPhase] = React.useState<ListeningPhase>(
    startsAnswering ? "answering" : "playing"
  )
  const [answerSeconds, setAnswerSeconds] = React.useState(
    LISTENING_SECONDS_PER_QUESTION
  )
  const [answers, setAnswers] = React.useState<Record<string, AnswerKey>>({})

  const indexRef = React.useRef(0)
  const phaseRef = React.useRef<ListeningPhase>(
    startsAnswering ? "answering" : "playing"
  )
  const deadlineRef = React.useRef(0)
  const completedRef = React.useRef(false)

  // If the first question has no audio, start its answer window on mount.
  React.useEffect(() => {
    if (startsAnswering) {
      deadlineRef.current = Date.now() + LISTENING_SECONDS_PER_QUESTION * 1000
    }
  }, [startsAnswering])

  const beginAnswering = React.useCallback(() => {
    phaseRef.current = "answering"
    deadlineRef.current = Date.now() + LISTENING_SECONDS_PER_QUESTION * 1000
    setPhase("answering")
    setAnswerSeconds(LISTENING_SECONDS_PER_QUESTION)
  }, [])

  const goToQuestion = React.useCallback(
    (nextIndex: number) => {
      indexRef.current = nextIndex
      setIndex(nextIndex)
      if (gatesOnAudio(questions[nextIndex])) {
        // Part B/C: wait for the audio to finish before the timer starts.
        phaseRef.current = "playing"
        setPhase("playing")
      } else {
        // Part A (or no audio): timer runs immediately, audio plays alongside.
        beginAnswering()
      }
    },
    [questions, beginAnswering]
  )

  const advance = React.useCallback(() => {
    const next = indexRef.current + 1
    if (next < questions.length) {
      goToQuestion(next)
    } else if (!completedRef.current) {
      completedRef.current = true
      onComplete()
    }
  }, [questions.length, goToQuestion, onComplete])

  const handleAudioEnded = React.useCallback(() => {
    if (phaseRef.current === "playing") beginAnswering()
  }, [beginAnswering])

  React.useEffect(() => {
    if (questions.length === 0) return
    const id = window.setInterval(() => {
      if (phaseRef.current !== "answering") return
      const remaining = Math.ceil((deadlineRef.current - Date.now()) / 1000)
      if (remaining > 0) {
        setAnswerSeconds(remaining)
      } else {
        advance()
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [questions.length, advance])

  const setAnswer = React.useCallback(
    (questionId: string, answer: AnswerKey) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    },
    []
  )

  return {
    index,
    total: questions.length,
    currentQuestion: questions[index],
    phase,
    answerSeconds,
    answers,
    setAnswer,
    handleAudioEnded,
  }
}
