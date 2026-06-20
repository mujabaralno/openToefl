"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { difficultyLabels, sectionLabels } from "@/lib/questions"
import { DIFFICULTIES, QUESTION_SECTIONS } from "@/lib/validations/question"
import { type Difficulty, type QuestionSection } from "@/types/question"

export type SectionFilter = QuestionSection | "all"
export type DifficultyFilter = Difficulty | "all"

interface QuestionFiltersProps {
  section: SectionFilter
  difficulty: DifficultyFilter
  search: string
  onSectionChange: (value: SectionFilter) => void
  onDifficultyChange: (value: DifficultyFilter) => void
  onSearchChange: (value: string) => void
}

export function QuestionFilters({
  section,
  difficulty,
  search,
  onSectionChange,
  onDifficultyChange,
  onSearchChange,
}: QuestionFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari teks soal…"
          aria-label="Cari soal"
          className="pl-8"
        />
      </div>

      <Select
        value={section}
        onValueChange={(value) => onSectionChange(value as SectionFilter)}
      >
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

      <Select
        value={difficulty}
        onValueChange={(value) =>
          onDifficultyChange(value as DifficultyFilter)
        }
      >
        <SelectTrigger
          aria-label="Filter tingkat kesulitan"
          className="w-full sm:w-40"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua tingkat</SelectItem>
          {DIFFICULTIES.map((value) => (
            <SelectItem key={value} value={value}>
              {difficultyLabels[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
