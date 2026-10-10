import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const base =
  "h-13 w-full rounded-none border-2 border-border px-5 font-mono text-[11px] shadow-md hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto"

export function HeroActions() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Button
        asChild
        size="lg"
        className={`${base} bg-primary text-primary-foreground hover:bg-primary`}
      >
        <Link href="/register" className="flex items-center gap-3">
          Mulai gratis
          <ArrowRight className="size-4 stroke-[2.5]" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className={`${base} bg-card text-card-foreground hover:bg-muted dark:bg-card dark:hover:bg-muted`}
      >
        <Link href="#simulation">Lihat format tes</Link>
      </Button>
    </div>
  )
}
