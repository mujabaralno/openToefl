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
 */
export function SidebarContent({ items, homeHref, panelLabel, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar gap-6 px-4 py-6">
      <Link
        href={homeHref}
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-md px-2 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
      >
        <span className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
            Open TOEFL
          </span>
          <span className="mt-1 font-mono text-[10px] tracking-[0.2em] text-sidebar-foreground/45 uppercase">
            TOEFL ITP
          </span>
        </span>
      </Link>

      <div className="flex flex-col gap-2">
        <p className="px-3 font-mono text-[10px] tracking-[0.18em] text-sidebar-foreground/45 uppercase">
          {panelLabel}
        </p>
        <SidebarNav items={items} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
