import { createClient } from "@/lib/supabase/server"
import {
  type JoinedSession,
  type ParticipantResult,
  type SessionRow,
  type SessionWithStats,
} from "@/types/session"

/**
 * All sessions (admin), newest first, each with participant + "sudah test"
 * counts. RLS lets admins read every session; a non-admin caller gets nothing.
 *
 * "Sudah test" = participant whose account has at least one completed
 * simulation. Attempts aren't strictly session-scoped yet, so this is a
 * pragmatic proxy (see also getSessionParticipants).
 */
export async function getAllSessions(): Promise<SessionWithStats[]> {
  const supabase = await createClient()

  const [{ data: sessions, error }, { data: participants }, { data: completed }] =
    await Promise.all([
      supabase.from("sessions").select("*").order("created_at", { ascending: false }),
      supabase.from("session_participants").select("session_id, user_id"),
      supabase.from("test_attempts").select("user_id").eq("status", "completed"),
    ])

  if (error) throw new Error(error.message)

  const completedUsers = new Set((completed ?? []).map((row) => row.user_id))

  const bySession = new Map<string, { total: number; done: number }>()
  for (const p of participants ?? []) {
    const entry = bySession.get(p.session_id) ?? { total: 0, done: 0 }
    entry.total += 1
    if (completedUsers.has(p.user_id)) entry.done += 1
    bySession.set(p.session_id, entry)
  }

  return (sessions ?? []).map((session) => {
    const stats = bySession.get(session.id) ?? { total: 0, done: 0 }
    return {
      ...session,
      participantCount: stats.total,
      completedCount: stats.done,
    }
  })
}

/** Single session by id (admin), or null when not found / not permitted. */
export async function getSessionById(id: string): Promise<SessionRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Participants of a session with their best completed simulation result —
 * the data source for both the on-screen roster and the Excel export.
 *
 * Each participant's "best" attempt = highest total_score among their
 * completed attempts. Attempts aren't yet linked to a specific session, so a
 * student's best overall result is shown for the session they belong to.
 */
export async function getSessionParticipants(
  sessionId: string
): Promise<ParticipantResult[]> {
  const supabase = await createClient()

  const { data: participants, error } = await supabase
    .from("session_participants")
    .select("user_id, joined_at")
    .eq("session_id", sessionId)
    .order("joined_at", { ascending: true })

  if (error) throw new Error(error.message)
  if (!participants || participants.length === 0) return []

  const userIds = participants.map((p) => p.user_id)

  // Separate (fully-typed) fetches rather than an embedded join, which the
  // generated types widen to `any`.
  const [{ data: profiles }, { data: attempts }] = await Promise.all([
    supabase
      .from("users")
      .select("id, full_name, student_id, program_study, email")
      .in("id", userIds),
    supabase
      .from("test_attempts")
      .select(
        "user_id, total_score, listening_converted, structure_converted, reading_converted, completed_at"
      )
      .eq("status", "completed")
      .in("user_id", userIds),
  ])

  const profileByUser = new Map((profiles ?? []).map((p) => [p.id, p]))

  // Keep the single best (highest total) completed attempt per user.
  const bestByUser = new Map<string, NonNullable<typeof attempts>[number]>()
  for (const attempt of attempts ?? []) {
    const current = bestByUser.get(attempt.user_id)
    if (!current || (attempt.total_score ?? -1) > (current.total_score ?? -1)) {
      bestByUser.set(attempt.user_id, attempt)
    }
  }

  return participants.map((p) => {
    const profile = profileByUser.get(p.user_id)
    const best = bestByUser.get(p.user_id)
    return {
      userId: p.user_id,
      fullName: profile?.full_name ?? "—",
      studentId: profile?.student_id ?? null,
      programStudy: profile?.program_study ?? null,
      email: profile?.email ?? "—",
      joinedAt: p.joined_at,
      hasResult: Boolean(best),
      listeningConverted: best?.listening_converted ?? null,
      structureConverted: best?.structure_converted ?? null,
      readingConverted: best?.reading_converted ?? null,
      totalScore: best?.total_score ?? null,
      completedAt: best?.completed_at ?? null,
    }
  })
}

/**
 * Sessions a student has joined (RLS: sessions_select_participant), newest
 * session first, each annotated with the student's own best total score.
 */
export async function getJoinedSessions(
  userId: string
): Promise<JoinedSession[]> {
  const supabase = await createClient()

  const [{ data: memberships, error }, { data: attempts }] = await Promise.all([
    supabase
      .from("session_participants")
      .select("session_id, joined_at")
      .eq("user_id", userId)
      .order("joined_at", { ascending: false }),
    supabase
      .from("test_attempts")
      .select("total_score")
      .eq("user_id", userId)
      .eq("status", "completed"),
  ])

  if (error) throw new Error(error.message)
  if (!memberships || memberships.length === 0) return []

  const bestTotalScore =
    (attempts ?? []).reduce<number | null>((best, row) => {
      if (row.total_score == null) return best
      return best == null ? row.total_score : Math.max(best, row.total_score)
    }, null) ?? null

  // RLS (sessions_select_participant) returns exactly the joined sessions.
  const sessionIds = memberships.map((m) => m.session_id)
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .in("id", sessionIds)

  const sessionById = new Map((sessions ?? []).map((s) => [s.id, s]))

  // Preserve the membership order (newest joined first).
  const result: JoinedSession[] = []
  for (const m of memberships) {
    const session = sessionById.get(m.session_id)
    if (session) result.push({ ...session, bestTotalScore })
  }
  return result
}
