"use client"

import * as React from "react"
import { FileUp, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ImportQuestionsDialog } from "@/components/admin/questions/import-questions-dialog"
import {
  QuestionFilters,
  type DifficultyFilter,
  type SectionFilter,
} from "@/components/admin/questions/question-filters"
import { QuestionTable } from "@/components/admin/questions/question-table"
import { QuestionPagination } from "@/components/admin/questions/question-pagination"
import { QuestionFormDialog } from "@/components/admin/questions/question-form-dialog"
import { DeleteQuestionDialog } from "@/components/admin/questions/delete-question-dialog"
import { QuestionPreviewDialog } from "@/components/admin/questions/question-preview-dialog"
import { type PassageRow, type QuestionRow } from "@/types/question"
import { type ListeningGroupRow } from "@/types/listening"

interface QuestionsManagerProps {
  questions: QuestionRow[]
  passages: PassageRow[]
  listeningGroups: ListeningGroupRow[]
}

const PAGE_SIZE = 10

export function QuestionsManager({ questions, passages, listeningGroups }: QuestionsManagerProps) {
  const [section, setSection] = React.useState<SectionFilter>("all")
  const [difficulty, setDifficulty] = React.useState<DifficultyFilter>("all")
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)

  const [formOpen, setFormOpen] = React.useState(false)
  const [importOpen, setImportOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<QuestionRow | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<QuestionRow | null>(null)
  const [previewTarget, setPreviewTarget] = React.useState<QuestionRow | null>(null)

  const passagesById = React.useMemo(
    () => new Map(passages.map((passage) => [passage.id, passage])),
    [passages]
  )

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return questions.filter((question) => {
      if (section !== "all" && question.section !== section) return false
      if (difficulty !== "all" && question.difficulty !== difficulty) return false
      if (query && !(question.question_text ?? "").toLowerCase().includes(query)) return false
      return true
    })
  }, [questions, section, difficulty, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const rangeFrom = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const rangeTo = Math.min(safePage * PAGE_SIZE, filtered.length)

  // Filtering changes the result set, so jump back to the first page.
  function changeSection(value: SectionFilter) {
    setSection(value)
    setPage(1)
  }
  function changeDifficulty(value: DifficultyFilter) {
    setDifficulty(value)
    setPage(1)
  }
  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }
  function openEdit(question: QuestionRow) {
    setEditing(question)
    setFormOpen(true)
  }

  const emptyMessage =
    questions.length === 0
      ? "Belum ada soal. Tambah soal pertama Anda."
      : "Tidak ada soal yang cocok dengan filter."

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between">
          <QuestionFilters
            section={section}
            difficulty={difficulty}
            search={search}
            onSectionChange={changeSection}
            onDifficultyChange={changeDifficulty}
            onSearchChange={changeSearch}
          />
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <FileUp />
              Import Excel
            </Button>
            <Button onClick={openCreate}>
              <Plus />
              Tambah Soal
            </Button>
          </div>
        </div>

        <QuestionTable
          questions={paged}
          passagesById={passagesById}
          emptyMessage={emptyMessage}
          onPreview={setPreviewTarget}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        {filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border bg-muted/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
              Menampilkan {rangeFrom}–{rangeTo} dari {filtered.length} soal
            </p>
            {totalPages > 1 && (
              <QuestionPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
            )}
          </div>
        )}
      </div>

      <QuestionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        question={editing}
        passages={passages}
        listeningGroups={listeningGroups}
      />

      <ImportQuestionsDialog open={importOpen} onOpenChange={setImportOpen} />

      <DeleteQuestionDialog
        question={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      />

      <QuestionPreviewDialog
        question={previewTarget}
        passagesById={passagesById}
        open={previewTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewTarget(null)
        }}
      />
    </div>
  )
}
