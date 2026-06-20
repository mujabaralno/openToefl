"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"
import type { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard"

interface LeaderboardViewProps {
  entries: LeaderboardEntry[]
  period: LeaderboardPeriod
  currentUserId: string
}

export function LeaderboardView({
  entries,
  period,
  currentUserId,
}: LeaderboardViewProps) {
  const router = useRouter()
  const [program, setProgram] = React.useState("all")

  const programOptions = React.useMemo(() => {
    const set = new Set<string>()
    for (const entry of entries) {
      if (entry.programStudy) set.add(entry.programStudy)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [entries])

  const globalTop = entries.slice(0, 50)
  const programTop = React.useMemo(() => {
    const filtered =
      program === "all"
        ? entries
        : entries.filter((entry) => entry.programStudy === program)
    return filtered.slice(0, 50)
  }, [entries, program])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Select
          value={period}
          onValueChange={(value) => router.push(`/leaderboard?period=${value}`)}
        >
          <SelectTrigger aria-label="Periode" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="month">Bulan ini</SelectItem>
            <SelectItem value="week">Minggu ini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="session">Per Sesi</TabsTrigger>
          <TabsTrigger value="program">Per Prodi</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <LeaderboardTable
            entries={globalTop}
            currentUserId={currentUserId}
            emptyMessage="Belum ada skor pada periode ini."
          />
        </TabsContent>

        <TabsContent value="session">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              Belum ada sesi test
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Leaderboard per sesi muncul setelah admin membuat sesi test.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="program" className="flex flex-col gap-3">
          <Select value={program} onValueChange={setProgram}>
            <SelectTrigger aria-label="Program studi" className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua prodi</SelectItem>
              {programOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <LeaderboardTable
            entries={programTop}
            currentUserId={currentUserId}
            emptyMessage="Belum ada skor untuk prodi ini."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
