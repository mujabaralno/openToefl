"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import {
  appearanceSchema,
  notificationsSchema,
  passwordSchema,
  profileSchema,
} from "@/lib/validations/settings"
import type { ActionResult } from "@/types/auth"
import type {
  LanguagePreference,
  PasswordFormData,
  ProfileFormData,
  ThemePreference,
} from "@/types/settings"

export async function updateAppearanceAction(
  theme: ThemePreference,
  language: LanguagePreference
): Promise<ActionResult> {
  const parsed = appearanceSchema.safeParse({ theme, language })
  if (!parsed.success) return { success: false, message: "Pengaturan tidak valid." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Sesi berakhir." }

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      { user_id: user.id, theme: parsed.data.theme, language: parsed.data.language },
      { onConflict: "user_id" }
    )
  if (error) return { success: false, message: error.message }
  return { success: true, message: "Tampilan disimpan." }
}

export async function updateNotificationsAction(
  emailNotifications: boolean,
  inappNotifications: boolean
): Promise<ActionResult> {
  const parsed = notificationsSchema.safeParse({
    email_notifications: emailNotifications,
    inapp_notifications: inappNotifications,
  })
  if (!parsed.success) return { success: false, message: "Pengaturan tidak valid." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Sesi berakhir." }

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        email_notifications: parsed.data.email_notifications,
        inapp_notifications: parsed.data.inapp_notifications,
      },
      { onConflict: "user_id" }
    )
  if (error) return { success: false, message: error.message }
  return { success: true, message: "Preferensi notifikasi disimpan." }
}

export async function updatePrivacyAction(
  hideLeaderboard: boolean
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Sesi berakhir." }

  const { error } = await supabase
    .from("users")
    .update({ hide_leaderboard: hideLeaderboard })
    .eq("id", user.id)
  if (error) return { success: false, message: error.message }
  revalidatePath("/leaderboard")
  return { success: true, message: "Pengaturan privasi disimpan." }
}

export async function updateProfileAction(
  data: ProfileFormData
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(data)
  if (!parsed.success) return { success: false, message: "Data profil tidak valid." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Sesi berakhir." }

  const { error } = await supabase
    .from("users")
    .update({
      full_name: parsed.data.full_name,
      student_id: parsed.data.student_id || null,
      program_study: parsed.data.program_study || null,
      avatar_url: parsed.data.avatar_url || null,
    })
    .eq("id", user.id)
  if (error) return { success: false, message: error.message }
  revalidatePath("/settings")
  return { success: true, message: "Profil berhasil diperbarui." }
}

export async function changePasswordAction(
  data: PasswordFormData
): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Data password tidak valid." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return { success: false, message: "Sesi berakhir." }

  // Re-authenticate: verify the current password before changing it.
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  })
  if (reauthError) {
    return { success: false, message: "Password saat ini salah." }
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  })
  if (error) return { success: false, message: error.message }
  return { success: true, message: "Password berhasil diubah." }
}
