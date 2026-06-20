import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { type Database } from "@/types/database.types"
import { isLockActive } from "@/lib/auth/lock"
import { getAppSettings } from "@/lib/get-app-settings"

/**
 * Refreshes the Supabase auth session on every request and enforces
 * route protection rules:
 *
 *  1. Unauthenticated users hitting a protected route → /login
 *  2. Authenticated users on auth pages (/login, /register, …) → their dashboard
 *  3. Role-based gating: students can't enter /admin/*, admins can't enter
 *     student-only areas — each is redirected to their own dashboard
 *  4. Locked accounts (is_locked = true, locked_until still in the future)
 *     are funnelled to /account-locked
 *  5. Maintenance mode (app_settings.maintenance_mode) → non-admin traffic is
 *     redirected to /maintenance; /admin and /login stay reachable.
 *
 * IMPORTANT: do NOT use supabase.auth.getSession() here. getUser() validates
 * the token against the Auth server; getSession() only reads cookies.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { pathname } = request.nextUrl

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = ""
    return NextResponse.redirect(url)
  }

  // Auth-flow routes must always pass through untouched: the email-confirm
  // handler and the recovery-session reset page both run while a (temporary)
  // session exists, so they must never be redirected away.
  const isAuthFlowRoute =
    pathname.startsWith("/auth") || pathname === "/reset-password"
  if (isAuthFlowRoute) return supabaseResponse

  // ----- Maintenance gate -----
  // Runs BEFORE the user lookup so non-admin traffic is parked at /maintenance,
  // while /admin and /login fall through to the normal auth flow below — an
  // unauthenticated admin is still sent to /login first, not /maintenance.
  // Static assets (_next/*, favicon, images) are already excluded by the matcher.
  const { maintenanceMode } = await getAppSettings()
  if (maintenanceMode) {
    // The maintenance page itself renders for everyone while mode is on.
    if (pathname === "/maintenance") return supabaseResponse

    const maintenanceBypass =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname === "/login" ||
      pathname.startsWith("/login/")
    if (!maintenanceBypass) return redirectTo("/maintenance")
  } else if (pathname === "/maintenance") {
    // Mode off → the maintenance page isn't reachable; send visitors home.
    return redirectTo("/")
  }

  // ----- Authenticated user lookup -----
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes: reachable without a session. Logged-in users get bounced
  // to their dashboard instead.
  const publicRoutes = ["/login", "/register", "/forgot-password"]
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // ----- Unauthenticated -----
  if (!user) {
    if (isPublicRoute || pathname === "/") return supabaseResponse
    return redirectTo("/login")
  }

  // ----- Authenticated: resolve role + lock status -----
  const { data: profile } = await supabase
    .from("users")
    .select("role, is_locked, locked_until")
    .eq("id", user.id)
    .maybeSingle()

  const role = profile?.role ?? "student"
  const home = role === "admin" ? "/admin/dashboard" : "/dashboard"

  // Locked accounts can only see the lock screen.
  if (isLockActive(profile)) {
    if (pathname === "/account-locked") return supabaseResponse
    return redirectTo("/account-locked")
  }

  // Not locked → the lock screen isn't theirs to see.
  if (pathname === "/account-locked") return redirectTo(home)

  // Logged-in users shouldn't sit on auth pages or the bare root.
  if (isPublicRoute || pathname === "/") return redirectTo(home)

  // ----- Role-based gating -----
  const isAdminRoute = pathname.startsWith("/admin")
  if (isAdminRoute && role !== "admin") return redirectTo("/dashboard")

  const studentOnlyPrefixes = [
    "/dashboard",
    "/simulation",
    "/practice",
    "/history",
    "/sessions",
    "/leaderboard",
    "/settings",
  ]
  const isStudentOnlyRoute = studentOnlyPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  if (isStudentOnlyRoute && role === "admin") {
    return redirectTo("/admin/dashboard")
  }

  return supabaseResponse
}
