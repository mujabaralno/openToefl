"use client"

import { Pencil, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InviteCode } from "@/components/admin/sessions/invite-code"
import { SessionStatusBadge } from "@/components/admin/sessions/session-status-badge"
import { formatSessionDateTime, getSessionStatus } from "@/lib/sessions"
import { type SessionWithStats } from "@/types/session"

interface SessionTableProps {
  sessions: SessionWithStats[]
  emptyMessage: string
  onResults: (session: SessionWithStats) => void
  onEdit: (session: SessionWithStats) => void
  onDelete: (session: SessionWithStats) => void
}

export function SessionTable({
  sessions,
  emptyMessage,
  onResults,
  onEdit,
  onDelete,
}: SessionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-56">Sesi</TableHead>
          <TableHead className="w-40">Kode</TableHead>
          <TableHead className="w-44">Jadwal</TableHead>
          <TableHead className="w-24">Peserta</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="w-32 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="align-top whitespace-normal">
                <p className="font-medium text-foreground">{session.title}</p>
                {session.program_study && (
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {session.program_study}
                  </p>
                )}
              </TableCell>
              <TableCell className="align-top">
                <InviteCode code={session.invite_code} />
              </TableCell>
              <TableCell className="align-top text-xs text-muted-foreground tabular-nums">
                <p>{formatSessionDateTime(session.start_date)}</p>
                <p>s/d {formatSessionDateTime(session.end_date)}</p>
              </TableCell>
              <TableCell className="align-top tabular-nums">
                <span className="text-foreground">{session.participantCount}</span>
                {session.max_participants != null && (
                  <span className="text-muted-foreground">
                    /{session.max_participants}
                  </span>
                )}
                <p className="font-mono text-[11px] text-muted-foreground">
                  {session.completedCount} sudah test
                </p>
              </TableCell>
              <TableCell className="align-top">
                <SessionStatusBadge status={getSessionStatus(session)} />
              </TableCell>
              <TableCell className="align-top">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Lihat peserta & hasil"
                    onClick={() => onResults(session)}
                  >
                    <Users />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit sesi"
                    onClick={() => onEdit(session)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Hapus sesi"
                    onClick={() => onDelete(session)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
