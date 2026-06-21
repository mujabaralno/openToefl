import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
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
 *
 * IMPORTANT: this must NOT be the cookie-aware `@supabase/ssr` client. That
 * client recovers the caller's session from cookies and uses their JWT for the
 * Authorization header, which silently overrides the service_role key and
 * re-applies RLS as that user. We use the plain `@supabase/supabase-js` client
 * with no session so service_role is always honoured. (`async` is kept so
 * existing `await createAdminClient()` call sites stay valid.)
 */
export async function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
