/**
 * lib/scoring.ts
 * Official TOEFL ITP score conversion (PRD §8). Each table is indexed by raw
 * score → scaled score. Pure & dependency-free so it's trivially unit-tested.
 */

export type Section = "listening" | "structure" | "reading"

export type ScoreCategory =
  | "Sangat Tinggi"
  | "Tinggi"
  | "Menengah"
  | "Rendah"
  | "Sangat Rendah"

// Index = raw score, value = scaled score.

// Listening: raw 0–50 → scaled (PRD §8.1)
const LISTENING_SCALE = [
  31, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 21, 23, 24, 25, 26, 28,
  29, 30, 31, 33, 34, 35, 36, 38, 39, 40, 42, 43, 45, 46, 48, 49, 50, 52, 53,
  55, 56, 58, 59, 61, 62, 63, 65, 66, 67, 68,
] as const

// Structure: raw 0–40 → scaled (PRD §8.2)
const STRUCTURE_SCALE = [
  31, 13, 15, 16, 17, 19, 20, 21, 23, 24, 26, 27, 29, 30, 32, 33, 35, 36, 37,
  39, 40, 42, 43, 45, 46, 48, 49, 50, 52, 53, 55, 56, 57, 59, 61, 62, 63, 65,
  66, 67, 68,
] as const

// Reading: raw 0–50 → scaled (PRD §8.3)
const READING_SCALE = [
  31, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
  36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
  55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
] as const

const SCALE: Record<Section, readonly number[]> = {
  listening: LISTENING_SCALE,
  structure: STRUCTURE_SCALE,
  reading: READING_SCALE,
}

const MAX_RAW: Record<Section, number> = {
  listening: 50,
  structure: 40,
  reading: 50,
}

/** Convert a raw section score to its scaled score. Raw is clamped to range. */
export function convertScore(section: Section, raw: number): number {
  const table = SCALE[section]
  const clamped = Math.max(0, Math.min(Math.round(raw), MAX_RAW[section]))
  return table[clamped]
}

/** Total = ROUND((L + S + R) × 10 / 3), where L/S/R are scaled scores. */
export function calculateTotalScore(
  listening: number,
  structure: number,
  reading: number
): number {
  return Math.round(((listening + structure + reading) * 10) / 3)
}

/** Interpret a total score into its category (PRD §8.5). */
export function getScoreCategory(total: number): ScoreCategory {
  if (total >= 627) return "Sangat Tinggi"
  if (total >= 543) return "Tinggi"
  if (total >= 460) return "Menengah"
  if (total >= 337) return "Rendah"
  return "Sangat Rendah"
}
