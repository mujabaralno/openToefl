"use client"

import * as React from "react"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { formatShortDate } from "@/lib/dates"
import type { NotificationRow } from "@/types/notification"

interface NotificationBellProps {
  userId: string
}

// Gaya pixel: semua warna dari token (lihat tokens.css)
const triggerClass = cn(
  "relative size-11 rounded-none border-3 border-border bg-card text-foreground shadow-sm",
  "transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-accent hover:shadow",
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs",
  "data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:hover:bg-primary",
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring"
)

const markReadClass = cn(
  "h-8 rounded-none border-2 border-border bg-card px-3 font-mono text-[10px] font-bold uppercase shadow-xs",
  "hover:bg-accent hover:text-accent-foreground active:translate-x-px active:translate-y-px active:shadow-none",
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
)

export function NotificationBell({ userId }: NotificationBellProps) {
  const supabase = React.useMemo(() => createClient(), [])
  const [items, setItems] = React.useState<NotificationRow[]>([])

  React.useEffect(() => {
    let active = true

    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (active && data) setItems(data)
      })

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on<NotificationRow>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setItems((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  const unread = items.filter((item) => !item.is_read).length

  function markAllRead() {
    if (unread === 0) return
    setItems((prev) => prev.map((item) => ({ ...item, is_read: true })))
    void supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={triggerClass}
          aria-label={
            unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"
          }
        >
          <Bell className="size-5" aria-hidden="true" />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center border-2 border-primary-foreground bg-destructive px-1 font-mono text-[10px] font-bold text-destructive-foreground tabular-nums"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 rounded-none border-4 border-border bg-popover p-0 text-popover-foreground shadow-md"
      >
        <div className="flex items-center justify-between gap-3 border-b-4 border-border bg-muted px-4 py-3">
          <span className="font-serif text-xs leading-none">Notifikasi</span>
          {unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              className={markReadClass}
              onClick={markAllRead}
            >
              Tandai dibaca
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-2 border-3 border-dashed border-muted-foreground px-4 py-8 text-center">
              <span className="flex size-11 items-center justify-center border-3 border-border bg-muted">
                <Bell className="size-5" aria-hidden="true" />
              </span>
              <p className="font-serif text-[11px] leading-normal">
                Belum ada notifikasi
              </p>
              <p className="text-lg leading-tight text-muted-foreground">
                Notifikasi baru akan muncul di sini.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col gap-1 border-b-2 border-border/30 px-4 py-3 last:border-b-0",
                  !item.is_read && "bg-accent"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {item.title}
                  </span>
                  {!item.is_read && (
                    <>
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 border-2 border-border bg-primary"
                      />
                      <span className="sr-only">Belum dibaca</span>
                    </>
                  )}
                </div>
                <span className="text-lg leading-tight text-muted-foreground">
                  {item.message}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formatShortDate(item.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}