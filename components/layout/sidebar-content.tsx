import Link from "next/link"
import { GraduationCap } from "lucide-react"

import { SidebarNav } from "@/components/layout/sidebar-nav"
import { type NavItem } from "@/types/layout"

interface SidebarContentProps {
  items: NavItem[]
  /** Where the brand mark links to (role home). */
  homeHref: string
  /** Eyebrow shown above the nav, e.g. "Panel Mahasiswa". */
  panelLabel: string
  /** Called when a nav link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void
}

/**
 * The inner contents of the sidebar — brand mark, panel label, and nav list.
 * Rendered both in the fixed desktop aside and inside the mobile Sheet, so it
 * carries no layout chrome of its own beyond internal spacing.
 *
 * Border kanan sidebar (border-r-4 border-sidebar-border) dipasang di <aside>
 * pada layout, bukan di sini, supaya Sheet mobile tidak ikut dobel border.
 */
export function SidebarContent({ items, homeHref, panelLabel, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-7 bg-sidebar p-4 text-sidebar-foreground">
      <Link
        href={homeHref}
        onClick={onNavigate}
        className="flex items-center gap-3 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-sidebar-ring"
      >
        <span className="flex size-10 shrink-0 items-center justify-center border-3 border-black bg-sidebar-primary text-sidebar-primary-foreground shadow-[3px_3px_0_var(--color-black)]">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="font-serif text-[13px] leading-snug text-white">
            Open TOEFL
          </span>
          <span className="mt-1.5 font-mono text-[9px] tracking-wider text-sidebar-primary uppercase">
            TOEFL ITP
          </span>
        </span>
      </Link>

      <div className="flex flex-col gap-3">
        <p className="px-1 font-mono text-[10px] tracking-widest text-sidebar-foreground/70 uppercase">
          {panelLabel}
        </p>
        <SidebarNav items={items} onNavigate={onNavigate} />
      </div>
    </div>
  )
}