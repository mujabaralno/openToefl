/**
 * types/auth.ts
 * Auth-related types used across server actions and components.
 */

/** Generic result for server actions — never throws to the client */
export interface ActionResult {
  success: boolean
  message: string
  redirectTo?: string
}
