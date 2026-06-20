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
import { deleteSessionAction } from "@/server/actions/sessions"
import { type SessionRow } from "@/types/session"

interface DeleteSessionDialogProps {
  session: SessionRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSessionDialog({
  session,
  open,
  onOpenChange,
}: DeleteSessionDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function handleDelete() {
    if (!session) return
    startTransition(async () => {
      try {
        const result = await deleteSessionAction(session.id)
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
          <AlertDialogTitle>Hapus sesi ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Sesi {session ? `"${session.title}"` : "ini"} beserta data peserta
            yang tergabung akan dihapus permanen. Tindakan ini tidak bisa
            dibatalkan.
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
            {isPending ? "Menghapus…" : "Hapus sesi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
