/**
 * types/question.ts
 * All question-related types — derived from the Zod schema (no duplication,
 * no `any`). Row aliases re-exported from the generated database types.
 */

import type { z } from "zod"
import type {
  questionFormSchema,
  QUESTION_SECTIONS,
  DIFFICULTIES,
  ANSWER_KEYS,
  QUESTION_STATUSES,
  PASSAGE_MODES,
  LISTENING_PARTS,
} from "@/lib/validations/question"
import type { Tables } from "@/types/database.types"

/** Shape submitted by the create/edit form. */
export type QuestionFormData = z.infer<typeof questionFormSchema>

export type QuestionSection = (typeof QUESTION_SECTIONS)[number]
export type Difficulty = (typeof DIFFICULTIES)[number]
export type AnswerKey = (typeof ANSWER_KEYS)[number]
export type QuestionStatus = (typeof QUESTION_STATUSES)[number]
export type PassageMode = (typeof PASSAGE_MODES)[number]
export type ListeningPart = (typeof LISTENING_PARTS)[number]

/** Typed A/B/C/D option map (stored as jsonb in the DB). */
export type QuestionOptions = Record<AnswerKey, string>

/** Convenience aliases for the underlying table rows. */
export type QuestionRow = Tables<"questions">
export type PassageRow = Tables<"passages">
