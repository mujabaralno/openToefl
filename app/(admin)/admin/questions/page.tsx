import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { QuestionsManager } from "@/components/admin/questions/questions-manager"
import { getAllPassages, getAllQuestions } from "@/server/queries/questions"
import { getAllListeningGroups } from "@/server/queries/listening"

export const metadata: Metadata = {
  title: "Manajemen Soal | PTESOL",
  description: "Kelola bank soal TOEFL ITP",
}

export default async function AdminQuestionsPage() {
  const [questions, passages, listeningGroups] = await Promise.all([
    getAllQuestions(),
    getAllPassages(),
    getAllListeningGroups(),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        eyebrow="Admin"
        title="Bank Soal"
        description="Kelola soal Listening, Structure, dan Reading."
      />
      <QuestionsManager
        questions={questions}
        passages={passages}
        listeningGroups={listeningGroups}
      />
    </div>
  )
}
