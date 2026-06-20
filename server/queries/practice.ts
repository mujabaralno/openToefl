import { createClient } from "@/lib/supabase/server"
import { ANSWER_KEYS } from "@/lib/validations/question"
import type { AnswerKey, QuestionRow } from "@/types/question"
import type { PracticeAttemptRow, PracticeItem } from "@/types/practice"

export interface PracticeAttemptWithItems {
  attempt: PracticeAttemptRow
  items: PracticeItem[]
}

/** Load a practice attempt (RLS: own only) plus its questions and answers. */
export async function getPracticeAttempt(
  attemptId: string
): Promise<PracticeAttemptWithItems | null> {
  const supabase = await createClient()

  const { data: attempt } = await supabase
    .from("practice_attempts")
    .select("*")
    .eq("id", attemptId)
    .maybeSingle()
  if (!attempt) return null

  const { data: answerRows } = await supabase
    .from("practice_answers")
    .select("*")
    .eq("practice_attempt_id", attemptId)
    .order("id", { ascending: true })
  const rows = answerRows ?? []

  const questionById = new Map<string, QuestionRow>()
  if (rows.length > 0) {
    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .in(
        "id",
        rows.map((row) => row.question_id)
      )
    for (const question of questions ?? []) {
      questionById.set(question.id, question)
    }
  }

  const items: PracticeItem[] = []
  for (const row of rows) {
    const question = questionById.get(row.question_id)
    if (!question) continue
    const selected =
      row.selected_answer &&
      (ANSWER_KEYS as readonly string[]).includes(row.selected_answer)
        ? (row.selected_answer as AnswerKey)
        : null
    items.push({ question, selectedAnswer: selected, isCorrect: row.is_correct })
  }

  return { attempt, items }
}
