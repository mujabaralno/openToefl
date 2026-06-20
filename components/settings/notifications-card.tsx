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
import { updateNotificationsAction } from "@/server/actions/settings"

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
    <Card>
      <CardHeader>
        <CardTitle>Notifikasi</CardTitle>
        <CardDescription>Pilih cara Anda menerima pemberitahuan.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <Label htmlFor="notif-email">Email</Label>
            <span className="text-xs text-muted-foreground">
              Kabar penting dikirim ke email Anda.
            </span>
          </div>
          <Switch
            id="notif-email"
            checked={email}
            disabled={isPending}
            onCheckedChange={(value) => {
              setEmail(value)
              save(value, inApp)
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <Label htmlFor="notif-inapp">Dalam aplikasi</Label>
            <span className="text-xs text-muted-foreground">
              Notifikasi di lonceng navigasi.
            </span>
          </div>
          <Switch
            id="notif-inapp"
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
