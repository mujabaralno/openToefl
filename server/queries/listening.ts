import { createClient } from "@/lib/supabase/server"
import type { ListeningGroupRow } from "@/types/listening"

/** All listening groups (Part B/C shared audio), newest first. */
export async function getAllListeningGroups(): Promise<ListeningGroupRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("listening_groups")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
