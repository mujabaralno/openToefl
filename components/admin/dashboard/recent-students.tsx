import Link from "next/link"
import { Users } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getInitials } from "@/lib/users"
import { formatShortDate } from "@/lib/dates"
import type { UserRow } from "@/types/user"

interface RecentStudentsProps {
  students: UserRow[]
}

export function RecentStudents({ students }: RecentStudentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mahasiswa terbaru</CardTitle>
        <CardDescription>Lima pendaftar terakhir.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {students.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Users className="size-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Belum ada mahasiswa terdaftar.
            </p>
          </div>
        ) : (
          <>
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-md px-2 py-2"
              >
                <Avatar size="sm">
                  <AvatarFallback className="font-mono text-[10px]">
                    {getInitials(student.full_name || student.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {student.full_name || "(tanpa nama)"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {student.program_study || student.email}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                  {formatShortDate(student.created_at)}
                </span>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="mt-2 w-fit">
              <Link href="/admin/users">Lihat semua</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
