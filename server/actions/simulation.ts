"use server"

import { createClient } from "@/lib/supabase/server"
import { getNextSection } from "@/lib/simulation"
import { calculateTotalScore, convertScore } from "@/lib/scoring"
import { createNotification } from "@/server/notifications"
import type { AnswerKey, QuestionSection } from "@/types/question"
import type { ActionResult } from "@/types/auth"
import type {
  FinishSectionResult,
  StartSimulationResult,
  Violation,
} from "@/types/simulation"

const LOCK_DURATION_MS = 24 * 60 * 60 * 1000

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/** Persist the answers for a section into test_answers (with correctness). */
async function saveSectionAnswers(
  supabase: SupabaseServerClient,
  attemptId: string,
  answers: Record<string, AnswerKey>
): Promise<void> {
  const questionIds = Object.keys(answers)
  if (questionIds.length === 0) return

  const { data: questionRows } = await supabase
    .from("questions")
    .select("id, correct_answer")
    .in("id", questionIds)
  const correctById = new Map(
    (questionRows ?? []).map((row) => [row.id, row.correct_answer])
  )

  const now = new Date().toISOString()
  const rows = questionIds.map((questionId) => ({
    attempt_id: attemptId,
    question_id: questionId,
    selected_answer: answers[questionId],
    is_correct: answers[questionId] === correctById.get(questionId),
    answered_at: now,
  }))

  await supabase
    .from("test_answers")
    .upsert(rows, { onConflict: "attempt_id,question_id" })
}

/** Tally raw scores from test_answers, convert, and complete the attempt. */
async function finalizeScore(
  supabase: SupabaseServerClient,
  attemptId: string,
  userId: string,
  completedAt: string
): Promise<{ message: string } | null> {
  const { data: answerRows } = await supabase
    .from("test_answers")
    .select("question_id, is_correct")
    .eq("attempt_id", attemptId)
  const answers = answerRows ?? []

  const questionIds = answers.map((row) => row.question_id)
  const sectionById = new Map<string, QuestionSection>()
  if (questionIds.length > 0) {
    const { data: questionRows } = await supabase
      .from("questions")
      .select("id, section")
      .in("id", questionIds)
    for (const row of questionRows ?? []) sectionById.set(row.id, row.section)
  }

  let listeningRaw = 0
  let structureRaw = 0
  let readingRaw = 0
  for (const answer of answers) {
    if (!answer.is_correct) continue
    const section = sectionById.get(answer.question_id)
    if (section === "listening") listeningRaw++
    else if (section === "structure") structureRaw++
    else if (section === "reading") readingRaw++
  }

  const listeningConverted = convertScore("listening", listeningRaw)
  const structureConverted = convertScore("structure", structureRaw)
  const readingConverted = convertScore("reading", readingRaw)
  const totalScore = calculateTotalScore(
    listeningConverted,
    structureConverted,
    readingConverted
  )

  const { error } = await supabase
    .from("test_attempts")
    .update({
      listening_raw: listeningRaw,
      structure_raw: structureRaw,
      reading_raw: readingRaw,
      listening_converted: listeningConverted,
      structure_converted: structureConverted,
      reading_converted: readingConverted,
      total_score: totalScore,
      status: "completed",
      completed_at: completedAt,
      current_section: null,
    })
    .eq("id", attemptId)
    .eq("user_id", userId)

  return error ? { message: error.message } : null
}

/**
 * Create a fresh in-progress attempt and start the listening section clock.
 * Returns the new attempt id so the client can route into the first section.
 */
export async function startSimulationAction(): Promise<StartSimulationResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("test_attempts")
    .insert({
      user_id: user.id,
      status: "in_progress",
      current_section: "listening",
      listening_started_at: now,
      started_at: now,
    })
    .select("id")
    .single()

  if (error || !data) {
    return { success: false, message: "Gagal memulai tes. Coba lagi." }
  }

  return { success: true, attemptId: data.id }
}

/**
 * Finish the given section: save its answers, then advance to the next section
 * (starting its clock) or, after reading, compute the score and complete.
 */
export async function finishSectionAction(
  attemptId: string,
  section: QuestionSection,
  answers: Record<string, AnswerKey>
): Promise<FinishSectionResult> {
  if (!attemptId) {
    return { success: false, message: "Tes tidak ditemukan." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  await saveSectionAnswers(supabase, attemptId, answers)

  const now = new Date().toISOString()
  const next = getNextSection(section)

  if (next === null) {
    // Reading done → tally raw scores, convert, and complete.
    const failure = await finalizeScore(supabase, attemptId, user.id, now)
    if (failure) return { success: false, message: failure.message }
    await createNotification({
      userId: user.id,
      type: "result_ready",
      title: "Hasil simulasi siap",
      message: "Skor simulasi TOEFL ITP Anda sudah tersedia.",
      metadata: { attemptId },
    })
    return { success: true, nextHref: `/simulation/${attemptId}/result` }
  }

  const updates =
    next === "structure"
      ? { current_section: next, structure_started_at: now }
      : { current_section: next, reading_started_at: now }

  const { error } = await supabase
    .from("test_attempts")
    .update(updates)
    .eq("id", attemptId)
    .eq("user_id", user.id)
  if (error) return { success: false, message: error.message }

  return { success: true, nextHref: `/simulation/${attemptId}/${next}` }
}

/**
 * Record an anti-cheat violation: void the attempt (score 0) and lock the
 * account for 24 hours. The client then routes to /account-locked.
 */
export async function reportViolationAction(
  attemptId: string,
  violation: Violation
): Promise<ActionResult> {
  if (!attemptId) return { success: false, message: "Tes tidak ditemukan." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const now = new Date()
  const lockedUntil = new Date(now.getTime() + LOCK_DURATION_MS).toISOString()

  // Void the attempt. Only act on an in-progress attempt the user owns.
  await supabase
    .from("test_attempts")
    .update({
      status: "violated",
      total_score: 0,
      violation_type: violation,
      completed_at: now.toISOString(),
    })
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .eq("status", "in_progress")

  // Lock the account for 24 hours.
  const { error } = await supabase
    .from("users")
    .update({ is_locked: true, locked_until: lockedUntil })
    .eq("id", user.id)
  if (error) return { success: false, message: error.message }

  await createNotification({
    userId: user.id,
    type: "account_locked",
    title: "Akun dikunci",
    message:
      "Anda terdeteksi melakukan pelanggaran. Akun dikunci 24 jam dan skor sesi ini 0.",
  })

  return { success: true, message: "Pelanggaran tercatat." }
}
