import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { HistoryView } from "@/components/history/history-view"
import { getHistoryEntries } from "@/server/queries/history"

export const metadata: Metadata = {
  title: "Riwayat | PTESOL",
  description: "Riwayat simulasi dan latihan Anda",
}

export default async function HistoryPage() {
  const entries = await getHistoryEntries()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <PageHeader
        eyebrow="Mahasiswa"
        title="Riwayat"
        description="Semua simulasi dan latihan Anda. Klik baris untuk lihat detail."
      />
      <HistoryView entries={entries} />
    </div>
  )
}
