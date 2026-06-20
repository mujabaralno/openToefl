import { redirect } from "next/navigation"

import { SectionRunner } from "@/components/simulation/section-runner"
import { ListeningRunner } from "@/components/simulation/listening-runner"
import { createClient } from "@/lib/supabase/server"
import {
  SECTION_CONFIG,
  computeSecondsRemaining,
  sectionDurationSeconds,
  shuffle,
} from "@/lib/simulation"
import type { PassageRow, QuestionRow, QuestionSection } from "@/types/question"
import type { ListeningGroupRow } from "@/types/listening"

interface SimulationSectionPageProps {
  attemptId: string
  section: QuestionSection
}

const startedAtColumn: Record<
  QuestionSection,
  "listening_started_at" | "structure_started_at" | "reading_started_at"
> = {
  listening: "listening_started_at",
  structure: "structure_started_at",
  reading: "reading_started_at",
}

/**
 * Shared server logic for the three section routes: guard the attempt, load the
 * section's questions (and passages for reading), and hand off to the client
 * runner with a refresh-safe initial countdown.
 */
export async function SimulationSectionPage({
  attemptId,
  section,
}: SimulationSectionPageProps) {
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

  if (!attempt || attempt.user_id !== user.id) redirect("/simulation")
  if (attempt.status !== "in_progress") redirect("/dashboard")

  const { data: questionData } = await supabase
    .from("questions")
    .select("*")
    .eq("section", section)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(SECTION_CONFIG[section].questionCount)

  const questions: QuestionRow[] = questionData ?? []

  // Listening order: Part A (ungrouped) first, then Part B & C conversation
  // groups. Audio is per-question. Part A items are shuffled; B/C groups are
  // shuffled as whole units, with questions inside kept in order_in_group.
  if (section === "listening") {
    const ungrouped = questions.filter((question) => !question.group_id)
    const grouped = questions.filter((question) => question.group_id)

    const groupIds = Array.from(
      new Set(
        grouped
          .map((question) => question.group_id)
          .filter((id): id is string => Boolean(id))
      )
    )

    let groups: ListeningGroupRow[] = []
    if (groupIds.length > 0) {
      const { data } = await supabase
        .from("listening_groups")
        .select("*")
        .in("id", groupIds)
      groups = data ?? []
    }
    const groupById = new Map(groups.map((group) => [group.id, group]))

    const questionsByGroup = new Map<string, QuestionRow[]>()
    for (const question of grouped) {
      if (!question.group_id) continue
      const list = questionsByGroup.get(question.group_id) ?? []
      list.push(question)
      questionsByGroup.set(question.group_id, list)
    }

    const groupBlocksB: QuestionRow[][] = []
    const groupBlocksC: QuestionRow[][] = []
    for (const [groupId, groupQuestions] of questionsByGroup) {
      const group = groupById.get(groupId)
      if (!group) continue
      const ordered = [...groupQuestions].sort(
        (a, b) => (a.order_in_group ?? 0) - (b.order_in_group ?? 0)
      )
      if (group.part === "C") groupBlocksC.push(ordered)
      else groupBlocksB.push(ordered)
    }

    const orderedQuestions: QuestionRow[] = [
      ...shuffle(ungrouped),
      ...shuffle(groupBlocksB).flat(),
      ...shuffle(groupBlocksC).flat(),
    ]

    return (
      <ListeningRunner attemptId={attemptId} questions={orderedQuestions} />
    )
  }

  let passages: PassageRow[] = []
  if (section === "reading") {
    const ids = Array.from(
      new Set(
        questions
          .map((question) => question.passage_id)
          .filter((id): id is string => Boolean(id))
      )
    )
    if (ids.length > 0) {
      const { data } = await supabase
        .from("passages")
        .select("*")
        .in("id", ids)
      passages = data ?? []
    }
  }

  const initialSeconds = computeSecondsRemaining(
    attempt[startedAtColumn[section]],
    sectionDurationSeconds(section)
  )

  return (
    <SectionRunner
      attemptId={attemptId}
      section={section}
      questions={questions}
      passages={passages}
      initialSeconds={initialSeconds}
    />
  )
}
