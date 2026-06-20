"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TriangleAlert } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateMaintenanceMode } from "@/server/actions/app-settings"

interface MaintenanceCardProps {
  initialEnabled: boolean
  initialMessage: string
}

export function MaintenanceCard({
  initialEnabled,
  initialMessage,
}: MaintenanceCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const [enabled, setEnabled] = React.useState(initialEnabled)
  const [message, setMessage] = React.useState(initialMessage)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const messageChanged = message.trim() !== initialMessage.trim()

  function submit(nextEnabled: boolean) {
    startTransition(async () => {
      try {
        const result = await updateMaintenanceMode(nextEnabled, message)
        if (result.success) {
          setEnabled(nextEnabled)
          toast.success(result.message)
          router.refresh()
        } else {
          // Roll the switch back to the server's truth on failure.
          setEnabled(initialEnabled)
          toast.error(result.message)
        }
      } catch {
        setEnabled(initialEnabled)
        toast.error("Terjadi kesalahan sistem.")
      }
    })
  }

  // Turning ON is impactful → confirm first. Turning OFF is applied immediately.
  function handleToggle(next: boolean) {
    if (next) {
      setConfirmOpen(true)
    } else {
      submit(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Mode</CardTitle>
        <CardDescription>
          Saat aktif, semua pengunjung non-admin akan diarahkan ke halaman
          maintenance. Admin tetap bisa mengakses panel dan halaman login.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="maintenance-toggle" className="text-sm font-medium">
              Aktifkan maintenance mode
            </Label>
            <p className="text-sm text-muted-foreground">
              {enabled
                ? "Aplikasi sedang dalam mode maintenance."
                : "Aplikasi berjalan normal."}
            </p>
          </div>
          <Switch
            id="maintenance-toggle"
            checked={enabled}
            disabled={isPending}
            onCheckedChange={handleToggle}
            aria-label="Aktifkan maintenance mode"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="maintenance-message">Pesan maintenance (opsional)</Label>
          <Textarea
            id="maintenance-message"
            rows={3}
            maxLength={500}
            placeholder="mis. Sedang ada perbaikan, kembali lagi pukul 22:00 WIB."
            value={message}
            disabled={isPending}
            onChange={(event) => setMessage(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Ditampilkan di halaman /maintenance. Maks 500 karakter.
          </p>
        </div>

        {messageChanged && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => submit(enabled)}
            >
              {isPending ? "Menyimpan…" : "Simpan pesan"}
            </Button>
          </div>
        )}
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <TriangleAlert className="size-5 text-destructive" />
              Aktifkan maintenance mode?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Semua pengguna non-admin akan langsung diarahkan ke halaman
              maintenance dan tidak bisa mengakses simulasi, latihan, maupun
              dashboard mereka. Anda tetap bisa mematikannya kembali dari
              halaman ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault()
                setConfirmOpen(false)
                submit(true)
              }}
            >
              Ya, aktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
