"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"
import { type NavUser } from "@/types/layout"

interface UserMenuProps {
  user: NavUser
}

/** Builds up to two initials from a full name for the avatar fallback. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const roleLabel: Record<NavUser["role"], string> = {
  admin: "Admin",
  student: "Mahasiswa",
}

// Chip profil: card dengan border 3px, bayangan keras, avatar kotak lime
const triggerClass = cn(
  "h-auto gap-2.5 rounded-none border-3 border-border bg-card py-1 pr-3.5 pl-1 text-foreground shadow-sm",
  "transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-card hover:shadow",
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs",
  "data-[state=open]:bg-accent data-[state=open]:hover:bg-accent",
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring"
)

const itemClass =
  "rounded-none px-3.5 py-2.5 text-xl focus:bg-accent focus:text-accent-foreground"

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function handleLogout() {
    startTransition(async () => {
      try {
        const result = await logoutAction()
        if (result.success) {
          toast.success(result.message)
          router.push(result.redirectTo ?? "/login")
          router.refresh()
        } else {
          toast.error(result.message)
        }
      } catch {
        toast.error("Gagal keluar. Coba lagi.")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={triggerClass}>
          <Avatar className="size-9 rounded-none border-2 border-primary-foreground">
            <AvatarImage
              src={user.avatarUrl ?? undefined}
              alt={user.name}
              className="rounded-none"
            />
            <AvatarFallback className="rounded-none bg-primary font-serif text-[10px] text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden flex-col items-start gap-1 text-left sm:flex">
            <span className="max-w-36 truncate font-mono text-[10px] leading-none font-bold text-foreground">
              {user.name}
            </span>
            <span className="text-base leading-none font-bold text-emerald-700 uppercase dark:text-emerald-300">
              {roleLabel[user.role]}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 rounded-none border-3 border-border bg-popover p-0 text-popover-foreground shadow-md"
      >
        <DropdownMenuLabel className="flex flex-col gap-1 px-3.5 py-3">
          <span className="truncate font-mono text-xs font-bold text-foreground">
            {user.name}
          </span>
          <span className="truncate text-lg leading-tight font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0 h-0.5 bg-border/30" />
        {/* Item bahaya: warna manual agar terbaca di dark mode (red-700 / red-300) */}
        <DropdownMenuItem
          disabled={isPending}
          className={cn(
            itemClass,
            "text-destructive focus:bg-destructive/10 focus:text-destructive dark:text-red-300 dark:focus:text-red-300"
          )}
          onSelect={(event) => {
            event.preventDefault()
            handleLogout()
          }}
        >
          <LogOut className="text-current" aria-hidden="true" />
          {isPending ? "Keluar…" : "Keluar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}