"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { SessionTable } from "@/components/admin/sessions/session-table"
import { SessionFormDialog } from "@/components/admin/sessions/session-form-dialog"
import { DeleteSessionDialog } from "@/components/admin/sessions/delete-session-dialog"
import { SessionResultsDialog } from "@/components/admin/sessions/session-results-dialog"
import { getSessionParticipantsAction } from "@/server/actions/sessions"
import {
  type ParticipantResult,
  type SessionRow,
  type SessionWithStats,
} from "@/types/session"

interface SessionsManagerProps {
  sessions: SessionWithStats[]
}

export function SessionsManager({ sessions }: SessionsManagerProps) {
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<SessionRow | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<SessionRow | null>(null)

  const [resultsTarget, setResultsTarget] = React.useState<SessionRow | null>(null)
  const [participants, setParticipants] = React.useState<ParticipantResult[]>([])
  const [loadingResults, setLoadingResults] = React.useState(false)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }
  function openEdit(session: SessionRow) {
    setEditing(session)
    setFormOpen(true)
  }

  // Fetch participants in the click handler (not an effect) so we never call
  // setState during render — see the React Compiler lint notes.
  async function openResults(session: SessionRow) {
    setResultsTarget(session)
    setParticipants([])
    setLoadingResults(true)
    try {
      const result = await getSessionParticipantsAction(session.id)
      if (result.success) {
        setParticipants(result.participants)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Gagal memuat daftar peserta.")
    } finally {
      setLoadingResults(false)
    }
  }

  const emptyMessage = "Belum ada sesi. Buat sesi test pertama Anda."

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-3">
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            {sessions.length} sesi
          </p>
          <Button onClick={openCreate} className="shrink-0">
            <Plus />
            Buat Sesi
          </Button>
        </div>

        <SessionTable
          sessions={sessions}
          emptyMessage={emptyMessage}
          onResults={openResults}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      </div>

      <SessionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        session={editing}
      />

      <DeleteSessionDialog
        session={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      />

      <SessionResultsDialog
        session={resultsTarget}
        participants={participants}
        loading={loadingResults}
        open={resultsTarget !== null}
        onOpenChange={(open) => {
          if (!open) setResultsTarget(null)
        }}
      />
    </div>
  )
}
