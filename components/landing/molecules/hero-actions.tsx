import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroActions() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button
        asChild
        className="h-auto w-full rounded-full px-8 py-4 text-sm font-medium shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 sm:w-auto"
      >
        <Link href="/register">Mulai Simulasi Gratis</Link>
      </Button>
    </div>
  )
}
