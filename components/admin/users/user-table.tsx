"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AccountStatusBadge,
  RoleBadge,
} from "@/components/admin/users/badges"
import { getAccountStatus } from "@/lib/users"
import type { UserRow } from "@/types/user"

export type UserActionKind = "unlock" | "deactivate" | "activate"

interface UserTableProps {
  users: UserRow[]
  currentUserId: string
  emptyMessage: string
  onViewAttempts: (user: UserRow) => void
  onAction: (user: UserRow, kind: UserActionKind) => void
}

function actionForStatus(
  status: ReturnType<typeof getAccountStatus>
): { kind: UserActionKind; label: string; destructive: boolean } {
  switch (status) {
    case "locked":
      return { kind: "unlock", label: "Unlock", destructive: false }
    case "disabled":
      return { kind: "activate", label: "Aktifkan", destructive: false }
    default:
      return { kind: "deactivate", label: "Nonaktifkan", destructive: true }
  }
}

export function UserTable({
  users,
  currentUserId,
  emptyMessage,
  onViewAttempts,
  onAction,
}: UserTableProps) {
  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-40">Nama</TableHead>
            <TableHead className="min-w-48">Email</TableHead>
            <TableHead className="w-28">NIM</TableHead>
            <TableHead className="min-w-36">Prodi</TableHead>
            <TableHead className="w-24">Peran</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-32 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const status = getAccountStatus(user)
              const action = actionForStatus(status)
              const isSelf = user.id === currentUserId

              return (
                <TableRow key={user.id}>
                  <TableCell className="align-top whitespace-normal font-medium">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-left text-foreground"
                      onClick={() => onViewAttempts(user)}
                    >
                      {user.full_name || "(tanpa nama)"}
                    </Button>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="align-top font-mono text-xs">
                    {user.student_id || "—"}
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    {user.program_study || "—"}
                  </TableCell>
                  <TableCell className="align-top">
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="align-top">
                    <AccountStatusBadge status={status} />
                  </TableCell>
                  <TableCell className="align-top text-right">
                    {isSelf ? (
                      <span className="font-mono text-xs text-muted-foreground">
                        Anda
                      </span>
                    ) : (
                      <Button
                        variant={action.destructive ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => onAction(user, action.kind)}
                      >
                        {action.label}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
