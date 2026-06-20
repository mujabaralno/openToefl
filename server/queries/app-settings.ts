import { createClient } from "@/lib/supabase/server"
import { type Tables } from "@/types/database.types"

export type AppSettingsRow = Tables<"app_settings">

/**
 * Read the singleton app_settings row with the authenticated client (fresh,
 * uncached) — used by the admin settings page so the toggle always reflects the
 * true current value, and by the /maintenance page to show the message.
 */
export async function getAppSettingsRow(): Promise<AppSettingsRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}
