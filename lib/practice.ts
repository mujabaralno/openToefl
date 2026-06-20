/**
 * lib/practice.ts
 * Practice Mode constants & pure helpers.
 */

import type { QuestionSection } from "@/types/question"

/** Preset question counts offered on the setup screen. */
export const PRACTICE_COUNT_PRESETS = [10, 20, 30] as const

/** Rough per-question allowance used when the optional timer is on. */
const SECONDS_PER_QUESTION: Record<QuestionSection, number> = {
  listening: 40,
  structure: 38,
  reading: 66,
}

/** Timer duration (seconds) proportional to the number of questions. */
export function practiceDurationSeconds(
  section: QuestionSection,
  count: number
): number {
  return count * SECONDS_PER_QUESTION[section]
}
