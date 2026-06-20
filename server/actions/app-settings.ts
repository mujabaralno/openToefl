"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { invalidateAppSettingsCache } from "@/lib/get-app-settings"
import { maintenanceSchema } from "@/lib/validations/app-settings"
import { type ActionResult } from "@/types/auth"

/**
 * Toggle maintenance mode (and optionally its message). Admin-only.
 *
 * Updates the singleton app_settings row, then revalidates `/` and busts the
 * settings cache so the change takes effect as quickly as possible. Remaining
 * runtime isolates (e.g. the Edge middleware) converge within the cache TTL.
 */
export async function updateMaintenanceMode(
  enabled: boolean,
  message?: string
): Promise<ActionResult> {
  const parsed = maintenanceSchema.safeParse({ enabled, message })
  if (!parsed.success) {
    return { success: false, message: "Data pengaturan tidak valid." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") {
    return { success: false, message: "Akses ditolak." }
  }

  const trimmed = parsed.data.message?.trim()
  const payload = {
    maintenance_mode: parsed.data.enabled,
    maintenance_message: trimmed ? trimmed : null,
    updated_by: user.id,
  }

  // Singleton row — update the one that exists, or seed it if somehow missing.
  const { data: existing } = await supabase
    .from("app_settings")
    .select("id")
    .limit(1)
    .maybeSingle()

  const { error } = existing
    ? await supabase.from("app_settings").update(payload).eq("id", existing.id)
    : await supabase.from("app_settings").insert(payload)

  if (error) return { success: false, message: error.message }

  invalidateAppSettingsCache()
  revalidatePath("/")
  revalidatePath("/admin/settings")
  revalidatePath("/maintenance")

  return {
    success: true,
    message: parsed.data.enabled
      ? "Maintenance mode diaktifkan."
      : "Maintenance mode dimatikan.",
  }
}
