/**
 * types/leaderboard.ts
 */

export type LeaderboardPeriod = "all" | "month" | "week"

export interface LeaderboardEntry {
  fullName: string
  userId: string
  /** Full name, or "Anonim" when the user hid themselves. */
  displayName: string
  programStudy: string | null
  /** Best total score (310–677) within the selected period. */
  score: number
  /** ISO completed_at of the best attempt. */
  date: string
}
