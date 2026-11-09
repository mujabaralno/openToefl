"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { History } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "../shared/empty-state" 
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

// ---- Gaya pixel: semua warna dari token (lihat tokens.css) ----

const focusClass =
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring"

const primaryButtonClass = cn(
  "h-11 rounded-none border-3 border-primary-foreground bg-primary px-5 font-mono text-xs font-bold tracking-wider uppercase text-primary-foreground shadow-sm",
  "transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-primary hover:shadow",
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs",
  focusClass
)

const secondaryButtonClass = cn(
  "h-11 rounded-none border-3 border-border bg-card px-5 font-mono text-xs font-bold tracking-wider uppercase text-foreground shadow-sm",
  "transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-accent hover:shadow",
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs",
  focusClass
)

const filterTriggerClass = cn(
  "w-full rounded-none border-3 border-border bg-card px-3 font-sans text-xl text-foreground shadow-none",
  "data-[size=default]:h-11 dark:bg-background dark:hover:bg-background",
  "focus-visible:border-border focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring",
  "data-[state=open]:outline-3 data-[state=open]:outline-solid data-[state=open]:outline-offset-3 data-[state=open]:outline-ring"
)

const selectContentClass =
  "rounded-none border-3 border-border bg-popover text-popover-foreground shadow-md"

const selectItemClass = cn(
  "rounded-none py-2.5 pr-9 pl-3.5 text-xl",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[state=checked]:bg-primary data-[state=checked]:font-bold data-[state=checked]:text-primary-foreground",
  "data-[state=checked]:focus:bg-primary data-[state=checked]:focus:text-primary-foreground",
  "[&_svg:not([class*='text-'])]:text-current"
)

// Badge: kotak bergaris dengan bayangan keras kecil, warna dari token status
const badgeBase =
  "gap-1.5 rounded-none border-2 border-border px-2 py-0.5 font-mono text-[10px] leading-none font-bold shadow-xs"

const typeClass: Record<HistoryType, string> = {
  simulation: "border-primary-foreground bg-primary text-primary-foreground",
  practice: "bg-info text-info-foreground",
}

const statusClass: Record<string, string> = {
  completed: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  in_progress: "bg-success text-success-foreground",
  violated: "bg-danger text-danger-foreground",
}

const headClass =
  "h-11 border-r-2 border-border px-3 font-mono text-xs font-bold text-foreground last:border-r-0"
const cellClass = "border-r-2 border-border/30 px-3 py-3 last:border-r-0"

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
      <EmptyState
        icon={History}
        title="Belum ada riwayat"
        description="Mulai simulasi atau latihan dulu."
        className="bg-card"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className={primaryButtonClass}>
              <Link href="/simulation">Mulai Simulasi</Link>
            </Button>
            <Button asChild variant="outline" className={secondaryButtonClass}>
              <Link href="/practice">Mode Latihan</Link>
            </Button>
          </div>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden border-4 border-border bg-card shadow">
      <div className="flex flex-col gap-3 border-b-4 border-border p-3 sm:flex-row sm:items-center">
        <Select value={type} onValueChange={(value) => setType(value as TypeFilter)}>
          <SelectTrigger
            aria-label="Filter tipe"
            className={cn(filterTriggerClass, "sm:w-40")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            <SelectItem value="all" className={selectItemClass}>
              Semua tipe
            </SelectItem>
            <SelectItem value="simulation" className={selectItemClass}>
              Simulasi
            </SelectItem>
            <SelectItem value="practice" className={selectItemClass}>
              Latihan
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={section} onValueChange={(value) => setSection(value as SectionFilter)}>
          <SelectTrigger
            aria-label="Filter seksi"
            className={cn(filterTriggerClass, "sm:w-48")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            <SelectItem value="all" className={selectItemClass}>
              Semua seksi
            </SelectItem>
            {QUESTION_SECTIONS.map((value) => (
              <SelectItem key={value} value={value} className={selectItemClass}>
                {sectionLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <Table>
        <TableHeader className="bg-muted [&_tr]:border-b-2 [&_tr]:border-border">
          <TableRow className="hover:bg-muted">
            <TableHead className={cn(headClass, "min-w-32")}>Tanggal</TableHead>
            <TableHead className={cn(headClass, "w-28")}>Tipe</TableHead>
            <TableHead className={cn(headClass, "w-32")}>Seksi</TableHead>
            <TableHead className={cn(headClass, "w-20 text-right")}>Skor</TableHead>
            <TableHead className={cn(headClass, "w-28 text-right")}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="h-24 text-center text-xl text-muted-foreground"
              >
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
                  onKeyDown={
                    href
                      ? (event) => {
                          if (event.key === "Enter") router.push(href)
                        }
                      : undefined
                  }
                  tabIndex={href ? 0 : undefined}
                  className={cn(
                    "border-b-2 border-border/30 last:border-b-0 hover:bg-accent",
                    href &&
                      "cursor-pointer focus-visible:outline-3 focus-visible:outline-solid focus-visible:-outline-offset-3 focus-visible:outline-ring"
                  )}
                >
                  <TableCell className={cn(cellClass, "font-mono text-xs font-bold")}>
                    {formatShortDate(entry.date)}
                  </TableCell>
                  <TableCell className={cellClass}>
                    <Badge
                      variant="outline"
                      className={cn(badgeBase, typeClass[entry.type])}
                    >
                      {typeLabels[entry.type]}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(cellClass, "font-mono text-xs text-muted-foreground")}
                  >
                    {entry.section ? sectionLabels[entry.section] : "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cellClass,
                      "text-right font-mono text-xs font-bold tabular-nums"
                    )}
                  >
                    {entry.scoreLabel}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-right")}>
                    <Badge
                      variant="outline"
                      className={cn(
                        badgeBase,
                        statusClass[entry.status] ?? "bg-muted text-foreground"
                      )}
                    >
                      <span aria-hidden="true" className="size-1.5 bg-current" />
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