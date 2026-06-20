import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { PracticeSetup } from "@/components/practice/practice-setup"
import { QUESTION_SECTIONS } from "@/lib/validations/question"
import type { QuestionSection } from "@/types/question"

export const metadata: Metadata = {
  title: "Mode Latihan | PTESOL",
  description: "Latihan soal TOEFL ITP per seksi",
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>
}) {
  const sp = await searchParams
  const defaultSection: QuestionSection =
    sp.section && (QUESTION_SECTIONS as readonly string[]).includes(sp.section)
      ? (sp.section as QuestionSection)
      : "listening"

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <PageHeader
        eyebrow="Mahasiswa"
        title="Mode Latihan"
        description="Latih per seksi sesantai Anda mau. Tidak memengaruhi skor simulasi."
      />
      <PracticeSetup defaultSection={defaultSection} />
    </div>
  )
}
