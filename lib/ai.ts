/**
 * lib/ai.ts
 * Groq model id + the analysis prompt. Pure (no SDK import).
 */

import { SECTION_CONFIG } from "@/lib/simulation"
import { getScoreCategory } from "@/lib/scoring"
import type { TestAttemptRow } from "@/types/user"

export const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile"

export const SYSTEM_PROMPT = `Kamu adalah konsultan pembelajaran TOEFL ITP yang berpengalaman.
Tulis analisis performa dalam Bahasa Indonesia, format **Markdown**, dengan bagian:

## Ringkasan Performa
## Kekuatan
## Kelemahan per Seksi
## Rekomendasi Belajar
## Target Skor

Aturan penting untuk bagian "Rekomendasi Belajar":
- Berikan saran yang konkret dan actionable.
- Untuk SETIAP seksi yang masih lemah, ajak mahasiswa berlatih dan sertakan
  tautan Markdown ke halaman latihan seksi tersebut:
  - Listening → [Latihan Listening](/practice?section=listening)
  - Structure → [Latihan Structure](/practice?section=structure)
  - Reading → [Latihan Reading](/practice?section=reading)
- Di "Target Skor", beri estimasi skor realistis (skala 310-677) setelah latihan.

Tulis ringkas, langsung berguna, tanpa basa-basi.`

export function buildPrompt(attempt: TestAttemptRow): string {
  const total = attempt.total_score ?? 0
  const category = getScoreCategory(total)
  const line = (
    label: string,
    raw: number | null,
    converted: number | null,
    questionCount: number
  ) =>
    `- ${label}: benar ${raw ?? 0} dari ${questionCount} soal (skor scaled ${converted ?? 0})`

  return [
    "Data hasil simulasi TOEFL ITP seorang mahasiswa:",
    line(
      "Listening",
      attempt.listening_raw,
      attempt.listening_converted,
      SECTION_CONFIG.listening.questionCount
    ),
    line(
      "Structure",
      attempt.structure_raw,
      attempt.structure_converted,
      SECTION_CONFIG.structure.questionCount
    ),
    line(
      "Reading",
      attempt.reading_raw,
      attempt.reading_converted,
      SECTION_CONFIG.reading.questionCount
    ),
    `- Total skor: ${total} (kategori: ${category})`,
  ].join("\n")
}
