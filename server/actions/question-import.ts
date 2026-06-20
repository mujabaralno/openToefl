"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { questionImportRowSchema } from "@/lib/validations/question-import"
import { type ImportReport, type QuestionImportRow } from "@/types/question"

const QUESTIONS_PATH = "/admin/questions"

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

function parseTags(raw: string | undefined): string[] | null {
  if (!raw) return null
  const tags = raw
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
  return tags.length > 0 ? tags : null
}

/**
 * Reading rows carry an inline passage (title + content). Reuse a passage with
 * the same title — whether it already existed or was created earlier in this
 * same import — so repeated titles don't spawn duplicates.
 */
async function resolvePassageId(
  supabase: SupabaseServerClient,
  userId: string,
  row: QuestionImportRow,
  cache: Map<string, string>
): Promise<string | null> {
  if (row.section !== "reading" || !row.passage_title) return null

  const title = row.passage_title
  const cached = cache.get(title)
  if (cached) return cached

  const { data: existing } = await supabase
    .from("passages")
    .select("id")
    .eq("title", title)
    .maybeSingle()
  if (existing) {
    cache.set(title, existing.id)
    return existing.id
  }

  const { data: created, error } = await supabase
    .from("passages")
    .insert({
      title,
      content: row.passage_content ?? "",
      created_by: userId,
    })
    .select("id")
    .single()
  if (error || !created) throw new Error("Gagal membuat passage")

  cache.set(title, created.id)
  return created.id
}

/**
 * Bulk-import questions from rows parsed out of the Excel template.
 *
 * Each row is validated with Zod *before* any insert; invalid rows are skipped
 * and reported back with their (1-based) spreadsheet row number and messages.
 * Valid rows are inserted one at a time so a single DB failure is attributed to
 * the right row rather than aborting the whole batch.
 */
export async function importQuestionsAction(
  rows: unknown[]
): Promise<{ success: boolean; message: string; report?: ImportReport }> {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { success: false, message: "Tidak ada baris untuk diimpor." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") {
    return { success: false, message: "Akses ditolak." }
  }

  const report: ImportReport = {
    total: rows.length,
    inserted: 0,
    failed: 0,
    errors: [],
  }
  const passageCache = new Map<string, string>()

  for (let i = 0; i < rows.length; i += 1) {
    // +2: spreadsheets are 1-based and row 1 is the header.
    const rowNumber = i + 2
    const parsed = questionImportRowSchema.safeParse(rows[i])

    if (!parsed.success) {
      report.failed += 1
      report.errors.push({
        row: rowNumber,
        messages: parsed.error.issues.map(
          (issue) => `${issue.path.join(".") || "baris"}: ${issue.message}`
        ),
      })
      continue
    }

    try {
      const passageId = await resolvePassageId(
        supabase,
        user.id,
        parsed.data,
        passageCache
      )

      const { error } = await supabase.from("questions").insert({
        section: parsed.data.section,
        question_text: parsed.data.question_text,
        passage_id: passageId,
        options: {
          A: parsed.data.option_a,
          B: parsed.data.option_b,
          C: parsed.data.option_c,
          D: parsed.data.option_d,
        },
        correct_answer: parsed.data.correct_answer,
        explanation: parsed.data.explanation ?? null,
        difficulty: parsed.data.difficulty,
        tags: parseTags(parsed.data.tags),
        is_active: true,
        created_by: user.id,
      })

      if (error) {
        report.failed += 1
        report.errors.push({ row: rowNumber, messages: [error.message] })
      } else {
        report.inserted += 1
      }
    } catch (err) {
      report.failed += 1
      const message = err instanceof Error ? err.message : "Gagal menyimpan baris"
      report.errors.push({ row: rowNumber, messages: [message] })
    }
  }

  if (report.inserted > 0) revalidatePath(QUESTIONS_PATH)

  return {
    success: report.inserted > 0,
    message:
      report.failed === 0
        ? `${report.inserted} soal berhasil diimpor.`
        : `${report.inserted} berhasil, ${report.failed} gagal.`,
    report,
  }
}
