import { createClient } from "@/lib/supabase/server"
import type { ProgressAttempt } from "@/lib/charts"

export interface StudentProgress {
  attempts: ProgressAttempt[]
  completedCount: number
  bestScore: number | null
  averageScore: number | null
  practiceCount: number
}

const EMPTY: StudentProgress = {
  attempts: [],
  completedCount: 0,
  bestScore: null,
  averageScore: null,
  practiceCount: 0,
}

/** The current student's completed simulations (oldest→newest) + summary stats. */
export async function getStudentProgress(): Promise<StudentProgress> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return EMPTY

  const { data: rows } = await supabase
    .from("test_attempts")
    .select(
      "total_score, listening_converted, structure_converted, reading_converted, completed_at, started_at"
    )
    .eq("user_id", user.id)
    .eq("status", "completed")
    .not("total_score", "is", null)
    .order("completed_at", { ascending: true })

  const attempts: ProgressAttempt[] = (rows ?? []).map((row) => ({
    date: row.completed_at ?? row.started_at,
    total: row.total_score ?? 0,
    listening: row.listening_converted ?? 0,
    structure: row.structure_converted ?? 0,
    reading: row.reading_converted ?? 0,
  }))

  const completedCount = attempts.length
  const bestScore = completedCount
    ? Math.max(...attempts.map((attempt) => attempt.total))
    : null
  const averageScore = completedCount
    ? Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.total, 0) /
          completedCount
      )
    : null

  const { count } = await supabase
    .from("practice_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed")

  return {
    attempts,
    completedCount,
    bestScore,
    averageScore,
    practiceCount: count ?? 0,
  }
}
