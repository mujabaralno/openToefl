"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { questionFormSchema } from "@/lib/validations/question"
import { type QuestionFormData } from "@/types/question"
import { type ActionResult } from "@/types/auth"

const QUESTIONS_PATH = "/admin/questions"

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

type PassageResolution =
  | { ok: true; passageId: string | null }
  | { ok: false; message: string }

type GroupResolution =
  | { ok: true; groupId: string | null }
  | { ok: false; message: string }

/**
 * Listening Part B/C questions reference a shared audio group. For "new",
 * create the group first; for "existing", pass the id through. Part A and
 * non-listening questions have no group.
 */
async function resolveGroupId(
  supabase: SupabaseServerClient,
  userId: string,
  values: QuestionFormData
): Promise<GroupResolution> {
  if (values.section !== "listening" || values.listening_part === "A") {
    return { ok: true, groupId: null }
  }

  const part = values.listening_part === "C" ? "C" : "B"

  if (values.group_mode === "new") {
    const { data, error } = await supabase
      .from("listening_groups")
      .insert({
        part,
        title: values.group_title ? values.group_title : null,
        transcript: values.group_transcript ? values.group_transcript : null,
        created_by: userId,
      })
      .select("id")
      .single()

    if (error || !data) {
      return { ok: false, message: "Gagal membuat grup audio baru." }
    }
    return { ok: true, groupId: data.id }
  }

  return { ok: true, groupId: values.group_id || null }
}

/**
 * Reading questions need a passage. For "new", create the passage row first and
 * return its id; for "existing", pass the chosen id through; for other sections
 * there's no passage at all.
 */
async function resolvePassageId(
  supabase: SupabaseServerClient,
  userId: string,
  values: QuestionFormData
): Promise<PassageResolution> {
  if (values.section !== "reading") return { ok: true, passageId: null }

  if (values.passage_mode === "new") {
    const { data, error } = await supabase
      .from("passages")
      .insert({
        title: values.passage_title ?? "",
        content: values.passage_content ?? "",
        created_by: userId,
      })
      .select("id")
      .single()

    if (error || !data) {
      return { ok: false, message: "Gagal membuat passage baru." }
    }
    return { ok: true, passageId: data.id }
  }

  return { ok: true, passageId: values.passage_id || null }
}

/** Build the shared insert/update payload from validated form values. */
function toQuestionRow(
  values: QuestionFormData,
  passageId: string | null,
  groupId: string | null
) {
  const isListening = values.section === "listening"
  const isGrouped = isListening && values.listening_part !== "A"

  return {
    section: values.section,
    question_text: values.question_text,
    // Every listening question carries its own audio (Part B/C first question
    // includes the conversation; later ones are just the question).
    audio_url: isListening && values.audio_url ? values.audio_url : null,
    passage_id: passageId,
    group_id: groupId,
    order_in_group: isGrouped ? (values.order_in_group ?? 1) : null,
    options: values.options,
    correct_answer: values.correct_answer,
    explanation: values.explanation ? values.explanation : null,
    difficulty: values.difficulty,
    is_active: values.status === "active",
  }
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
export async function createQuestionAction(
  data: QuestionFormData
): Promise<ActionResult> {
  const parsed = questionFormSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Data soal tidak valid." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const passage = await resolvePassageId(supabase, user.id, parsed.data)
  if (!passage.ok) return { success: false, message: passage.message }

  const group = await resolveGroupId(supabase, user.id, parsed.data)
  if (!group.ok) return { success: false, message: group.message }

  const { error } = await supabase.from("questions").insert({
    ...toQuestionRow(parsed.data, passage.passageId, group.groupId),
    created_by: user.id,
  })

  if (error) return { success: false, message: error.message }

  revalidatePath(QUESTIONS_PATH)
  return { success: true, message: "Soal berhasil ditambahkan." }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
export async function updateQuestionAction(
  id: string,
  data: QuestionFormData
): Promise<ActionResult> {
  if (!id) return { success: false, message: "Soal tidak ditemukan." }

  const parsed = questionFormSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Data soal tidak valid." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const passage = await resolvePassageId(supabase, user.id, parsed.data)
  if (!passage.ok) return { success: false, message: passage.message }

  const group = await resolveGroupId(supabase, user.id, parsed.data)
  if (!group.ok) return { success: false, message: group.message }

  const { error } = await supabase
    .from("questions")
    .update(toQuestionRow(parsed.data, passage.passageId, group.groupId))
    .eq("id", id)

  if (error) return { success: false, message: error.message }

  revalidatePath(QUESTIONS_PATH)
  return { success: true, message: "Soal berhasil diperbarui." }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
export async function deleteQuestionAction(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: "Soal tidak ditemukan." }

  const supabase = await createClient()
  const { error } = await supabase.from("questions").delete().eq("id", id)

  if (error) return { success: false, message: error.message }

  revalidatePath(QUESTIONS_PATH)
  return { success: true, message: "Soal berhasil dihapus." }
}
