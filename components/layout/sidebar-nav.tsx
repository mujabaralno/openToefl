"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { navIcons } from "@/components/layout/nav-icons"
import { type NavItem } from "@/types/layout"

interface SidebarNavProps {
  items: NavItem[]
  /** Called after a link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi utama" className="flex flex-col gap-0.5">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = navIcons[item.icon]

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
              isActive && "bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary"
              />
            )}
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
