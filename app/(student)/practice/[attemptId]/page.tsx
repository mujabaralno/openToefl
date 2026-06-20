import { redirect } from "next/navigation"

import { PageHeader } from "@/components/dashboard/page-header"
import { PracticeRunner } from "@/components/practice/practice-runner"
import { PracticeResult } from "@/components/practice/practice-result"
import { createClient } from "@/lib/supabase/server"
import { getPracticeAttempt } from "@/server/queries/practice"
import { sectionLabels } from "@/lib/questions"

export default async function PracticeAttemptPage({
  params,
  searchParams,
}: {
  params: Promise<{ attemptId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { attemptId } = await params
  const sp = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const data = await getPracticeAttempt(attemptId)
  if (!data || data.attempt.user_id !== user.id) redirect("/practice")

  if (data.attempt.status === "completed") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <PageHeader
          eyebrow="Latihan selesai"
          title={`Hasil ${sectionLabels[data.attempt.section]}`}
          description="Tinjau jawaban dan penjelasan per soal."
        />
        <PracticeResult attempt={data.attempt} items={data.items} />
      </div>
    )
  }

  const durationValue =
    typeof sp.duration === "string" ? Number(sp.duration) : NaN
  const duration =
    Number.isFinite(durationValue) && durationValue > 0 ? durationValue : null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <PageHeader
        eyebrow={`Latihan · ${sectionLabels[data.attempt.section]}`}
        title="Kerjakan soal"
        description="Pilih jawaban, lalu klik selesai untuk melihat hasil."
      />
      <PracticeRunner
        attemptId={attemptId}
        items={data.items}
        durationSeconds={duration}
      />
    </div>
  )
}
