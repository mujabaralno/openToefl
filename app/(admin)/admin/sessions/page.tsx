import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { SessionsManager } from "@/components/admin/sessions/sessions-manager"
import { getAllSessions } from "@/server/queries/sessions"

export const metadata: Metadata = {
  title: "Manajemen Sesi | PTESOL",
  description: "Buat dan kelola sesi test TOEFL ITP",
}

export default async function AdminSessionsPage() {
  const sessions = await getAllSessions()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
      <PageHeader
        eyebrow="Admin"
        title="Manajemen Sesi"
        description="Buat sesi test, bagikan kode undangan, dan ekspor hasil ke Excel."
      />
      <SessionsManager sessions={sessions} />
    </div>
  )
}
