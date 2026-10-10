import { ArrowUpRight, BookOpen, Headphones, PencilLine } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const LEVELS = [
  { number: "01", label: "Listening", icon: Headphones },
  { number: "02", label: "Structure", icon: PencilLine },
  { number: "03", label: "Reading", icon: BookOpen },
] as const

export function LevelScene() {
  return (
    <div className="relative pb-5 pr-3 sm:pr-5">
      <div
        aria-hidden="true"
        className="absolute inset-x-5 bottom-0 top-5 border-2 border-border bg-secondary"
      />
      <Card className="relative gap-0 rounded-none border-2 border-border p-0 shadow-xl ring-0">
        <div className="flex items-center justify-between gap-2 border-b-2 border-border px-4 py-3">
          <span className="font-mono text-[10px] sm:text-xs">PTESOL / LEVEL SELECT</span>
          <div className="flex gap-1.5 text-muted-foreground" aria-hidden="true">
            <span className="size-2 border border-current" />
            <span className="size-2 border border-current" />
            <span className="size-2 bg-current" />
          </div>
        </div>
        <div className="relative overflow-hidden bg-primary p-5 text-primary-foreground sm:p-6">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px]">YOUR NEXT LEVEL</p>
              <p className="mt-3 font-serif text-3xl leading-normal sm:text-4xl">
                550<span className="text-lg">+</span>
              </p>
              <p className="mt-1 text-lg">Contoh target belajar</p>
            </div>
            <Badge
              variant="outline"
              className="h-auto rounded-none border-primary-foreground bg-primary px-2 py-1 font-mono text-[9px] text-primary-foreground"
            >
              1P MODE
            </Badge>
          </div>
          <svg
            viewBox="0 0 400 210"
            className="-mb-5 mt-1 w-full sm:-mb-6"
            fill="currentColor"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <defs>
              <pattern id="level-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.1" />
              </pattern>
            </defs>
            <path d="M0 0H400V210H0Z" fill="url(#level-grid)" />
            <path
              d="M20 37h6v-6h6v6h6v6h-6v6h-6v-6h-6ZM190 23h6v-6h6v6h6v6h-6v6h-6v-6h-6ZM355 50h6v-6h6v6h6v6h-6v6h-6v-6h-6Z"
              opacity="0.45"
            />
            <path d="M0 194H65V158H145V120H225V82H305V210H0Z" />
            <path d="M305 82H350V210H305Z" opacity="0.18" />
            <path
              d="M75 169H134M155 131H214M235 93H294"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeDasharray="8 5"
            />
            <path d="M272 14h5v68h-5ZM277 14h40v26h-40Z" />
            <path
              d="M283 20h8v8h-8ZM299 20h8v8h-8ZM291 28h8v8h-8ZM307 28h8v8h-8Z"
              fill="var(--primary)"
            />
            <path d="M108 102h20v6h6v19h-6v7h-20v-7h-6v-19h6ZM103 137h30v13h-7v8h-8v-8h-8v8h-8Z" />
            <path d="M110 112h5v5h-5ZM123 112h5v5h-5Z" fill="var(--primary)" />
            <path d="M158 92h6v-6h6v-6h6v6h6v6h6v6h-12v12h-6V98h-12Z" opacity="0.45" />
            <path d="M342 158h6v-6h6v6h6v6h-6v6h-6v-6h-6ZM368 118h6v6h-6Z" />
          </svg>
        </div>
        <div className="grid grid-cols-3 border-t-2 border-border">
          {LEVELS.map(({ number, label, icon: Icon }) => (
            <div key={number} className="border-r border-border px-2 py-4 last:border-r-0 sm:px-4">
              <div className="mb-2 flex items-center justify-between text-muted-foreground">
                <span className="font-mono text-[9px]">LV. {number}</span>
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <p className="text-xl">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t-2 border-border bg-muted px-4 py-3 text-muted-foreground">
          <span className="text-base">Satu latihan lebih dekat ke tujuan.</span>
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </div>
      </Card>
    </div>
  )
}
