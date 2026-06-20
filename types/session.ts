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
import type { Tables } from "@/types/database.types"
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

/** A session a student has joined, plus their own best result (if any). */
export interface JoinedSession extends SessionRow {
  bestTotalScore: number | null
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
