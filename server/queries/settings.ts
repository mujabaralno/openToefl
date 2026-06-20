import { createClient } from "@/lib/supabase/server"
import type { LanguagePreference, ThemePreference } from "@/types/settings"

export interface SettingsData {
  userId: string
  theme: ThemePreference
  language: LanguagePreference
  emailNotifications: boolean
  inappNotifications: boolean
  hideLeaderboard: boolean
  profile: {
    fullName: string
    studentId: string
    programStudy: string
    avatarUrl: string
    email: string
  }
}

/** The current user's settings + profile, with defaults when no row exists. */
export async function getSettings(): Promise<SettingsData | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase
      .from("users")
      .select(
        "full_name, student_id, program_study, avatar_url, email, hide_leaderboard"
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
  ])

  return {
    userId: user.id,
    theme: settings?.theme ?? "system",
    language: settings?.language ?? "id",
    emailNotifications: settings?.email_notifications ?? true,
    inappNotifications: settings?.inapp_notifications ?? true,
    hideLeaderboard: profile?.hide_leaderboard ?? false,
    profile: {
      fullName: profile?.full_name ?? "",
      studentId: profile?.student_id ?? "",
      programStudy: profile?.program_study ?? "",
      avatarUrl: profile?.avatar_url ?? "",
      email: profile?.email ?? user.email ?? "",
    },
  }
}
