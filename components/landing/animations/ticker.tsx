const ITEMS = ["LISTENING", "STRUCTURE", "READING", "PRACTICE. REPEAT. LEVEL UP."]

export function Ticker() {
  return (
    <section
      aria-label="Materi latihan"
      className="border-y-2 border-border bg-primary py-4 text-primary-foreground"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-3 px-5 sm:justify-between sm:px-8">
        {ITEMS.map((item) => (
          <span
            key={item}
            className="flex items-center gap-3 font-mono text-[10px] sm:gap-5 sm:text-xs"
          >
            <span aria-hidden="true" className="size-2 bg-current" />
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
