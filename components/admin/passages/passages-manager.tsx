"use client"

import * as React from "react"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PassageTable } from "@/components/admin/passages/passage-table"
import { PassageFormDialog } from "@/components/admin/passages/passage-form-dialog"
import { DeletePassageDialog } from "@/components/admin/passages/delete-passage-dialog"
import { type PassageRow } from "@/types/question"

interface PassagesManagerProps {
  passages: PassageRow[]
}

export function PassagesManager({ passages }: PassagesManagerProps) {
  const [search, setSearch] = React.useState("")
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<PassageRow | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<PassageRow | null>(
    null
  )

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return passages
    return passages.filter((passage) =>
      passage.title.toLowerCase().includes(query)
    )
  }, [passages, search])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(passage: PassageRow) {
    setEditing(passage)
    setFormOpen(true)
  }

  const emptyMessage =
    passages.length === 0
      ? "Belum ada passage. Tambah passage pertama Anda."
      : "Tidak ada passage yang cocok dengan pencarian."

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari judul passage…"
            aria-label="Cari passage"
            className="pl-8"
          />
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus />
          Tambah Passage
        </Button>
      </div>

      <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
        {filtered.length} dari {passages.length} passage
      </p>

      <PassageTable
        passages={filtered}
        emptyMessage={emptyMessage}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <PassageFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        passage={editing}
      />

      <DeletePassageDialog
        passage={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      />
    </div>
  )
}
