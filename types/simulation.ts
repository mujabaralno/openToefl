/**
 * types/simulation.ts
 * Client-side state for running one section of a simulation.
 */

import type { AnswerKey } from "@/types/question"

/** Kinds of anti-cheat violation that end a test and lock the account. */
export type Violation = "escape_key" | "shortcut_key" | "fullscreen_exit"

export interface SimulationState {
  /** Index of the question currently shown (within the section's list). */
  currentQuestionIndex: number
  /** Map of questionId → selected answer. Unanswered questions are absent. */
  answers: Record<string, AnswerKey>
  /** Seconds left on this section's countdown. */
  timeRemainingSeconds: number
}

/** Result of starting a new simulation attempt. */
export interface StartSimulationResult {
  success: boolean
  message?: string
  attemptId?: string
}

/** Result of finishing a section (advance to next, or complete the test). */
export interface FinishSectionResult {
  success: boolean
  message?: string
  nextHref?: string
}
