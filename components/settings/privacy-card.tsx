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
import { updatePrivacyAction } from "@/server/actions/settings"

interface PrivacyCardProps {
  initialHide: boolean
}

export function PrivacyCard({ initialHide }: PrivacyCardProps) {
  const [hide, setHide] = React.useState(initialHide)
  const [isPending, startTransition] = React.useTransition()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privasi</CardTitle>
        <CardDescription>Kontrol tampilan Anda di leaderboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <Label htmlFor="hide-leaderboard">Sembunyikan dari leaderboard</Label>
            <span className="text-xs text-muted-foreground">
              Nama Anda tampil sebagai &ldquo;Anonim&rdquo;.
            </span>
          </div>
          <Switch
            id="hide-leaderboard"
            checked={hide}
            disabled={isPending}
            onCheckedChange={(value) => {
              setHide(value)
              startTransition(async () => {
                const result = await updatePrivacyAction(value)
                if (!result.success) toast.error(result.message)
              })
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
