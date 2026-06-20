import { CalendarRange } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SessionStatusBadge } from "@/components/admin/sessions/session-status-badge"
import { formatSessionDateTime, getSessionStatus } from "@/lib/sessions"
import { type JoinedSession } from "@/types/session"

interface JoinedSessionsListProps {
  sessions: JoinedSession[]
}

export function JoinedSessionsList({ sessions }: JoinedSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
        <CalendarRange className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Anda belum tergabung di sesi mana pun. Masukkan kode undangan dari
          admin untuk bergabung.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
            <CardTitle className="text-base">{session.title}</CardTitle>
            <SessionStatusBadge status={getSessionStatus(session)} />
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            {session.description && (
              <p className="line-clamp-2">{session.description}</p>
            )}
            {session.program_study && (
              <p className="font-mono text-[11px]">{session.program_study}</p>
            )}
            <p className="text-xs tabular-nums">
              {formatSessionDateTime(session.start_date)} —{" "}
              {formatSessionDateTime(session.end_date)}
            </p>
            <p className="text-xs">
              Skor terbaik Anda:{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {session.bestTotalScore ?? "Belum ada"}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
