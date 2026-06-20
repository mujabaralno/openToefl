/**
 * types/practice.ts
 * Practice Mode types — rows from DB + the setup form shape (from Zod).
 */

import type { z } from "zod"
import type { practiceSetupSchema } from "@/lib/validations/practice"
import type { Tables } from "@/types/database.types"
import type { AnswerKey, QuestionRow } from "@/types/question"

export type PracticeAttemptRow = Tables<"practice_attempts">
export type PracticeAnswerRow = Tables<"practice_answers">

export type PracticeSetupData = z.infer<typeof practiceSetupSchema>

/** A question within a practice attempt, with its saved answer state. */
export interface PracticeItem {
  question: QuestionRow
  selectedAnswer: AnswerKey | null
  isCorrect: boolean | null
}
