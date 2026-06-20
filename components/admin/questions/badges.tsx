import { Badge } from "@/components/ui/badge"
import { difficultyLabels, sectionLabels, statusLabels } from "@/lib/questions"
import {
  type Difficulty,
  type QuestionSection,
  type QuestionStatus,
} from "@/types/question"

export function SectionBadge({ section }: { section: QuestionSection }) {
  return (
    <Badge variant="outline" className="font-mono text-[11px] tracking-wide">
      {sectionLabels[section]}
    </Badge>
  )
}

const difficultyVariant: Record<
  Difficulty,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  easy: "outline",
  medium: "secondary",
  hard: "default",
}

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty | null
}) {
  if (!difficulty) {
    return <span className="text-muted-foreground">—</span>
  }
  return (
    <Badge variant={difficultyVariant[difficulty]}>
      {difficultyLabels[difficulty]}
    </Badge>
  )
}

export function StatusBadge({ status }: { status: QuestionStatus }) {
  return (
    <Badge variant={status === "active" ? "default" : "outline"}>
      {statusLabels[status]}
    </Badge>
  )
}
