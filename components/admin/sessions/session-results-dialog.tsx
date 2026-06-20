"use client"

import { Download, FileSpreadsheet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { exportSessionResults } from "@/lib/excel"
import { type ParticipantResult, type SessionRow } from "@/types/session"

interface SessionResultsDialogProps {
  session: SessionRow | null
  participants: ParticipantResult[]
  loading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SessionResultsDialog({
  session,
  participants,
  loading,
  open,
  onOpenChange,
}: SessionResultsDialogProps) {
  const hasParticipants = participants.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Peserta &amp; hasil</DialogTitle>
          <DialogDescription>
            {session?.title ?? "Sesi"} — daftar peserta yang sudah/belum
            mengikuti test.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : hasParticipants ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-40">Nama</TableHead>
                  <TableHead className="w-28">NIM</TableHead>
                  <TableHead className="w-16 text-right">L</TableHead>
                  <TableHead className="w-16 text-right">S</TableHead>
                  <TableHead className="w-16 text-right">R</TableHead>
                  <TableHead className="w-20 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => (
                  <TableRow key={p.userId}>
                    <TableCell className="align-top">
                      <p className="font-medium text-foreground">{p.fullName}</p>
                      {!p.hasResult && (
                        <Badge variant="outline" className="mt-1">
                          Belum test
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="align-top font-mono text-xs text-muted-foreground">
                      {p.studentId ?? "—"}
                    </TableCell>
                    <TableCell className="align-top text-right tabular-nums">
                      {p.listeningConverted ?? "—"}
                    </TableCell>
                    <TableCell className="align-top text-right tabular-nums">
                      {p.structureConverted ?? "—"}
                    </TableCell>
                    <TableCell className="align-top text-right tabular-nums">
                      {p.readingConverted ?? "—"}
                    </TableCell>
                    <TableCell className="align-top text-right font-semibold tabular-nums">
                      {p.totalScore ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
            <FileSpreadsheet className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Belum ada peserta yang bergabung ke sesi ini.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            disabled={!session || !hasParticipants}
            onClick={() => {
              if (session) exportSessionResults(session.title, participants)
            }}
          >
            <Download />
            Export Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
