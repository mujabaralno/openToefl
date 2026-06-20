"use client"

import * as React from "react"
import { LayoutGrid } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { QuestionRow } from "@/types/question"
import type { SimulationState } from "@/types/simulation"

interface QuestionNavigatorProps {
  questions: QuestionRow[]
  answers: SimulationState["answers"]
  currentIndex: number
  onJump: (index: number) => void
}

export function QuestionNavigator({
  questions,
  answers,
  currentIndex,
  onJump,
}: QuestionNavigatorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Buka navigasi soal">
          <LayoutGrid />
          Soal
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 max-w-[85vw]">
        <SheetHeader>
          <SheetTitle>Navigasi soal</SheetTitle>
          <SheetDescription>
            Lompat ke soal mana pun dalam seksi ini.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-5 gap-2 overflow-y-auto px-4 pb-4">
          {questions.map((question, index) => {
            const isAnswered = Boolean(answers[question.id])
            const isCurrent = index === currentIndex
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => {
                  onJump(index)
                  setOpen(false)
                }}
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`Soal ${index + 1}${isAnswered ? ", sudah dijawab" : ""}`}
                className={cn(
                  "flex h-10 items-center justify-center rounded-md border border-border font-mono text-sm tabular-nums transition-colors",
                  "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isAnswered && "bg-secondary text-secondary-foreground",
                  isCurrent && "border-primary ring-2 ring-primary"
                )}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
