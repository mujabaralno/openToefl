/**
 * lib/sessions.ts
 * Pure helpers + labels for session data. Date math is kept out of component
 * render bodies (react purity lint) by living here behind named functions.
 */

import { type SessionFormData, type SessionRow } from "@/types/session"

export type SessionStatus = "scheduled" | "ongoing" | "ended" | "inactive"

export const sessionStatusLabels: Record<SessionStatus, string> = {
  scheduled: "Terjadwal",
  ongoing: "Berlangsung",
  ended: "Selesai",
  inactive: "Nonaktif",
}

/** Derive a session's lifecycle status from its dates + active flag. */
export function getSessionStatus(
  session: Pick<SessionRow, "start_date" | "end_date" | "is_active">,
  now: Date = new Date()
): SessionStatus {
  if (!session.is_active) return "inactive"
  const ms = now.getTime()
  if (ms < new Date(session.start_date).getTime()) return "scheduled"
  if (ms > new Date(session.end_date).getTime()) return "ended"
  return "ongoing"
}

/** Format an ISO timestamp for display, e.g. "20 Jun 2026, 09:00". */
export function formatSessionDateTime(value: string): string {
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Convert a stored ISO timestamp into the "YYYY-MM-DDTHH:mm" string an
 * <input type="datetime-local"> expects (in the browser's local time).
 */
export function isoToLocalInput(value: string): string {
  const date = new Date(value)
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

/**
 * Convert a datetime-local input value ("YYYY-MM-DDTHH:mm", naive local time)
 * into an absolute UTC ISO string.
 *
 * MUST run in the browser: a naive datetime string is interpreted in the
 * runtime's timezone, so anchoring it on the client pins the wall-clock time to
 * the admin's timezone (not the server's, which is typically UTC on Vercel).
 * An already-ISO value passes through unchanged (new Date on an ISO string with
 * an offset is timezone-independent).
 */
export function localInputToIso(value: string): string {
  return new Date(value).toISOString()
}

/** Blank form values for a fresh session (defaults to active). */
export function emptySessionForm(): SessionFormData {
  return {
    title: "",
    description: "",
    program_study: "",
    faculty: "",
    start_date: "",
    end_date: "",
    max_participants: "",
    is_active: true,
  }
}

/** Map an existing DB row into editable form values. */
export function sessionToForm(row: SessionRow): SessionFormData {
  return {
    title: row.title,
    description: row.description ?? "",
    program_study: row.program_study ?? "",
    faculty: row.faculty ?? "",
    start_date: isoToLocalInput(row.start_date),
    end_date: isoToLocalInput(row.end_date),
    max_participants:
      row.max_participants == null ? "" : String(row.max_participants),
    is_active: row.is_active,
  }
}
