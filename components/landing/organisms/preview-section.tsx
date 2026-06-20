import { MockupWindowControls } from "@/components/landing/molecules/mockup-window-controls"

export function PreviewSection() {
  return (
    <section className="relative z-10 mx-auto mb-32 max-w-[1200px] px-8">
      <div className="mockup-container relative">
        {/* Glow effect behind mockup */}
        <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-primary/5 blur-[80px]" />

        <div className="mockup-screen relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-card ring-1 ring-foreground/5">
          <MockupWindowControls />

          {/* Simulation UI Mockup */}
          <div className="flex h-full flex-col bg-secondary">
            {/* Simulation Header */}
            <div className="relative z-10 flex h-14 items-center justify-between border-b border-border bg-card/80 px-6 pl-20 backdrop-blur-md">
              <span className="font-mono text-[13px] font-medium tracking-wide text-muted-foreground">
                TOEFL ITP® Simulation — Reading Section
              </span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1 text-destructive">
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-mono text-[13px] font-bold">14:32</span>
                </div>
                <div className="rounded-full bg-foreground px-5 py-1.5 text-[12px] font-bold tracking-wider text-background">
                  NEXT
                </div>
              </div>
            </div>

            {/* Simulation Content */}
            <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
              {/* Reading Passage */}
              <div className="overflow-y-auto border-r border-border bg-card p-6 md:p-10">
                <h3 className="mb-6 text-lg font-semibold tracking-tight md:text-xl">
                  The Impact of Glacial Erosion
                </h3>
                <div className="space-y-5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  <p>
                    Glacial erosion is the process by which glaciers move across the landscape,
                    carving out valleys and shaping the Earth&apos;s surface. Unlike river erosion,
                    which tends to create V-shaped valleys, glacial erosion creates broad, U-shaped
                    valleys...
                  </p>
                  <p>
                    <span className="mr-1 inline-block rounded bg-secondary px-1 text-xs text-foreground">
                      [1]
                    </span>{" "}
                    This process occurs through two primary mechanisms: plucking and abrasion.
                    Plucking happens when meltwater freezes in the cracks of rocks beneath a
                    glacier...
                  </p>
                </div>
              </div>

              {/* Question Panel */}
              <div className="flex flex-col gap-6 overflow-y-auto bg-sidebar p-6 md:p-10">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
                  <p className="mb-6 text-base font-medium text-foreground md:text-lg">
                    Menurut paragraf 1, apa perbedaan utama antara erosi sungai dan erosi glasial?
                  </p>
                  <div className="space-y-3">
                    {/* Option A */}
                    <label className="group/opt flex cursor-pointer items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary/40 hover:bg-secondary">
                      <div className="h-4 w-4 flex-shrink-0 rounded-full border border-muted-foreground transition-colors group-hover/opt:border-primary" />
                      <span className="text-sm text-muted-foreground transition-colors group-hover/opt:text-foreground">
                        Kecepatan pergerakan air
                      </span>
                    </label>

                    {/* Option B (Selected) */}
                    <label className="group/opt flex cursor-pointer items-center gap-4 rounded-lg border-2 border-primary bg-primary/[0.02] p-4 shadow-sm transition-all">
                      <div className="h-4 w-4 flex-shrink-0 rounded-full border-[5px] border-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Bentuk lembah yang dihasilkan
                      </span>
                    </label>

                    {/* Option C */}
                    <label className="group/opt flex cursor-pointer items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary/40 hover:bg-secondary">
                      <div className="h-4 w-4 flex-shrink-0 rounded-full border border-muted-foreground transition-colors group-hover/opt:border-primary" />
                      <span className="text-sm text-muted-foreground transition-colors group-hover/opt:text-foreground">
                        Suhu material yang dipindahkan
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
