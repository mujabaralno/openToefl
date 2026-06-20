/**
 * lib/excel.ts
 * SheetJS (xlsx) helpers for the admin panel. These run in the browser
 * (imported by client components): exporting session results, generating the
 * bulk-import template, and parsing an uploaded import workbook into raw rows.
 */

import * as XLSX from "xlsx"

import { IMPORT_COLUMNS } from "@/lib/validations/question-import"
import { type ParticipantResult } from "@/types/session"

function downloadWorkbook(workbook: XLSX.WorkBook, filename: string): void {
  XLSX.writeFile(workbook, filename)
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "sesi"
  )
}

// ---------------------------------------------------------------------------
// Export session results
// ---------------------------------------------------------------------------
export function exportSessionResults(
  sessionTitle: string,
  participants: ParticipantResult[]
): void {
  const rows = participants.map((p, index) => ({
    No: index + 1,
    Nama: p.fullName,
    NIM: p.studentId ?? "",
    "Program Studi": p.programStudy ?? "",
    Email: p.email,
    Listening: p.listeningConverted ?? "",
    Structure: p.structureConverted ?? "",
    Reading: p.readingConverted ?? "",
    "Total Skor": p.totalScore ?? "",
    Status: p.hasResult ? "Sudah test" : "Belum test",
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Sesi")
  downloadWorkbook(workbook, `hasil-${slugify(sessionTitle)}.xlsx`)
}

// ---------------------------------------------------------------------------
// Bulk-import template
// ---------------------------------------------------------------------------
const TEMPLATE_EXAMPLE: Record<string, string> = {
  section: "structure",
  question_text: "The committee ___ to meet every Friday.",
  audio_filename: "",
  passage_title: "",
  passage_content: "",
  option_a: "decide",
  option_b: "decides",
  option_c: "deciding",
  option_d: "decided",
  correct_answer: "B",
  explanation: "Subjek tunggal membutuhkan verb -s.",
  difficulty: "medium",
  tags: "subject-verb,grammar",
}

export function downloadQuestionTemplate(): void {
  // Header row from the canonical column list + one illustrative example.
  const worksheet = XLSX.utils.json_to_sheet([TEMPLATE_EXAMPLE], {
    header: [...IMPORT_COLUMNS],
  })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Soal")
  downloadWorkbook(workbook, "template-import-soal.xlsx")
}

// ---------------------------------------------------------------------------
// Parse an uploaded workbook into raw row objects (keyed by the header row).
// Validation happens server-side; here we only normalise into plain rows.
// ---------------------------------------------------------------------------
export async function parseQuestionsWorkbook(file: File): Promise<unknown[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) return []

  const worksheet = workbook.Sheets[firstSheetName]
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" })
}
