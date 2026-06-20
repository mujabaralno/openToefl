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
import { deletePassageAction } from "@/server/actions/passages"
import { type PassageRow } from "@/types/question"

interface DeletePassageDialogProps {
  passage: PassageRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePassageDialog({
  passage,
  open,
  onOpenChange,
}: DeletePassageDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function handleDelete() {
    if (!passage) return
    startTransition(async () => {
      try {
        const result = await deletePassageAction(passage.id)
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
          <AlertDialogTitle>Hapus passage ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Passage akan dihapus permanen. Soal reading yang memakainya akan
            kehilangan passage dan perlu dipasangkan ulang.
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
            {isPending ? "Menghapus…" : "Hapus passage"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
