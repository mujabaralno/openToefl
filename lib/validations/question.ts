import { z } from "zod"

// ---------------------------------------------------------------------------
// Domain constants — single source of truth for sections, difficulty, etc.
// ---------------------------------------------------------------------------
export const QUESTION_SECTIONS = ["listening", "structure", "reading"] as const
export const DIFFICULTIES = ["easy", "medium", "hard"] as const
export const ANSWER_KEYS = ["A", "B", "C", "D"] as const
export const QUESTION_STATUSES = ["active", "inactive"] as const
export const PASSAGE_MODES = ["existing", "new"] as const
// Listening parts. A = 1 audio : 1 question; B & C = 1 audio : many questions.
export const LISTENING_PARTS = ["A", "B", "C"] as const

// ---------------------------------------------------------------------------
// Question form schema
//
// A single flat schema (rather than a discriminated union) keeps react-hook-form
// straightforward: the form swaps which fields are *shown* per section, and the
// superRefine enforces which are *required* per section. Types are derived from
// this schema in types/question.ts so there's no duplication.
// ---------------------------------------------------------------------------
const optionsSchema = z.object({
  A: z.string().trim().min(1, "Opsi A wajib diisi").max(500, "Opsi terlalu panjang"),
  B: z.string().trim().min(1, "Opsi B wajib diisi").max(500, "Opsi terlalu panjang"),
  C: z.string().trim().min(1, "Opsi C wajib diisi").max(500, "Opsi terlalu panjang"),
  D: z.string().trim().min(1, "Opsi D wajib diisi").max(500, "Opsi terlalu panjang"),
})

export const questionFormSchema = z
  .object({
    section: z.enum(QUESTION_SECTIONS),
    question_text: z
      .string()
      .trim()
      .min(1, "Teks soal wajib diisi")
      .max(5000, "Teks soal terlalu panjang"),
    options: optionsSchema,
    correct_answer: z.enum(ANSWER_KEYS),
    explanation: z
      .string()
      .trim()
      .max(2000, "Penjelasan terlalu panjang")
      .optional(),
    difficulty: z.enum(DIFFICULTIES),
    status: z.enum(QUESTION_STATUSES),
    // Listening part. Every listening question has its own audio (audio_url);
    // B/C also belong to a conversation group for bundling + ordering.
    listening_part: z.enum(LISTENING_PARTS).optional(),
    audio_url: z
      .union([z.string().trim().url("URL audio tidak valid"), z.literal("")])
      .optional(),
    // Listening Part B/C only — reference or create the conversation group.
    group_mode: z.enum(PASSAGE_MODES).optional(),
    group_id: z
      .union([z.string().uuid("Grup tidak valid"), z.literal("")])
      .optional(),
    group_title: z
      .string()
      .trim()
      .max(255, "Judul grup terlalu panjang")
      .optional(),
    group_transcript: z
      .string()
      .trim()
      .max(20000, "Transkrip terlalu panjang")
      .optional(),
    order_in_group: z.number().int().min(1).max(20).optional(),
    // Reading only — either reference an existing passage or create a new one.
    passage_mode: z.enum(PASSAGE_MODES).optional(),
    passage_id: z
      .union([z.string().uuid("Passage tidak valid"), z.literal("")])
      .optional(),
    passage_title: z
      .string()
      .trim()
      .max(255, "Judul passage terlalu panjang")
      .optional(),
    passage_content: z
      .string()
      .trim()
      .max(20000, "Isi passage terlalu panjang")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // The correct answer must point to an option that actually has text.
    const chosen = data.options[data.correct_answer]
    if (!chosen || chosen.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["correct_answer"],
        message: "Kunci jawaban harus menunjuk salah satu opsi yang terisi",
      })
    }

    // Listening Part B/C must belong to a conversation group — existing or new.
    if (data.section === "listening" && data.listening_part !== "A") {
      if (data.group_mode === "existing") {
        if (!data.group_id) {
          ctx.addIssue({
            code: "custom",
            path: ["group_id"],
            message: "Pilih grup yang sudah ada",
          })
        }
      } else if (data.group_mode !== "new") {
        ctx.addIssue({
          code: "custom",
          path: ["group_mode"],
          message: "Pilih atau buat grup untuk Part B/C",
        })
      }
    }

    // Reading questions need a passage — existing or freshly written.
    if (data.section === "reading") {
      if (data.passage_mode === "new") {
        if (!data.passage_title || data.passage_title.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["passage_title"],
            message: "Judul passage wajib diisi",
          })
        }
        if (!data.passage_content || data.passage_content.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["passage_content"],
            message: "Isi passage wajib diisi",
          })
        }
      } else if (data.passage_mode === "existing") {
        if (!data.passage_id) {
          ctx.addIssue({
            code: "custom",
            path: ["passage_id"],
            message: "Pilih passage yang sudah ada",
          })
        }
      } else {
        ctx.addIssue({
          code: "custom",
          path: ["passage_mode"],
          message: "Pilih atau buat passage untuk soal reading",
        })
      }
    }
  })
