import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatShortDate } from "@/lib/dates"
import type { LeaderboardEntry } from "@/types/leaderboard"

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserId: string
  emptyMessage: string
}

export function LeaderboardTable({
  entries,
  currentUserId,
  emptyMessage,
}: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-right">#</TableHead>
            <TableHead className="min-w-40">Nama</TableHead>
            <TableHead className="min-w-36">Prodi</TableHead>
            <TableHead className="w-24 text-right">Skor</TableHead>
            <TableHead className="w-28 text-right">Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry, index) => {
              const isCurrent = entry.userId === currentUserId
              return (
                <TableRow
                  key={entry.userId}
                  className={cn(isCurrent && "bg-muted/50")}
                >
                  <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {entry.displayName}
                    {isCurrent && (
                      <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                        Anda
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.programStudy ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    {entry.score}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {entry.date ? formatShortDate(entry.date) : "—"}
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
