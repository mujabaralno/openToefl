import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { PassagesManager } from "@/components/admin/passages/passages-manager"
import { getAllPassages } from "@/server/queries/questions"

export const metadata: Metadata = {
  title: "Manajemen Passage | PTESOL",
  description: "Kelola passage bacaan untuk soal reading",
}

export default async function AdminPassagesPage() {
  const passages = await getAllPassages()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        eyebrow="Admin"
        title="Passage Reading"
        description="Kelola teks bacaan yang dipakai pada soal reading."
      />
      <PassagesManager passages={passages} />
    </div>
  )
}
