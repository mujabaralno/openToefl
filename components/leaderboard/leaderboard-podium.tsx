import { cn } from "@/lib/utils"

export interface PodiumItem {
  id: string
  name: string
  score: string
  program?: string | null
}

interface LeaderboardPodiumProps {
  /** Maksimal 3 item, urut dari peringkat 1. */
  items: PodiumItem[]
  currentUserId: string
  /** Peringkat user saat ini di daftar yang sedang tampil (1-based). */
  myRank?: number | null
}

// Tinggi balok menjadi "anak tangga" podium. Urutan visual: 2 - 1 - 3.
const places = [
  {
    height: "h-40",
    order: "order-2",
    block: "bg-primary text-primary-foreground",
  },
  {
    height: "h-28",
    order: "order-1",
    block: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
  },
  {
    height: "h-20",
    order: "order-3",
    block: "bg-amber-300 text-amber-950 dark:bg-amber-800 dark:text-amber-100",
  },
] as const

/** Mahkota piksel 9x5, digambar dengan kotak agar tetap tajam di semua ukuran. */
function Crown() {
  return (
    <svg
      viewBox="0 0 9 5"
      width="45"
      height="25"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        className="fill-amber-400"
        d="M0 0h1v1H0zM4 0h1v1H4zM8 0h1v1H8zM0 1h2v1H0zM3 1h3v1H3zM7 1h2v1H7zM0 2h9v1H0zM0 3h9v1H0z"
      />
      <path className="fill-amber-600" d="M0 4h9v1H0z" />
    </svg>
  )
}

export function LeaderboardPodium({
  items,
  currentUserId,
  myRank,
}: LeaderboardPodiumProps) {
  const top = items.slice(0, 3)
  if (top.length === 0) return null

  return (
    <section
      aria-label="Tiga peringkat teratas"
      className="border-4 border-border bg-card p-4 shadow sm:p-6"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-3">
        <h2 className="font-serif text-sm leading-snug text-foreground">
          Tiga teratas
        </h2>
        {myRank ? (
          <p className="border-2 border-border bg-muted px-2.5 py-1 font-mono text-xs font-bold text-foreground">
            Peringkatmu #{myRank}
          </p>
        ) : null}
      </div>

      {/* DOM berurut 1-2-3 untuk screen reader; urutan visual diatur lewat `order` */}
      <ol className="flex items-end justify-center gap-3 sm:gap-6">
        {top.map((item, index) => {
          const place = places[index]
          const isMe = item.id === currentUserId
          return (
            <li
              key={item.id}
              className={cn(
                "flex w-1/3 max-w-52 min-w-0 flex-col items-center gap-1.5 text-center",
                place.order
              )}
            >
              {index === 0 && <Crown />}
              {isMe && (
                <span className="border-2 border-border bg-foreground px-2 py-0.5 font-mono text-[10px] leading-none font-bold text-background">
                  Kamu
                </span>
              )}
              <p className="max-w-full truncate font-mono text-xs font-bold text-foreground">
                {item.name}
              </p>
              {item.program && (
                <p className="max-w-full truncate text-lg leading-none text-muted-foreground">
                  {item.program}
                </p>
              )}
              <p className="mb-1 font-serif text-xs text-foreground tabular-nums sm:text-sm">
                {item.score}
              </p>
              <div
                className={cn(
                  "flex w-full items-start justify-center border-4 border-border pt-3 font-serif text-2xl shadow",
                  place.height,
                  place.block
                )}
              >
                <span className="sr-only">Peringkat </span>
                {index + 1}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}