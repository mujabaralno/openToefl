"use client"

import { Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DifficultyBadge, SectionBadge, StatusBadge } from "@/components/admin/questions/badges"
import { type PassageRow, type QuestionRow } from "@/types/question"

interface QuestionTableProps {
  questions: QuestionRow[]
  passagesById: Map<string, PassageRow>
  emptyMessage: string
  onPreview: (question: QuestionRow) => void
  onEdit: (question: QuestionRow) => void
  onDelete: (question: QuestionRow) => void
}

export function QuestionTable({
  questions,
  passagesById,
  emptyMessage,
  onPreview,
  onEdit,
  onDelete,
}: QuestionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-28">Seksi</TableHead>
          <TableHead className="min-w-64">Pertanyaan</TableHead>
          <TableHead className="w-28">Tingkat</TableHead>
          <TableHead className="w-24">Status</TableHead>
          <TableHead className="w-28 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          questions.map((question) => {
            const passage = question.passage_id ? passagesById.get(question.passage_id) : undefined

            return (
              <TableRow key={question.id}>
                <TableCell className="align-top">
                  <SectionBadge section={question.section} />
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <p className="line-clamp-2 text-foreground">{question.question_text || "—"}</p>
                  {passage && (
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      Passage: {passage.title}
                    </p>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  <DifficultyBadge difficulty={question.difficulty} />
                </TableCell>
                <TableCell className="align-top">
                  <StatusBadge status={question.is_active ? "active" : "inactive"} />
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Pratinjau soal"
                      onClick={() => onPreview(question)}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit soal"
                      onClick={() => onEdit(question)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Hapus soal"
                      onClick={() => onDelete(question)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
