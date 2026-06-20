"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface QuestionPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

/** Windowed page list: 1 … current-1 current current+1 … last. */
function buildPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push("ellipsis")
  for (let page = start; page <= end; page++) pages.push(page)
  if (end < total - 1) pages.push("ellipsis")

  pages.push(total)
  return pages
}

export function QuestionPagination({ page, totalPages, onPageChange }: QuestionPaginationProps) {
  const pages = buildPages(page, totalPages)

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Halaman sebelumnya"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>

      {pages.map((entry, index) =>
        entry === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="px-1 font-mono text-xs text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={entry}
            variant={entry === page ? "outline" : "ghost"}
            size="icon-sm"
            aria-label={`Halaman ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            className="font-mono text-xs tabular-nums"
            onClick={() => onPageChange(entry)}
          >
            {entry}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Halaman berikutnya"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}
