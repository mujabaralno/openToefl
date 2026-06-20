"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteQuestionAction } from "@/server/actions/questions"
import { type QuestionRow } from "@/types/question"

interface DeleteQuestionDialogProps {
  question: QuestionRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteQuestionDialog({
  question,
  open,
  onOpenChange,
}: DeleteQuestionDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function handleDelete() {
    if (!question) return
    startTransition(async () => {
      try {
        const result = await deleteQuestionAction(question.id)
        if (result.success) {
          toast.success(result.message)
          router.refresh()
          onOpenChange(false)
        } else {
          toast.error(result.message)
        }
      } catch {
        toast.error("Terjadi kesalahan sistem.")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus soal ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Soal akan dihapus permanen beserta jawaban yang terkait. Tindakan
            ini tidak bisa dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
          >
            {isPending ? "Menghapus…" : "Hapus soal"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
