/**
 * lib/auth/lock.ts
 * Shared account-lock logic used by the middleware and the lock screen.
 */

interface LockState {
  is_locked: boolean
  locked_until: string | null
}

/**
 * An account is actively locked when `is_locked` is true AND either there's
 * no expiry, or the expiry is still in the future. A passed expiry is treated
 * as unlocked (auto-expire); the persisted flag is cleared elsewhere.
 *
 * Kept out of component render bodies so the `Date.now()` call stays clear of
 * the react purity lint rule.
 */
export function isLockActive(state: LockState | null | undefined): boolean {
  if (!state || state.is_locked !== true) return false
  if (state.locked_until === null) return true
  return new Date(state.locked_until).getTime() > Date.now()
}
