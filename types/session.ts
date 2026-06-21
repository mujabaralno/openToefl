/**
 * types/session.ts
 * Session-related types. Form shapes are derived from the Zod schemas
 * (no duplication, no `any`); row aliases come from the generated DB types.
 */

import type { z } from "zod"
import type {
  sessionFormSchema,
  joinSessionSchema,
} from "@/lib/validations/session"
import type { Enums, Tables } from "@/types/database.types"
import type { ActionResult } from "@/types/auth"

export type SessionRow = Tables<"sessions">
export type SessionParticipantRow = Tables<"session_participants">

/** Shape submitted by the admin create/edit form. */
export type SessionFormData = z.infer<typeof sessionFormSchema>
/** Shape submitted by the student join-by-code form. */
export type JoinSessionData = z.infer<typeof joinSessionSchema>

/** A session plus derived counts for the admin table. */
export interface SessionWithStats extends SessionRow {
  participantCount: number
  /** Participants who have at least one completed simulation. */
  completedCount: number
}

/** The student's own attempt within a specific session (if any). */
export interface SessionAttempt {
  id: string
  status: Enums<"test_status">
  currentSection: Enums<"question_section"> | null
  totalScore: number | null
}

/** A session a student has joined, plus their own attempt for it (if any). */
export interface JoinedSession extends SessionRow {
  attempt: SessionAttempt | null
}

/** One participant's results within a session (best completed attempt). */
export interface ParticipantResult {
  userId: string
  fullName: string
  studentId: string | null
  programStudy: string | null
  email: string
  joinedAt: string
  hasResult: boolean
  listeningConverted: number | null
  structureConverted: number | null
  readingConverted: number | null
  totalScore: number | null
  completedAt: string | null
}

/** Create returns the generated invite code alongside the standard result. */
export interface CreateSessionResult extends ActionResult {
  inviteCode?: string
}
