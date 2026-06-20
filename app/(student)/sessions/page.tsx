import { type Metadata } from "next"
import { redirect } from "next/navigation"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JoinSessionForm } from "@/components/student/sessions/join-session-form"
import { JoinedSessionsList } from "@/components/student/sessions/joined-sessions-list"
import { createClient } from "@/lib/supabase/server"
import { getJoinedSessions } from "@/server/queries/sessions"

export const metadata: Metadata = {
  title: "Sesi Test | PTESOL",
  description: "Gabung sesi test via kode undangan",
}

export default async function StudentSessionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const sessions = await getJoinedSessions(user.id)

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <PageHeader
        eyebrow="Sesi"
        title="Sesi Test"
        description="Gabung ke sesi test yang dibuat admin menggunakan kode undangan."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gabung sesi baru</CardTitle>
        </CardHeader>
        <CardContent>
          <JoinSessionForm />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Sesi saya</h2>
        <JoinedSessionsList sessions={sessions} />
      </div>
    </div>
  )
}
