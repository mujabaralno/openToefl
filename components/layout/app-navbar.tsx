import Link from "next/link"

import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { NotificationBell } from "@/components/layout/notification-bell"
import { UserMenu } from "@/components/layout/user-menu"
import { type NavItem, type NavUser } from "@/types/layout"

interface AppNavbarProps {
  user: NavUser
  /** Same items as the sidebar — reused inside the mobile drawer. */
  items: NavItem[]
  homeHref: string
  panelLabel: string
}

/**
 * Top bar shared by both dashboards. Holds the mobile menu trigger and a
 * compact wordmark on small screens (the sidebar owns the brand on desktop),
 * with the user menu pinned to the right.
 *
 * Gaya pixel: permukaan card, garis bawah 4px, tanpa blur/transparansi.
 */
export function AppNavbar({ user, items, homeHref, panelLabel }: AppNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b-4 border-border bg-card px-4 sm:px-6 lg:px-8">
      <MobileSidebar items={items} homeHref={homeHref} panelLabel={panelLabel} />
      <Link
        href={homeHref}
        className="font-serif text-xs leading-none text-foreground focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring lg:hidden"
      >
        PTESOL
      </Link>
      <div className="ml-auto flex items-center gap-3">
        <NotificationBell userId={user.id} />
        <UserMenu user={user} />
      </div>
    </header>
  )
}