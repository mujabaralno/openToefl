/**
 * server/queries/index.ts
 * Central export for all Supabase database query functions.
 *
 * Conventions:
 * - Never import or use this on the client side
 * - All Supabase access must use generated types: Database from @/types/supabase
 * - RLS must be active on all queried tables before marking feature as done
 * - Use server-side Supabase client (with cookies) — never expose service_role key
 */

// Re-export query functions as they are created
export {} // placeholder — will be populated per feature
