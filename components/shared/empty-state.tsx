import * as React from "react"
import { Inbox, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  /** Ikon di dalam tile. Default: Inbox. */
  icon?: LucideIcon
  title: string
  description?: string
  /** Tombol / tautan aksi, mis. <Button asChild>...</Button>. */
  action?: React.ReactNode
  className?: string
}

/**
 * Empty state gaya pixel: kotak putus-putus, tile ikon, judul Press Start 2P
 * (font-serif), deskripsi VT323, dan aksi opsional.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 border-3 border-dashed border-muted-foreground px-6 py-10 text-center",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center border-3 border-border bg-muted text-foreground">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="font-serif text-[11px] leading-normal text-foreground">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-xl leading-tight text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}