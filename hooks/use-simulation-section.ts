"use client"

import * as React from "react"

import type { AnswerKey, QuestionRow } from "@/types/question"
import type { SimulationState } from "@/types/simulation"

interface UseSimulationSection {
  state: SimulationState
  currentQuestion: QuestionRow | undefined
  total: number
  answeredCount: number
  setAnswer: (questionId: string, answer: AnswerKey) => void
  goTo: (index: number) => void
  next: () => void
  previous: () => void
}

/**
 * Holds per-section simulation state: the active question, the answers map, and
 * the countdown. `onTimeUp` fires exactly once when the clock reaches zero.
 */
export function useSimulationSection(
  questions: QuestionRow[],
  initialSeconds: number,
  onTimeUp: () => void
): UseSimulationSection {
  const [state, setState] = React.useState<SimulationState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemainingSeconds: initialSeconds,
  })

  // Tick the clock down every second.
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setState((current) =>
        current.timeRemainingSeconds <= 0
          ? current
          : {
              ...current,
              timeRemainingSeconds: current.timeRemainingSeconds - 1,
            }
      )
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  // Fire onTimeUp once when the clock hits zero.
  const firedRef = React.useRef(false)
  React.useEffect(() => {
    if (state.timeRemainingSeconds <= 0 && !firedRef.current) {
      firedRef.current = true
      onTimeUp()
    }
  }, [state.timeRemainingSeconds, onTimeUp])

  const setAnswer = React.useCallback(
    (questionId: string, answer: AnswerKey) => {
      setState((current) => ({
        ...current,
        answers: { ...current.answers, [questionId]: answer },
      }))
    },
    []
  )

  const goTo = React.useCallback(
    (index: number) => {
      setState((current) => ({
        ...current,
        currentQuestionIndex: Math.max(
          0,
          Math.min(index, questions.length - 1)
        ),
      }))
    },
    [questions.length]
  )

  const next = React.useCallback(
    () => goTo(state.currentQuestionIndex + 1),
    [goTo, state.currentQuestionIndex]
  )
  const previous = React.useCallback(
    () => goTo(state.currentQuestionIndex - 1),
    [goTo, state.currentQuestionIndex]
  )

  return {
    state,
    currentQuestion: questions[state.currentQuestionIndex],
    total: questions.length,
    answeredCount: Object.keys(state.answers).length,
    setAnswer,
    goTo,
    next,
    previous,
  }
}
