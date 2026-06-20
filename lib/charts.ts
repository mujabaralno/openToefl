/**
 * lib/charts.ts
 * Pure transforms from a normalized attempt list into Recharts-ready shapes.
 * Each chart has an explicit data type. No `any`, no side effects.
 */

/** Normalized completed simulation attempt (oldest → newest). */
export interface ProgressAttempt {
  date: string
  total: number
  listening: number
  structure: number
  reading: number
}

/** Line chart: total score over time. */
export interface ScoreTrendPoint {
  label: string
  total: number
}

/** Bar chart: per-section scaled scores across attempts. */
export interface SectionComparisonPoint {
  label: string
  listening: number
  structure: number
  reading: number
}

/** Radar chart: balance of the three sections for one attempt. */
export interface RadarPoint {
  section: string
  score: number
}

function attemptLabel(index: number): string {
  return `Tes ${index + 1}`
}

export function toScoreTrend(attempts: ProgressAttempt[]): ScoreTrendPoint[] {
  return attempts.map((attempt, index) => ({
    label: attemptLabel(index),
    total: attempt.total,
  }))
}

export function toSectionComparison(
  attempts: ProgressAttempt[]
): SectionComparisonPoint[] {
  return attempts.map((attempt, index) => ({
    label: attemptLabel(index),
    listening: attempt.listening,
    structure: attempt.structure,
    reading: attempt.reading,
  }))
}

/** Radar of the latest attempt's three section scores (empty if none). */
export function toSectionBalance(attempts: ProgressAttempt[]): RadarPoint[] {
  const latest = attempts.at(-1)
  if (!latest) return []
  return [
    { section: "Listening", score: latest.listening },
    { section: "Structure", score: latest.structure },
    { section: "Reading", score: latest.reading },
  ]
}
