"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SectionBadge } from "@/components/admin/questions/badges"
import { cn } from "@/lib/utils"
import { parseOptions } from "@/lib/questions"
import { ANSWER_KEYS } from "@/lib/validations/question"
import { type PassageRow, type QuestionRow } from "@/types/question"

interface QuestionPreviewDialogProps {
  question: QuestionRow | null
  passagesById: Map<string, PassageRow>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuestionPreviewDialog({
  question,
  passagesById,
  open,
  onOpenChange,
}: QuestionPreviewDialogProps) {
  const passage = question?.passage_id
    ? passagesById.get(question.passage_id)
    : undefined
  const options = question ? parseOptions(question.options) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pratinjau soal</DialogTitle>
          <DialogDescription>
            Tampilan soal seperti yang dilihat mahasiswa.
          </DialogDescription>
        </DialogHeader>

        {question && options && (
          <div className="flex flex-col gap-5">
            <SectionBadge section={question.section} />

            {passage && (
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  Passage
                </p>
                <h3 className="mt-1 font-medium text-foreground">
                  {passage.title}
                </h3>
                <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">
                  {passage.content}
                </p>
              </div>
            )}

            {question.question_text && (
              <p className="leading-relaxed font-medium text-foreground">
                {question.question_text}
              </p>
            )}

            <ul className="flex flex-col gap-2">
              {ANSWER_KEYS.map((key) => {
                const isCorrect = key === question.correct_answer
                return (
                  <li
                    key={key}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm",
                      isCorrect && "border-primary bg-primary/5"
                    )}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-medium text-muted-foreground">
                      {key}
                    </span>
                    <span className="flex-1 text-foreground">
                      {options[key]}
                    </span>
                    {isCorrect && <Badge>Kunci</Badge>}
                  </li>
                )
              })}
            </ul>

            {question.explanation && (
              <div className="rounded-lg border border-border p-4">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  Penjelasan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
