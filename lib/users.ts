/**
 * lib/users.ts
 * Labels and pure helpers for user management.
 */

import type { Enums } from "@/types/database.types"
import type { AccountStatus, UserRow } from "@/types/user"

export const roleLabels: Record<Enums<"user_role">, string> = {
  admin: "Admin",
  student: "Mahasiswa",
}

export const accountStatusLabels: Record<AccountStatus, string> = {
  active: "Aktif",
  locked: "Terkunci",
  disabled: "Nonaktif",
}

export const attemptStatusLabels: Record<Enums<"test_status">, string> = {
  in_progress: "Berlangsung",
  completed: "Selesai",
  violated: "Pelanggaran",
}

/**
 * Resolve the visible account status from the lock columns. A lock whose
 * `locked_until` has already passed counts as active (it auto-expires).
 *
 * Kept out of component render bodies so the Date.now() call stays clear of the
 * react purity lint rule.
 */
export function getAccountStatus(
  user: Pick<UserRow, "is_locked" | "locked_until">
): AccountStatus {
  if (!user.is_locked) return "active"
  if (user.locked_until === null) return "disabled"
  return new Date(user.locked_until).getTime() > Date.now()
    ? "locked"
    : "active"
}

/** Up to two initials from a name, for avatar fallbacks. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
