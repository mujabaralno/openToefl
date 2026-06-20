import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type Database } from "@/types/database.types"

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers.
 *
 * Uses Next.js `cookies()` to read/write auth cookies on the server.
 * Must be called within a request context (not at module level).
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll was called from a Server Component.
            // This can be safely ignored if middleware is refreshing the session.
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase admin client using the service_role key.
 *
 * ⚠️ NEVER use this on the client side or expose SUPABASE_SERVICE_ROLE_KEY.
 * This bypasses RLS — only use for admin operations in Server Actions / Route Handlers.
 */
export async function createAdminClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Safe to ignore when called from Server Component
          }
        },
      },
    }
  )
}
