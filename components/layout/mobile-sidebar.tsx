"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarContent } from "@/components/layout/sidebar-content"
import { type NavItem } from "@/types/layout"

interface MobileSidebarProps {
  items: NavItem[]
  homeHref: string
  panelLabel: string
}

/** Hamburger trigger + slide-in drawer that reuses the desktop sidebar body. */
export function MobileSidebar({
  items,
  homeHref,
  panelLabel,
}: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 max-w-[80vw] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu navigasi</SheetTitle>
        </SheetHeader>
        <SidebarContent
          items={items}
          homeHref={homeHref}
          panelLabel={panelLabel}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
