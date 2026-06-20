"use client"

import { AnswerOptions } from "@/components/simulation/answer-options"
import { cn } from "@/lib/utils"
import type { AnswerKey, PassageRow, QuestionRow } from "@/types/question"

interface QuestionDisplayProps {
  question: QuestionRow
  passage?: PassageRow
  questionNumber: number
  selected: AnswerKey | undefined
  onSelect: (answer: AnswerKey) => void
}

/** Question view for Structure & Reading (passage + stem + options). */
export function QuestionDisplay({
  question,
  passage,
  questionNumber,
  selected,
  onSelect,
}: QuestionDisplayProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {passage && (
        <div className="order-1 rounded-lg border border-border bg-card p-4 lg:max-h-[70vh] lg:overflow-y-auto">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Passage
          </p>
          <h2 className="mt-1 font-medium text-foreground">{passage.title}</h2>
          <p className="mt-3 leading-relaxed whitespace-pre-line text-foreground">
            {passage.content}
          </p>
        </div>
      )}

      <div
        className={cn("order-2 flex flex-col gap-5", !passage && "lg:col-span-2")}
      >
        {question.question_text && (
          <p className="leading-relaxed font-medium text-foreground">
            <span className="mr-2 font-mono text-muted-foreground">
              {questionNumber}.
            </span>
            {question.question_text}
          </p>
        )}

        <AnswerOptions
          question={question}
          selected={selected}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}
