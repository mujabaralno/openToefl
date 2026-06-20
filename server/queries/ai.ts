import { createClient } from "@/lib/supabase/server"
import type { AiAnalysisRow } from "@/types/ai"

/** Latest AI analysis for a test attempt (RLS: own only), or null. */
export async function getAiAnalysisForAttempt(
  attemptId: string
): Promise<AiAnalysisRow | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("ai_analyses")
    .select("*")
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  return data ?? null
}
