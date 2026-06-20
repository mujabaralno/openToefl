import { createClient } from "@/lib/supabase/server"
import { type PassageRow, type QuestionRow } from "@/types/question"

/**
 * Fetch every question, newest first. RLS restricts writes to admins; reads
 * are allowed for any authenticated user, so the admin pages get the full set.
 */
export async function getAllQuestions(): Promise<QuestionRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Fetch all reading passages, newest first (for the reading question form). */
export async function getAllPassages(): Promise<PassageRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("passages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
