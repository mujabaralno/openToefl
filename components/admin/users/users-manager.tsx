"use client"

import * as React from "react"

import {
  UserFilters,
  type RoleFilter,
} from "@/components/admin/users/user-filters"
import {
  UserTable,
  type UserActionKind,
} from "@/components/admin/users/user-table"
import {
  ConfirmUserActionDialog,
  type PendingUserAction,
} from "@/components/admin/users/confirm-user-action-dialog"
import { UserAttemptsDialog } from "@/components/admin/users/user-attempts-dialog"
import { getUserAttemptsAction } from "@/server/actions/users"
import type { TestAttemptRow, UserRow } from "@/types/user"

interface UsersManagerProps {
  users: UserRow[]
  currentUserId: string
}

export function UsersManager({ users, currentUserId }: UsersManagerProps) {
  const [search, setSearch] = React.useState("")
  const [role, setRole] = React.useState<RoleFilter>("all")
  const [program, setProgram] = React.useState("all")

  const [pending, setPending] = React.useState<PendingUserAction | null>(null)
  const [attemptsUser, setAttemptsUser] = React.useState<UserRow | null>(null)
  const [attemptsLoading, setAttemptsLoading] = React.useState(false)
  const [attempts, setAttempts] = React.useState<TestAttemptRow[]>([])
  // Guards against an earlier request overwriting a later one.
  const requestRef = React.useRef(0)

  const programOptions = React.useMemo(() => {
    const set = new Set<string>()
    for (const user of users) {
      if (user.program_study) set.add(user.program_study)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [users])

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      if (role !== "all" && user.role !== role) return false
      if (program !== "all" && user.program_study !== program) return false
      if (query) {
        const haystack = [user.full_name, user.email, user.student_id ?? ""]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [users, role, program, search])

  const emptyMessage =
    users.length === 0
      ? "Belum ada pengguna terdaftar."
      : "Tidak ada pengguna yang cocok dengan filter."

  function handleAction(user: UserRow, kind: UserActionKind) {
    setPending({ user, kind })
  }

  function viewAttempts(user: UserRow) {
    const requestId = ++requestRef.current
    setAttemptsUser(user)
    setAttemptsLoading(true)
    setAttempts([])
    getUserAttemptsAction(user.id)
      .then((result) => {
        if (requestRef.current === requestId) setAttempts(result.attempts)
      })
      .finally(() => {
        if (requestRef.current === requestId) setAttemptsLoading(false)
      })
  }

  return (
    <div className="flex flex-col gap-4">
      <UserFilters
        search={search}
        role={role}
        program={program}
        programOptions={programOptions}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onProgramChange={setProgram}
      />

      <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
        {filtered.length} dari {users.length} pengguna
      </p>

      <UserTable
        users={filtered}
        currentUserId={currentUserId}
        emptyMessage={emptyMessage}
        onViewAttempts={viewAttempts}
        onAction={handleAction}
      />

      <ConfirmUserActionDialog
        pending={pending}
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
      />

      <UserAttemptsDialog
        user={attemptsUser}
        open={attemptsUser !== null}
        loading={attemptsLoading}
        attempts={attempts}
        onOpenChange={(open) => {
          if (!open) setAttemptsUser(null)
        }}
      />
    </div>
  )
}
