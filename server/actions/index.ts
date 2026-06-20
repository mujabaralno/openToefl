/**
 * server/actions/index.ts
 * Central export for all Next.js Server Actions.
 *
 * Conventions:
 * - All Server Action files must have "use server" at the top
 * - camelCase for action function names
 * - Validate all inputs with Zod before processing
 * - Never expose service_role key — only use server-side Supabase client
 * - Return typed Result objects (never throw raw errors to the client)
 */

// Re-export server actions as they are created
export {} // placeholder — will be populated per feature
