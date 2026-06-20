"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dumbbell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { startPracticeAction } from "@/server/actions/practice"
import { practiceSetupSchema } from "@/lib/validations/practice"
import { QUESTION_SECTIONS } from "@/lib/validations/question"
import { PRACTICE_COUNT_PRESETS, practiceDurationSeconds } from "@/lib/practice"
import { sectionLabels } from "@/lib/questions"
import { formatClock } from "@/lib/simulation"
import type { QuestionSection } from "@/types/question"

const pill =
  "flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted"

interface PracticeSetupProps {
  defaultSection?: QuestionSection
}

export function PracticeSetup({
  defaultSection = "listening",
}: PracticeSetupProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [section, setSection] = React.useState<QuestionSection>(defaultSection)
  const [countMode, setCountMode] = React.useState("10")
  const [customCount, setCustomCount] = React.useState("15")
  const [timer, setTimer] = React.useState(false)

  const count = countMode === "custom" ? Number(customCount) : Number(countMode)
  const safeCount = Number.isFinite(count) && count > 0 ? count : 0
  const durationSeconds = practiceDurationSeconds(section, safeCount)

  function handleStart() {
    const parsed = practiceSetupSchema.safeParse({ section, count, timer })
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Pengaturan tidak valid.")
      return
    }
    startTransition(async () => {
      const result = await startPracticeAction(parsed.data)
      if (result.success && result.attemptId) {
        const query = timer
          ? `?duration=${practiceDurationSeconds(section, parsed.data.count)}`
          : ""
        router.push(`/practice/${result.attemptId}${query}`)
      } else {
        toast.error(result.message ?? "Gagal memulai latihan.")
      }
    })
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label>Seksi</Label>
          <RadioGroup
            value={section}
            onValueChange={(value) => setSection(value as QuestionSection)}
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {QUESTION_SECTIONS.map((value) => (
              <label
                key={value}
                className={cn(pill, section === value && "border-primary bg-primary/5")}
              >
                <RadioGroupItem value={value} />
                {sectionLabels[value]}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Jumlah soal</Label>
          <RadioGroup
            value={countMode}
            onValueChange={setCountMode}
            className="flex flex-wrap gap-2"
          >
            {PRACTICE_COUNT_PRESETS.map((value) => (
              <label
                key={value}
                className={cn(
                  pill,
                  countMode === String(value) && "border-primary bg-primary/5"
                )}
              >
                <RadioGroupItem value={String(value)} />
                {value} soal
              </label>
            ))}
            <label
              className={cn(
                pill,
                countMode === "custom" && "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem value="custom" />
              Custom
            </label>
          </RadioGroup>
          {countMode === "custom" && (
            <Input
              type="number"
              min={1}
              max={50}
              value={customCount}
              onChange={(event) => setCustomCount(event.target.value)}
              aria-label="Jumlah soal custom"
              className="w-32"
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3">
          <div className="flex flex-col">
            <Label htmlFor="practice-timer">Pakai timer</Label>
            <span className="text-xs text-muted-foreground">
              {timer
                ? `Durasi sekitar ${formatClock(durationSeconds)}`
                : "Latihan tanpa batas waktu"}
            </span>
          </div>
          <Switch
            id="practice-timer"
            checked={timer}
            onCheckedChange={setTimer}
          />
        </div>

        <Button onClick={handleStart} disabled={isPending} className="w-fit">
          <Dumbbell />
          {isPending ? "Menyiapkan…" : "Mulai Latihan"}
        </Button>
      </CardContent>
    </Card>
  )
}
