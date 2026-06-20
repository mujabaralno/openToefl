import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { LeaderboardView } from "@/components/leaderboard/leaderboard-view"
import { createClient } from "@/lib/supabase/server"
import { getLeaderboardData } from "@/server/queries/leaderboard"
import type { LeaderboardPeriod } from "@/types/leaderboard"

export const metadata: Metadata = {
  title: "Leaderboard | PTESOL",
  description: "Peringkat skor simulasi TOEFL ITP",
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const sp = await searchParams
  const period: LeaderboardPeriod =
    sp.period === "month" || sp.period === "week" ? sp.period : "all"

  const entries = await getLeaderboardData(period)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <PageHeader
        eyebrow="Mahasiswa"
        title="Leaderboard"
        description="Peringkat skor simulasi TOEFL ITP tertinggi."
      />
      <LeaderboardView
        entries={entries}
        period={period}
        currentUserId={user?.id ?? ""}
      />
    </div>
  )
}
