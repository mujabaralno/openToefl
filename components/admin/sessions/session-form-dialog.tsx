"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SessionForm } from "@/components/admin/sessions/session-form"
import { emptySessionForm, sessionToForm } from "@/lib/sessions"
import { type SessionRow } from "@/types/session"

interface SessionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present → edit mode; null → create mode. */
  session: SessionRow | null
}

export function SessionFormDialog({
  open,
  onOpenChange,
  session,
}: SessionFormDialogProps) {
  const mode = session ? "edit" : "create"
  const defaultValues = session ? sessionToForm(session) : emptySessionForm()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit sesi" : "Buat sesi"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Perbarui detail sesi lalu simpan."
              : "Kode undangan unik dibuat otomatis saat sesi disimpan."}
          </DialogDescription>
        </DialogHeader>
        <SessionForm
          key={session?.id ?? "new"}
          mode={mode}
          sessionId={session?.id}
          defaultValues={defaultValues}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
