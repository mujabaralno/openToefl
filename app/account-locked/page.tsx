import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { ShieldAlert } from "lucide-react"

import { LockCountdown } from "@/components/account-locked/lock-countdown"
import { LogoutButton } from "@/components/layout/logout-button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { isLockActive } from "@/lib/auth/lock"

export const metadata: Metadata = {
  title: "Akun Dikunci | PTESOL",
  description: "Akun Anda sedang dikunci karena pelanggaran",
}

export default async function AccountLockedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("is_locked, locked_until")
    .eq("id", user.id)
    .maybeSingle()

  // Defensive: a non-locked user has no business here.
  if (!profile || !isLockActive(profile)) redirect("/dashboard")

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 py-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-7" aria-hidden="true" />
          </span>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Akun Anda Dikunci
            </h1>
            <p className="text-sm text-muted-foreground">
              Anda terdeteksi melakukan pelanggaran saat mengikuti tes TOEFL.
              Skor untuk sesi tersebut adalah 0.
            </p>
          </div>

          <div className="w-full border-y border-border py-6">
            <LockCountdown lockedUntil={profile.locked_until} />
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Merasa ini sebuah kesalahan? Hubungi admin Anda.
            </p>
            <LogoutButton variant="outline" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
