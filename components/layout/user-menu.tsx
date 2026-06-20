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
        <Button
          variant="ghost"
          size="lg"
          className="h-auto gap-2 py-1.5 pr-2 pl-1.5"
        >
          <Avatar size="sm">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback className="font-mono text-[10px]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden flex-col items-start leading-tight sm:flex">
            <span className="max-w-40 truncate text-sm font-medium">
              {user.name}
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              {roleLabel[user.role]}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1 py-1.5">
          <span className="truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault()
            handleLogout()
          }}
        >
          <LogOut aria-hidden="true" />
          {isPending ? "Keluar…" : "Keluar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
