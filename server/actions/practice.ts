"use server"

import { createClient } from "@/lib/supabase/server"
import { practiceSetupSchema } from "@/lib/validations/practice"
import { shuffle } from "@/lib/simulation"
import type { AnswerKey } from "@/types/question"
import type { PracticeSetupData } from "@/types/practice"

interface StartPracticeResult {
  success: boolean
  message?: string
  attemptId?: string
}

/**
 * Start a practice session: pick N random active questions for the section,
 * create the attempt, and pre-create its (empty) answer rows.
 */
export async function startPracticeAction(
  data: PracticeSetupData
): Promise<StartPracticeResult> {
  const parsed = practiceSetupSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Pengaturan latihan tidak valid." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const { data: pool } = await supabase
    .from("questions")
    .select("id")
    .eq("section", parsed.data.section)
    .eq("is_active", true)
  const questions = pool ?? []
  if (questions.length === 0) {
    return { success: false, message: "Belum ada soal aktif untuk seksi ini." }
  }

  const selected = shuffle(questions).slice(0, parsed.data.count)

  const { data: attempt, error } = await supabase
    .from("practice_attempts")
    .insert({
      user_id: user.id,
      section: parsed.data.section,
      status: "in_progress",
      total_questions: selected.length,
    })
    .select("id")
    .single()
  if (error || !attempt) {
    return { success: false, message: "Gagal memulai latihan." }
  }

  const { error: answersError } = await supabase.from("practice_answers").insert(
    selected.map((question) => ({
      practice_attempt_id: attempt.id,
      question_id: question.id,
    }))
  )
  if (answersError) {
    return { success: false, message: answersError.message }
  }

  return { success: true, attemptId: attempt.id }
}

/** Grade a practice session and mark it complete. */
export async function submitPracticeAction(
  attemptId: string,
  answers: Record<string, AnswerKey>
): Promise<{ success: boolean; message?: string }> {
  if (!attemptId) return { success: false, message: "Latihan tidak ditemukan." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const { data: answerRows } = await supabase
    .from("practice_answers")
    .select("question_id")
    .eq("practice_attempt_id", attemptId)
  const rows = answerRows ?? []
  if (rows.length === 0) {
    return { success: false, message: "Latihan tidak ditemukan." }
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("id, correct_answer")
    .in(
      "id",
      rows.map((row) => row.question_id)
    )
  const correctById = new Map(
    (questions ?? []).map((question) => [question.id, question.correct_answer])
  )

  const now = new Date().toISOString()
  const updates = rows.map((row) => {
    const selected = answers[row.question_id] ?? null
    const isCorrect = selected !== null && selected === correctById.get(row.question_id)
    return {
      practice_attempt_id: attemptId,
      question_id: row.question_id,
      selected_answer: selected,
      is_correct: isCorrect,
      answered_at: selected ? now : null,
    }
  })

  const correct = updates.filter((update) => update.is_correct).length
  const total = rows.length
  const score = total > 0 ? Math.round((correct / total) * 10000) / 100 : 0

  const { error: upsertError } = await supabase
    .from("practice_answers")
    .upsert(updates, { onConflict: "practice_attempt_id,question_id" })
  if (upsertError) return { success: false, message: upsertError.message }

  const { error } = await supabase
    .from("practice_attempts")
    .update({
      status: "completed",
      correct_count: correct,
      score_percentage: score,
      completed_at: now,
    })
    .eq("id", attemptId)
    .eq("user_id", user.id)
  if (error) return { success: false, message: error.message }

  return { success: true }
}
