/**
 * types/index.ts
 * Central export for all TypeScript types & interfaces used in PTESOL.
 *
 * Conventions:
 * - PascalCase for all type/interface names
 * - Derive types from Zod schemas where possible: z.infer<typeof schema>
 * - Never use `any` — use `unknown` + type guards instead
 */

// Re-export domain types as they are created
export type {} // placeholder — will be populated per feature
