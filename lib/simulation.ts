/**
 * lib/simulation.ts
 * Static TOEFL ITP section config + pure helpers for the simulation flow.
 */

import type { QuestionSection } from "@/types/question"

export const SECTION_ORDER: QuestionSection[] = [
  "listening",
  "structure",
  "reading",
]

/**
 * Listening is paced per question: each item shows for a fixed window, then
 * auto-advances. Audio plays once and can't be replayed, so there's no manual
 * navigation in this section.
 */
/**
 * Per-question listening window (seconds).
 * - Part A: includes the audio (timer starts immediately, audio plays alongside).
 * - Part B/C: starts after the question's audio finishes.
 */
export const LISTENING_SECONDS_PER_QUESTION = 15

interface SectionConfig {
  label: string
  shortLabel: string
  durationMinutes: number
  questionCount: number
  instructions: string[]
}

export const SECTION_CONFIG: Record<QuestionSection, SectionConfig> = {
  listening: {
    label: "Listening Comprehension",
    shortLabel: "Listening",
    durationMinutes: 35,
    questionCount: 50,
    instructions: [
      "Setiap audio diputar satu kali dan tidak bisa diulang.",
      "Tiap soal hanya 20 detik lalu otomatis lanjut — tidak bisa kembali.",
    ],
  },
  structure: {
    label: "Structure & Written Expression",
    shortLabel: "Structure",
    durationMinutes: 25,
    questionCount: 40,
    instructions: [
      "Lengkapi kalimat rumpang atau temukan bagian yang salah.",
      "Pilih satu jawaban yang paling tepat secara tata bahasa.",
    ],
  },
  reading: {
    label: "Reading Comprehension",
    shortLabel: "Reading",
    durationMinutes: 55,
    questionCount: 50,
    instructions: [
      "Baca setiap passage lalu jawab pertanyaan terkait.",
      "Anda bisa berpindah antar soal dalam seksi ini.",
    ],
  },
}

export function getNextSection(
  section: QuestionSection
): QuestionSection | null {
  const index = SECTION_ORDER.indexOf(section)
  return SECTION_ORDER[index + 1] ?? null
}

export function sectionDurationSeconds(section: QuestionSection): number {
  return SECTION_CONFIG[section].durationMinutes * 60
}

/**
 * Seconds left for a section, derived from when it started so a refresh doesn't
 * reset the clock. Kept out of component render bodies (Date.now()).
 */
export function computeSecondsRemaining(
  startedAt: string | null,
  durationSeconds: number
): number {
  if (!startedAt) return durationSeconds
  const elapsed = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / 1000
  )
  return Math.max(0, durationSeconds - elapsed)
}

/** Fisher–Yates shuffle returning a new array (kept out of render bodies). */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Human-readable duration between two ISO timestamps, e.g. "1 jam 12 menit". */
export function formatDuration(startISO: string, endISO: string): string {
  const ms = new Date(endISO).getTime() - new Date(startISO).getTime()
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours} jam ${minutes} menit`
  return `${minutes} menit ${seconds} detik`
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}
