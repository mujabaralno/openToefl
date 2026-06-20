"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { roleLabels } from "@/lib/users"
import type { Enums } from "@/types/database.types"

export type RoleFilter = Enums<"user_role"> | "all"

interface UserFiltersProps {
  search: string
  role: RoleFilter
  program: string
  programOptions: string[]
  onSearchChange: (value: string) => void
  onRoleChange: (value: RoleFilter) => void
  onProgramChange: (value: string) => void
}

export function UserFilters({
  search,
  role,
  program,
  programOptions,
  onSearchChange,
  onRoleChange,
  onProgramChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama, email, atau NIM…"
          aria-label="Cari pengguna"
          className="pl-8"
        />
      </div>

      <Select value={role} onValueChange={(value) => onRoleChange(value as RoleFilter)}>
        <SelectTrigger aria-label="Filter peran" className="w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua peran</SelectItem>
          <SelectItem value="student">{roleLabels.student}</SelectItem>
          <SelectItem value="admin">{roleLabels.admin}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={program} onValueChange={onProgramChange}>
        <SelectTrigger aria-label="Filter program studi" className="w-full sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua prodi</SelectItem>
          {programOptions.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
