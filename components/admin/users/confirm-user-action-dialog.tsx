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
import { setUserLockAction } from "@/server/actions/users"
import type { UserActionKind } from "@/components/admin/users/user-table"
import type { UserRow } from "@/types/user"

export interface PendingUserAction {
  user: UserRow
  kind: UserActionKind
}

interface ConfirmUserActionDialogProps {
  pending: PendingUserAction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ActionCopy {
  title: string
  description: string
  confirmLabel: string
  nextLocked: boolean
  destructive: boolean
}

function copyFor(kind: UserActionKind, name: string): ActionCopy {
  switch (kind) {
    case "unlock":
      return {
        title: "Buka kunci akun ini?",
        description: `Kunci anti-cheat untuk ${name} akan dibuka sebelum 24 jam berakhir. Mahasiswa bisa mengikuti tes lagi.`,
        confirmLabel: "Unlock",
        nextLocked: false,
        destructive: false,
      }
    case "activate":
      return {
        title: "Aktifkan akun ini?",
        description: `${name} akan bisa mengakses platform kembali.`,
        confirmLabel: "Aktifkan",
        nextLocked: false,
        destructive: false,
      }
    default:
      return {
        title: "Nonaktifkan akun ini?",
        description: `${name} tidak akan bisa mengikuti tes sampai akun diaktifkan kembali.`,
        confirmLabel: "Nonaktifkan",
        nextLocked: true,
        destructive: true,
      }
  }
}

export function ConfirmUserActionDialog({
  pending,
  open,
  onOpenChange,
}: ConfirmUserActionDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const copy = pending
    ? copyFor(pending.kind, pending.user.full_name || "Pengguna ini")
    : null

  function handleConfirm() {
    if (!pending || !copy) return
    startTransition(async () => {
      try {
        const result = await setUserLockAction(pending.user.id, copy.nextLocked)
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
          <AlertDialogTitle>{copy?.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            variant={copy?.destructive ? "destructive" : "default"}
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
          >
            {isPending ? "Memproses…" : (copy?.confirmLabel ?? "Konfirmasi")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
