"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { attemptStatusLabels } from "@/lib/users"
import type { Enums } from "@/types/database.types"
import type { TestAttemptRow, UserRow } from "@/types/user"

interface UserAttemptsDialogProps {
  user: UserRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  attempts: TestAttemptRow[]
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const statusVariant: Record<
  Enums<"test_status">,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  in_progress: "secondary",
  completed: "default",
  violated: "destructive",
}

export function UserAttemptsDialog({
  user,
  open,
  onOpenChange,
  loading,
  attempts,
}: UserAttemptsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Riwayat tes</DialogTitle>
          <DialogDescription>
            {user ? user.full_name || user.email : ""}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : attempts.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Belum ada riwayat tes.
          </p>
        ) : (
          <div className="rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-40">Tanggal mulai</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-20 text-right">Skor</TableHead>
                  <TableHead className="w-28 text-right">L / S / R</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="align-top">
                      {formatDateTime(attempt.started_at)}
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={statusVariant[attempt.status]}>
                        {attemptStatusLabels[attempt.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-right font-mono tabular-nums">
                      {attempt.total_score ?? "—"}
                    </TableCell>
                    <TableCell className="align-top text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {attempt.listening_converted ?? "–"} /{" "}
                      {attempt.structure_converted ?? "–"} /{" "}
                      {attempt.reading_converted ?? "–"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
