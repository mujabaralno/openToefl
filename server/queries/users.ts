import { createClient } from "@/lib/supabase/server"
import type { TestAttemptRow, UserRow } from "@/types/user"

/** All users, newest first. RLS restricts this to admins. */
export async function getAllUsers(): Promise<UserRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** All test attempts for one user, newest first. */
export async function getUserAttempts(
  userId: string
): Promise<TestAttemptRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
