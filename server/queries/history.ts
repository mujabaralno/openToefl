import { createClient } from "@/lib/supabase/server"
import type { HistoryEntry } from "@/types/history"

/** All of the current user's attempts (simulation + practice), newest first. */
export async function getHistoryEntries(): Promise<HistoryEntry[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const [simulations, practices] = await Promise.all([
    supabase
      .from("test_attempts")
      .select("id, status, total_score, started_at")
      .eq("user_id", user.id),
    supabase
      .from("practice_attempts")
      .select("id, status, section, score_percentage, started_at")
      .eq("user_id", user.id),
  ])

  const entries: HistoryEntry[] = []

  for (const attempt of simulations.data ?? []) {
    entries.push({
      id: attempt.id,
      type: "simulation",
      date: attempt.started_at,
      status: attempt.status,
      section: null,
      scoreLabel:
        attempt.status === "completed"
          ? String(attempt.total_score ?? 0)
          : attempt.status === "violated"
            ? "0"
            : "—",
      href:
        attempt.status === "completed"
          ? `/simulation/${attempt.id}/result`
          : null,
    })
  }

  for (const attempt of practices.data ?? []) {
    entries.push({
      id: attempt.id,
      type: "practice",
      date: attempt.started_at,
      status: attempt.status,
      section: attempt.section,
      scoreLabel:
        attempt.status === "completed"
          ? `${attempt.score_percentage ?? 0}%`
          : "—",
      href: attempt.status === "completed" ? `/practice/${attempt.id}` : null,
    })
  }

  entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return entries
}
