"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { updateNotificationsAction } from "@/server/actions/settings"

// Gaya pixel: semua warna dari token (lihat tokens.css)
const labelClass = "font-mono text-xs font-bold text-foreground"
const hintClass = "text-lg leading-tight text-muted-foreground"

// Switch 56x30: track kotak bergaris, thumb kotak 18px.
// Thumb diatur lewat selector turunan (&>span) karena className hanya sampai ke root.
const switchClass = cn(
  "h-[30px] w-14 rounded-none border-3 border-border shadow-none",
  "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted dark:data-[state=unchecked]:bg-muted",
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring",
  "[&>span]:ml-[3px] [&>span]:size-[18px] [&>span]:rounded-none!",
  "[&>span]:data-[state=unchecked]:bg-muted-foreground! [&>span]:data-[state=checked]:bg-primary-foreground!",
  "[&>span]:data-[state=checked]:translate-x-[26px]"
)

interface NotificationsCardProps {
  initialEmail: boolean
  initialInApp: boolean
}

export function NotificationsCard({
  initialEmail,
  initialInApp,
}: NotificationsCardProps) {
  const [email, setEmail] = React.useState(initialEmail)
  const [inApp, setInApp] = React.useState(initialInApp)
  const [isPending, startTransition] = React.useTransition()

  function save(nextEmail: boolean, nextInApp: boolean) {
    startTransition(async () => {
      const result = await updateNotificationsAction(nextEmail, nextInApp)
      if (!result.success) toast.error(result.message)
    })
  }

  return (
    <Card className="rounded-none border-4 border-border shadow">
      <CardHeader className="gap-2 border-b-2 border-border pb-4">
        <CardTitle className="font-serif text-sm leading-snug font-normal">
          Notifikasi
        </CardTitle>
        <CardDescription className="text-xl leading-tight text-muted-foreground">
          Pilih cara Anda menerima pemberitahuan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y-2 divide-border/30">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="notif-email" className={labelClass}>
              Email
            </Label>
            <span className={hintClass}>
              Kabar penting dikirim ke email Anda.
            </span>
          </div>
          <Switch
            id="notif-email"
            className={switchClass}
            checked={email}
            disabled={isPending}
            onCheckedChange={(value) => {
              setEmail(value)
              save(value, inApp)
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-3 pt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="notif-inapp" className={labelClass}>
              Dalam aplikasi
            </Label>
            <span className={hintClass}>Notifikasi di lonceng navigasi.</span>
          </div>
          <Switch
            id="notif-inapp"
            className={switchClass}
            checked={inApp}
            disabled={isPending}
            onCheckedChange={(value) => {
              setInApp(value)
              save(email, value)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}