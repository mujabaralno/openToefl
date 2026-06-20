/**
 * lib/questions.ts
 * UI labels and pure helpers for working with question data.
 * Kept separate from the Zod schema (validation) and the DB types.
 */

import { ANSWER_KEYS } from "@/lib/validations/question"
import {
  type AnswerKey,
  type Difficulty,
  type ListeningPart,
  type QuestionFormData,
  type QuestionOptions,
  type QuestionRow,
  type QuestionSection,
  type QuestionStatus,
} from "@/types/question"
import { type ListeningGroupRow } from "@/types/listening"

export const sectionLabels: Record<QuestionSection, string> = {
  listening: "Listening",
  structure: "Structure",
  reading: "Reading",
}

export const listeningPartLabels: Record<ListeningPart, string> = {
  A: "Part A — Percakapan pendek",
  B: "Part B — Percakapan panjang",
  C: "Part C — Monolog / talk",
}

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
}

export const statusLabels: Record<QuestionStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
}

/** Coerce the DB jsonb `options` value into a typed {A,B,C,D} string record. */
export function parseOptions(value: unknown): QuestionOptions {
  const result: QuestionOptions = { A: "", B: "", C: "", D: "" }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    for (const key of ANSWER_KEYS) {
      const entry = record[key]
      result[key] = typeof entry === "string" ? entry : ""
    }
  }
  return result
}

/** Blank form values for a fresh question in the given section. */
export function emptyQuestionForm(
  section: QuestionSection = "listening"
): QuestionFormData {
  return {
    section,
    question_text: "",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "A",
    explanation: "",
    difficulty: "medium",
    status: "active",
    listening_part: "A",
    audio_url: "",
    group_mode: "existing",
    group_id: "",
    group_title: "",
    group_transcript: "",
    order_in_group: 1,
    passage_mode: "existing",
    passage_id: "",
    passage_title: "",
    passage_content: "",
  }
}

/** Map an existing DB row into editable form values. */
export function questionToForm(
  row: QuestionRow,
  listeningGroups: ListeningGroupRow[] = []
): QuestionFormData {
  const correctAnswer = (ANSWER_KEYS as readonly string[]).includes(
    row.correct_answer
  )
    ? (row.correct_answer as AnswerKey)
    : "A"

  // Listening part is derived: grouped → the group's part; otherwise Part A.
  const group = row.group_id
    ? listeningGroups.find((item) => item.id === row.group_id)
    : undefined
  const listeningPart: ListeningPart = group ? group.part : "A"

  return {
    section: row.section,
    question_text: row.question_text ?? "",
    options: parseOptions(row.options),
    correct_answer: correctAnswer,
    explanation: row.explanation ?? "",
    difficulty: row.difficulty ?? "medium",
    status: row.is_active ? "active" : "inactive",
    listening_part: listeningPart,
    audio_url: row.audio_url ?? "",
    group_mode: "existing",
    group_id: row.group_id ?? "",
    group_title: "",
    group_transcript: "",
    order_in_group: row.order_in_group ?? 1,
    passage_mode: "existing",
    passage_id: row.passage_id ?? "",
    passage_title: "",
    passage_content: "",
  }
}
