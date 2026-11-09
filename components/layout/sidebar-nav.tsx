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
    <nav aria-label="Navigasi utama" className="flex flex-col gap-2">
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
              "flex items-center gap-3 border-2 px-3 py-3 font-mono text-xs transition-colors",
              "focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-sidebar-ring",
              isActive
                ? // Aktif: blok lime dengan border dan bayangan hitam keras
                  "border-black bg-sidebar-primary font-bold text-sidebar-primary-foreground shadow-[2px_2px_0_var(--color-black)]"
                : // Default + hover
                  "border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}