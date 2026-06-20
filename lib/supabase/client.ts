"use client"

import { createBrowserClient } from "@supabase/ssr"
import { type Database } from "@/types/database.types"

/**
 * Creates a Supabase client for use in Client Components.
 *
 * The browser client reads/writes cookies via `document.cookie` automatically.
 * Call this inside components marked with `"use client"`.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
