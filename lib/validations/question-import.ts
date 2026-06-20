import { z } from "zod"

import {
  ANSWER_KEYS,
  DIFFICULTIES,
  QUESTION_SECTIONS,
} from "@/lib/validations/question"

// ---------------------------------------------------------------------------
// Bulk import row schema — mirrors the Excel template columns in PRD §6.8.2.
//
// One spreadsheet row → one question. Cells arrive as `unknown` from the parsed
// workbook, so we normalise everything to trimmed strings first (numbers become
// "1", blanks become "") and then validate. Reading rows must carry a passage
// (title + content); listening rows may name an audio file (uploaded manually,
// separately). The derived TS type lives in types/question.ts.
// ---------------------------------------------------------------------------

/** Column headers expected in the import sheet (also used for the template). */
export const IMPORT_COLUMNS = [
  "section",
  "question_text",
  "audio_filename",
  "passage_title",
  "passage_content",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "explanation",
  "difficulty",
  "tags",
] as const

const cell = z
  .unknown()
  .transform((value) => {
    if (value === null || value === undefined) return ""
    if (typeof value === "string") return value.trim()
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value).trim()
    }
    return ""
  })

const optionalText = cell.transform((value) => (value === "" ? undefined : value))

export const questionImportRowSchema = z
  .object({
    section: cell.pipe(
      z.enum(QUESTION_SECTIONS, {
        message: "section harus listening/structure/reading",
      })
    ),
    question_text: cell.pipe(
      z.string().min(1, "question_text wajib diisi").max(5000)
    ),
    audio_filename: optionalText,
    passage_title: optionalText,
    passage_content: optionalText,
    option_a: cell.pipe(z.string().min(1, "option_a wajib diisi").max(500)),
    option_b: cell.pipe(z.string().min(1, "option_b wajib diisi").max(500)),
    option_c: cell.pipe(z.string().min(1, "option_c wajib diisi").max(500)),
    option_d: cell.pipe(z.string().min(1, "option_d wajib diisi").max(500)),
    correct_answer: cell
      .transform((value) => value.toUpperCase())
      .pipe(z.enum(ANSWER_KEYS, { message: "correct_answer harus A/B/C/D" })),
    explanation: optionalText.pipe(z.string().max(2000).optional()),
    difficulty: cell
      .transform((value) => value.toLowerCase())
      .pipe(z.enum(DIFFICULTIES, { message: "difficulty harus easy/medium/hard" })),
    tags: optionalText,
  })
  .superRefine((data, ctx) => {
    if (data.section === "reading") {
      if (!data.passage_title) {
        ctx.addIssue({
          code: "custom",
          path: ["passage_title"],
          message: "passage_title wajib untuk soal reading",
        })
      }
      if (!data.passage_content) {
        ctx.addIssue({
          code: "custom",
          path: ["passage_content"],
          message: "passage_content wajib untuk soal reading",
        })
      }
    }
  })
