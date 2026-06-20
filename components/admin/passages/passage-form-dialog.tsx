"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PassageForm } from "@/components/admin/passages/passage-form"
import { type PassageRow } from "@/types/question"

interface PassageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present → edit mode; null → create mode. */
  passage: PassageRow | null
}

export function PassageFormDialog({
  open,
  onOpenChange,
  passage,
}: PassageFormDialogProps) {
  const mode = passage ? "edit" : "create"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit passage" : "Tambah passage"}
          </DialogTitle>
          <DialogDescription>
            Passage dipakai sebagai bahan bacaan pada soal reading.
          </DialogDescription>
        </DialogHeader>
        <PassageForm
          key={passage?.id ?? "new"}
          mode={mode}
          passageId={passage?.id}
          defaultValues={{
            title: passage?.title ?? "",
            content: passage?.content ?? "",
          }}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
