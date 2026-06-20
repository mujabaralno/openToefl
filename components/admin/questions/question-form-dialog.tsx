"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QuestionForm } from "@/components/admin/questions/question-form"
import { emptyQuestionForm, questionToForm } from "@/lib/questions"
import { type PassageRow, type QuestionRow } from "@/types/question"
import { type ListeningGroupRow } from "@/types/listening"

interface QuestionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present → edit mode; null → create mode. */
  question: QuestionRow | null
  passages: PassageRow[]
  listeningGroups: ListeningGroupRow[]
}

export function QuestionFormDialog({
  open,
  onOpenChange,
  question,
  passages,
  listeningGroups,
}: QuestionFormDialogProps) {
  const mode = question ? "edit" : "create"
  const defaultValues = question
    ? questionToForm(question, listeningGroups)
    : emptyQuestionForm()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit soal" : "Tambah soal"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Perbarui detail soal lalu simpan."
              : "Isi detail soal sesuai seksi yang dipilih."}
          </DialogDescription>
        </DialogHeader>
        <QuestionForm
          // Remount when switching between create/edit targets so the form
          // resets to the right defaults.
          key={question?.id ?? "new"}
          mode={mode}
          questionId={question?.id}
          defaultValues={defaultValues}
          passages={passages}
          listeningGroups={listeningGroups}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
