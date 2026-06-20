"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { type DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DateRangePicker } from "@/components/history/date-range-picker"
import { cn } from "@/lib/utils"
import { sectionLabels } from "@/lib/questions"
import { formatShortDate } from "@/lib/dates"
import { QUESTION_SECTIONS } from "@/lib/validations/question"
import type { Enums } from "@/types/database.types"
import type { HistoryEntry, HistoryType } from "@/types/history"

interface HistoryViewProps {
  entries: HistoryEntry[]
}

type TypeFilter = HistoryType | "all"
type SectionFilter = Enums<"question_section"> | "all"

const typeLabels: Record<HistoryType, string> = {
  simulation: "Simulasi",
  practice: "Latihan",
}

const statusLabels: Record<string, string> = {
  completed: "Selesai",
  in_progress: "Berlangsung",
  violated: "Pelanggaran",
}

const statusVariant: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
  completed: "secondary",
  in_progress: "outline",
  violated: "destructive",
}

export function HistoryView({ entries }: HistoryViewProps) {
  const router = useRouter()
  const [type, setType] = React.useState<TypeFilter>("all")
  const [section, setSection] = React.useState<SectionFilter>("all")
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  const filtered = React.useMemo(() => {
    return entries.filter((entry) => {
      if (type !== "all" && entry.type !== type) return false
      if (section !== "all") {
        if (entry.type !== "practice" || entry.section !== section) return false
      }
      if (range?.from) {
        const date = new Date(entry.date)
        const from = new Date(range.from)
        from.setHours(0, 0, 0, 0)
        const to = range.to ? new Date(range.to) : new Date(range.from)
        to.setHours(23, 59, 59, 999)
        if (date < from || date > to) return false
      }
      return true
    })
  }, [entries, type, section, range])

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Belum ada riwayat. Mulai simulasi atau latihan dulu.
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/simulation">Mulai Simulasi</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/practice">Mode Latihan</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row sm:items-center">
        <Select value={type} onValueChange={(value) => setType(value as TypeFilter)}>
          <SelectTrigger aria-label="Filter tipe" className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua tipe</SelectItem>
            <SelectItem value="simulation">Simulasi</SelectItem>
            <SelectItem value="practice">Latihan</SelectItem>
          </SelectContent>
        </Select>

        <Select value={section} onValueChange={(value) => setSection(value as SectionFilter)}>
          <SelectTrigger aria-label="Filter seksi" className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua seksi</SelectItem>
            {QUESTION_SECTIONS.map((value) => (
              <SelectItem key={value} value={value}>
                {sectionLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-32">Tanggal</TableHead>
            <TableHead className="w-28">Tipe</TableHead>
            <TableHead className="w-32">Seksi</TableHead>
            <TableHead className="w-20 text-right">Skor</TableHead>
            <TableHead className="w-28 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Tidak ada riwayat yang cocok dengan filter.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((entry) => {
              const href = entry.href
              return (
                <TableRow
                  key={`${entry.type}-${entry.id}`}
                  onClick={href ? () => router.push(href) : undefined}
                  className={cn(href && "cursor-pointer")}
                >
                  <TableCell>{formatShortDate(entry.date)}</TableCell>
                  <TableCell>
                    <Badge variant={entry.type === "simulation" ? "default" : "secondary"}>
                      {typeLabels[entry.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.section ? sectionLabels[entry.section] : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {entry.scoreLabel}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={statusVariant[entry.status] ?? "outline"}>
                      {statusLabels[entry.status] ?? entry.status}
                    </Badge>
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
