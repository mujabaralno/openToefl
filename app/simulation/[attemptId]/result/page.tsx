import { type Metadata } from "next"
import { redirect } from "next/navigation"

import { ResultView } from "@/components/simulation/result-view"
import { createClient } from "@/lib/supabase/server"
import { getAiAnalysisForAttempt } from "@/server/queries/ai"
import { SECTION_CONFIG } from "@/lib/simulation"
import type { QuestionSection } from "@/types/question"

export const metadata: Metadata = {
  title: "Hasil Simulasi | PTESOL",
  description: "Hasil simulasi TOEFL ITP",
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: attempt } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("id", attemptId)
    .maybeSingle()

  if (!attempt || attempt.user_id !== user.id) redirect("/dashboard")
  if (attempt.status === "violated") redirect("/account-locked")
  if (attempt.status !== "completed") redirect("/dashboard")

  // Denominator for "% correct" = active questions per section (capped at the
  // official count).
  const sections: QuestionSection[] = ["listening", "structure", "reading"]
  const counts = await Promise.all(
    sections.map((section) =>
      supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("section", section)
        .eq("is_active", true)
    )
  )

  const totalFor = (index: number, section: QuestionSection) =>
    Math.min(counts[index].count ?? 0, SECTION_CONFIG[section].questionCount)

  const analysisRow = await getAiAnalysisForAttempt(attemptId)
  const initialAnalysis = analysisRow?.full_analysis ?? null

  return (
    <ResultView
      attempt={attempt}
      totals={{
        listening: totalFor(0, "listening"),
        structure: totalFor(1, "structure"),
        reading: totalFor(2, "reading"),
      }}
      initialAnalysis={initialAnalysis}
    />
  )
}
