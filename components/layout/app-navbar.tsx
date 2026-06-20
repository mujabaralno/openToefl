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
 */
export function AppNavbar({
  user,
  items,
  homeHref,
  panelLabel,
}: AppNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6 lg:px-8">
      <MobileSidebar
        items={items}
        homeHref={homeHref}
        panelLabel={panelLabel}
      />
      <Link
        href={homeHref}
        className="font-semibold tracking-tight lg:hidden"
      >
        PTESOL
      </Link>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <NotificationBell userId={user.id} />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
