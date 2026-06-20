import { createAdminClient } from "@/lib/supabase/server"
import type { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard"

/** Start of the selected period, or null for all-time. */
function periodStart(period: LeaderboardPeriod): Date | null {
  if (period === "all") return null
  const now = new Date()
  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  return weekAgo
}

/**
 * Best completed simulation score per student within the period, sorted desc.
 * Uses the admin client (service role) because RLS limits test_attempts to the
 * owner — we read everyone's scores server-side and return only ranked,
 * anonymized rows to the client (never raw PII).
 */
export async function getLeaderboardData(
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  const supabase = await createAdminClient()

  const [{ data: attempts }, { data: users }] = await Promise.all([
    supabase
      .from("test_attempts")
      .select("user_id, total_score, completed_at")
      .eq("status", "completed")
      .not("total_score", "is", null),
    supabase
      .from("users")
      .select("id, full_name, program_study, hide_leaderboard")
      .eq("role", "student"),
  ])

  const userMap = new Map((users ?? []).map((user) => [user.id, user]))
  const start = periodStart(period)

  const best = new Map<string, { score: number; date: string }>()
  for (const attempt of attempts ?? []) {
    if (attempt.total_score === null) continue
    if (start) {
      if (!attempt.completed_at) continue
      if (new Date(attempt.completed_at) < start) continue
    }
    const current = best.get(attempt.user_id)
    if (!current || attempt.total_score > current.score) {
      best.set(attempt.user_id, {
        score: attempt.total_score,
        date: attempt.completed_at ?? "",
      })
    }
  }

  const entries: LeaderboardEntry[] = []
  for (const [userId, value] of best) {
    const user = userMap.get(userId)
    if (!user) continue
    entries.push({
      userId,
      displayName: user.hide_leaderboard
        ? "Anonim"
        : user.full_name || "Mahasiswa",
      programStudy: user.program_study,
      score: value.score,
      date: value.date,
    })
  }

  entries.sort((a, b) => b.score - a.score)
  return entries
}
