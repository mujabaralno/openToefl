"use client"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type PassageRow } from "@/types/question"

interface PassageTableProps {
  passages: PassageRow[]
  emptyMessage: string
  onEdit: (passage: PassageRow) => void
  onDelete: (passage: PassageRow) => void
}

export function PassageTable({
  passages,
  emptyMessage,
  onEdit,
  onDelete,
}: PassageTableProps) {
  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-48">Judul</TableHead>
            <TableHead className="min-w-64">Cuplikan</TableHead>
            <TableHead className="w-24 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {passages.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            passages.map((passage) => (
              <TableRow key={passage.id}>
                <TableCell className="align-top font-medium whitespace-normal text-foreground">
                  {passage.title}
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <p className="line-clamp-2 text-muted-foreground">
                    {passage.content}
                  </p>
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit passage"
                      onClick={() => onEdit(passage)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Hapus passage"
                      onClick={() => onDelete(passage)}
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
    </div>
  )
}
