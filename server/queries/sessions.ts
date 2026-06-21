import { createClient } from "@/lib/supabase/server"
import {
  type JoinedSession,
  type ParticipantResult,
  type SessionAttempt,
  type SessionRow,
  type SessionWithStats,
} from "@/types/session"

/**
 * All sessions (admin), newest first, each with participant + "sudah test"
 * counts. RLS lets admins read every session; a non-admin caller gets nothing.
 *
 * "Sudah test" = participant who completed the simulation FOR THIS SESSION
 * (an attempt tagged with this session_id), not just any simulation.
 */
export async function getAllSessions(): Promise<SessionWithStats[]> {
  const supabase = await createClient()

  const [{ data: sessions, error }, { data: participants }, { data: completed }] =
    await Promise.all([
      supabase.from("sessions").select("*").order("created_at", { ascending: false }),
      supabase.from("session_participants").select("session_id, user_id"),
      supabase
        .from("test_attempts")
        .select("user_id, session_id")
        .eq("status", "completed")
        .not("session_id", "is", null),
    ])

  if (error) throw new Error(error.message)

  // Set of "<session_id>:<user_id>" pairs that finished this session's test.
  const completedPairs = new Set(
    (completed ?? [])
      .filter((row) => row.session_id)
      .map((row) => `${row.session_id}:${row.user_id}`)
  )

  const bySession = new Map<string, { total: number; done: number }>()
  for (const p of participants ?? []) {
    const entry = bySession.get(p.session_id) ?? { total: 0, done: 0 }
    entry.total += 1
    if (completedPairs.has(`${p.session_id}:${p.user_id}`)) entry.done += 1
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
 * Participants of a session with the result they earned IN THIS SESSION —
 * the data source for both the on-screen roster and the Excel export.
 *
 * With one attempt per session, the result is the completed attempt tagged with
 * this session_id (the reduce keeps the highest just as a safety net).
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
      .eq("session_id", sessionId)
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
 * session first, each annotated with the student's own attempt for it (used by
 * the session card to show Mulai / Lanjutkan / Lihat Hasil).
 */
export async function getJoinedSessions(
  userId: string
): Promise<JoinedSession[]> {
  const supabase = await createClient()

  const { data: memberships, error } = await supabase
    .from("session_participants")
    .select("session_id, joined_at")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false })

  if (error) throw new Error(error.message)
  if (!memberships || memberships.length === 0) return []

  // RLS (sessions_select_participant) returns exactly the joined sessions.
  const sessionIds = memberships.map((m) => m.session_id)
  const [{ data: sessions }, { data: attempts }] = await Promise.all([
    supabase.from("sessions").select("*").in("id", sessionIds),
    supabase
      .from("test_attempts")
      .select("id, session_id, status, current_section, total_score, started_at")
      .eq("user_id", userId)
      .in("session_id", sessionIds)
      .order("started_at", { ascending: false }),
  ])

  const sessionById = new Map((sessions ?? []).map((s) => [s.id, s]))

  // One attempt per session — keep the newest (already sorted desc by start).
  const attemptBySession = new Map<string, SessionAttempt>()
  for (const a of attempts ?? []) {
    if (a.session_id && !attemptBySession.has(a.session_id)) {
      attemptBySession.set(a.session_id, {
        id: a.id,
        status: a.status,
        currentSection: a.current_section,
        totalScore: a.total_score,
      })
    }
  }

  // Preserve the membership order (newest joined first).
  const result: JoinedSession[] = []
  for (const m of memberships) {
    const session = sessionById.get(m.session_id)
    if (session) {
      result.push({
        ...session,
        attempt: attemptBySession.get(m.session_id) ?? null,
      })
    }
  }
  return result
}
