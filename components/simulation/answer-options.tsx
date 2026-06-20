"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { parseOptions } from "@/lib/questions"
import { ANSWER_KEYS } from "@/lib/validations/question"
import type { AnswerKey, QuestionRow } from "@/types/question"

interface AnswerOptionsProps {
  question: QuestionRow
  selected: AnswerKey | undefined
  onSelect: (answer: AnswerKey) => void
}

/** The A/B/C/D answer choices, shared by every section's question view. */
export function AnswerOptions({
  question,
  selected,
  onSelect,
}: AnswerOptionsProps) {
  const options = parseOptions(question.options)

  return (
    <RadioGroup
      value={selected ?? ""}
      onValueChange={(value) => onSelect(value as AnswerKey)}
      className="gap-2"
    >
      {ANSWER_KEYS.map((key) => {
        const id = `${question.id}-${key}`
        const isSelected = selected === key
        return (
          <label
            key={key}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors",
              "hover:bg-muted",
              isSelected && "border-primary bg-primary/5"
            )}
          >
            <RadioGroupItem id={id} value={key} />
            <span className="font-mono text-xs font-medium text-muted-foreground">
              {key}
            </span>
            <span className="flex-1 text-foreground">{options[key]}</span>
          </label>
        )
      })}
    </RadioGroup>
  )
}
