"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { logoutAction } from "@/server/actions/auth"

type ButtonVariant = React.ComponentProps<typeof Button>["variant"]

interface LogoutButtonProps {
  variant?: ButtonVariant
  className?: string
}

/**
 * Standalone "keluar" button for pages without the full user menu
 * (e.g. the account-locked screen).
 */
export function LogoutButton({
  variant = "outline",
  className,
}: LogoutButtonProps) {
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
    <Button
      variant={variant}
      className={className}
      disabled={isPending}
      onClick={handleLogout}
    >
      <LogOut aria-hidden="true" />
      {isPending ? "Keluar…" : "Keluar"}
    </Button>
  )
}
