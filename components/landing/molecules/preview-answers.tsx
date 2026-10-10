import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const OPTIONS = [
  "The shape of the valleys they create.",
  "The speed at which water moves.",
  "The temperature of the material.",
  "The type of rock on the surface.",
]

export function PreviewAnswers() {
  return (
    <div>
      <p lang="en" className="mb-5 text-2xl leading-snug">
        According to paragraph 1, how does glacial erosion differ from river erosion?
      </p>
      <ol aria-label="Contoh pilihan jawaban; pilihan A dipilih" className="space-y-3">
        {OPTIONS.map((option, index) => (
          <li
            key={option}
            className={cn(
              "flex items-center gap-3 border px-3 py-3 text-xl leading-tight",
              index === 0
                ? "border-border bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-card-foreground"
            )}
          >
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center border border-current font-mono text-[10px]"
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span lang="en" className="flex-1">
              {option}
            </span>
            {index === 0 && (
              <>
                <Check className="size-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">Jawaban dipilih (contoh)</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
