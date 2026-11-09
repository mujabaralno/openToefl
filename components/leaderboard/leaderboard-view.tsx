"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarClock } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"
import {
  LeaderboardPodium,
  type PodiumItem,
} from "@/components/leaderboard/leaderboard-podium"
import { cn } from "@/lib/utils"
import type { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard"

interface LeaderboardViewProps {
  entries: LeaderboardEntry[]
  period: LeaderboardPeriod
  currentUserId: string
}

// ⚠ Sesuaikan nama field di bawah dengan type LeaderboardEntry kamu.
// Hanya fungsi ini yang perlu diubah; podium tidak tahu bentuk entry aslinya.
function toPodiumItem(entry: LeaderboardEntry): PodiumItem {
  return {
    id: entry.userId,
    name: entry.fullName,
    score: String(entry.score),
    program: entry.programStudy,
  }
}

function rankOf(list: LeaderboardEntry[], userId: string): number | null {
  const index = list.findIndex((entry) => entry.userId === userId)
  return index === -1 ? null : index + 1
}

// ---- Gaya pixel: semua warna dari token (lihat tokens.css) ----

const focusClass =
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring"

const selectTriggerClass = cn(
  "rounded-none border-3 border-border bg-card px-3 font-sans text-xl text-foreground shadow-none",
  "data-[size=default]:h-11 dark:bg-background dark:hover:bg-background",
  "focus-visible:border-border",
  "data-[state=open]:outline-3 data-[state=open]:outline-solid data-[state=open]:outline-offset-3 data-[state=open]:outline-ring",
  focusClass
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

const tabsListClass = "h-auto gap-2 rounded-none bg-transparent p-0"

const tabTriggerClass = cn(
  "h-10 flex-none rounded-none border-3 border-border/30 bg-card px-4 font-mono text-xs font-bold text-muted-foreground shadow-none",
  "hover:text-foreground",
  "data-[state=active]:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs",
  "dark:data-[state=active]:border-border dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground",
  focusClass
)

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
  const programList = React.useMemo(
    () =>
      program === "all"
        ? entries
        : entries.filter((entry) => entry.programStudy === program),
    [entries, program]
  )
  const programTop = programList.slice(0, 50)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Select
          value={period}
          onValueChange={(value) => router.push(`/leaderboard?period=${value}`)}
        >
          <SelectTrigger
            aria-label="Periode"
            className={cn(selectTriggerClass, "w-44")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            <SelectItem value="all" className={selectItemClass}>
              All time
            </SelectItem>
            <SelectItem value="month" className={selectItemClass}>
              Bulan ini
            </SelectItem>
            <SelectItem value="week" className={selectItemClass}>
              Minggu ini
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="global" className="gap-6">
        <TabsList className={tabsListClass}>
          <TabsTrigger value="global" className={tabTriggerClass}>
            Global
          </TabsTrigger>
          <TabsTrigger value="session" className={tabTriggerClass}>
            Per Sesi
          </TabsTrigger>
          <TabsTrigger value="program" className={tabTriggerClass}>
            Per Prodi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="flex flex-col gap-6">
          <LeaderboardPodium
            items={globalTop.slice(0, 3).map(toPodiumItem)}
            currentUserId={currentUserId}
            myRank={rankOf(entries, currentUserId)}
          />
          <LeaderboardTable
            entries={globalTop}
            currentUserId={currentUserId}
            emptyMessage="Belum ada skor pada periode ini."
          />
        </TabsContent>

        <TabsContent value="session">
          <EmptyState
            icon={CalendarClock}
            title="Belum ada sesi test"
            description="Leaderboard per sesi muncul setelah admin membuat sesi test."
            className="bg-card"
          />
        </TabsContent>

        <TabsContent value="program" className="flex flex-col gap-6">
          <Select value={program} onValueChange={setProgram}>
            <SelectTrigger
              aria-label="Program studi"
              className={cn(selectTriggerClass, "w-full sm:w-72")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all" className={selectItemClass}>
                Semua prodi
              </SelectItem>
              {programOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className={selectItemClass}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <LeaderboardPodium
            items={programTop.slice(0, 3).map(toPodiumItem)}
            currentUserId={currentUserId}
            myRank={rankOf(programList, currentUserId)}
          />
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