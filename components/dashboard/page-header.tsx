import * as React from "react"

interface PageHeaderProps {
  /** Short mono eyebrow above the title, e.g. "Mahasiswa". */
  eyebrow?: string
  title: string
  description?: string
  /** Optional trailing actions (buttons, etc.). */
  action?: React.ReactNode
}

/**
 * Section header gaya pixel: judul Press Start 2P (font-serif), deskripsi VT323,
 * dan garis bawah tebal 4px sebagai pemisah.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b-4 border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-lg leading-snug font-normal text-foreground sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  )
}