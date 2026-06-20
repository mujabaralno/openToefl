/**
 * types/history.ts
 * Unified history entry across test (simulation) and practice attempts.
 */

import type { QuestionSection } from "@/types/question"

export type HistoryType = "simulation" | "practice"

export interface HistoryEntry {
  id: string
  type: HistoryType
  /** ISO timestamp the attempt started (used for sorting + date filter). */
  date: string
  /** Raw status: completed | in_progress | violated. */
  status: string
  /** Practice section; null for full simulations. */
  section: QuestionSection | null
  /** Display score, e.g. "547" (simulation) or "85%" (practice) or "—". */
  scoreLabel: string
  /** Detail link when the attempt is completed; null otherwise. */
  href: string | null
}
