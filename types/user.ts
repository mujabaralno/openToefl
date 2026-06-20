/**
 * types/user.ts
 * User-management types. Row aliases come from the generated DB types.
 */

import type { Tables } from "@/types/database.types"

export type UserRow = Tables<"users">
export type TestAttemptRow = Tables<"test_attempts">

/**
 * Derived account status (no dedicated column — see lib/users.ts):
 * - active   → is_locked = false
 * - locked   → anti-cheat lock still in the future
 * - disabled → admin-disabled (is_locked = true, locked_until = null)
 */
export type AccountStatus = "active" | "locked" | "disabled"

export interface UserAttemptsResult {
  success: boolean
  message?: string
  attempts: TestAttemptRow[]
}
