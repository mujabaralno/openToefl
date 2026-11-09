"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { updateAppearanceAction } from "@/server/actions/settings"
import type { LanguagePreference, ThemePreference } from "@/types/settings"

// Gaya pixel: semua warna dari token (lihat tokens.css)
const labelClass = "font-mono text-xs font-bold text-foreground"

const triggerClass = cn(
  "w-full rounded-none border-3 border-border bg-card px-4 font-sans text-xl text-foreground shadow-none",
  "data-[size=default]:h-12 dark:bg-background dark:hover:bg-background",
  "data-[placeholder]:text-muted-foreground",
  "disabled:border-border/30 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 dark:disabled:bg-muted",
  "focus-visible:border-border focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring",
  "data-[state=open]:outline-3 data-[state=open]:outline-solid data-[state=open]:outline-offset-3 data-[state=open]:outline-ring"
)

const contentClass =
  "rounded-none border-3 border-border bg-popover text-popover-foreground shadow-md"

// Opsi terpilih = blok lime (seperti dropdown di design system), hover = muted
const itemClass = cn(
  "rounded-none py-2.5 pr-9 pl-3.5 text-xl",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[state=checked]:bg-primary data-[state=checked]:font-bold data-[state=checked]:text-primary-foreground",
  "data-[state=checked]:focus:bg-primary data-[state=checked]:focus:text-primary-foreground",
  "[&_svg:not([class*='text-'])]:text-current"
)

interface AppearanceCardProps {
  initialLanguage: LanguagePreference
}

export function AppearanceCard({ initialLanguage }: AppearanceCardProps) {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = React.useState<LanguagePreference>(
    initialLanguage
  )
  const [isPending, startTransition] = React.useTransition()
  const currentTheme = (theme as ThemePreference | undefined) ?? "system"

  function save(nextTheme: ThemePreference, nextLanguage: LanguagePreference) {
    startTransition(async () => {
      const result = await updateAppearanceAction(nextTheme, nextLanguage)
      if (!result.success) toast.error(result.message)
    })
  }

  return (
    <Card className="rounded-none border-4 border-border shadow">
      <CardHeader className="gap-2 border-b-2 border-border pb-4">
        <CardTitle className="font-serif text-sm leading-snug font-normal">
          Tampilan
        </CardTitle>
        <CardDescription className="text-xl leading-tight text-muted-foreground">
          Atur tema dan bahasa aplikasi.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="theme-select" className={labelClass}>
            Tema
          </Label>
          <Select
            value={currentTheme}
            onValueChange={(value) => {
              const next = value as ThemePreference
              setTheme(next)
              save(next, language)
            }}
            disabled={isPending}
          >
            <SelectTrigger id="theme-select" className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={contentClass}>
              <SelectItem value="light" className={itemClass}>
                Terang
              </SelectItem>
              <SelectItem value="dark" className={itemClass}>
                Gelap
              </SelectItem>
              <SelectItem value="system" className={itemClass}>
                Ikuti sistem
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="language-select" className={labelClass}>
            Bahasa
          </Label>
          <Select
            value={language}
            onValueChange={(value) => {
              const next = value as LanguagePreference
              setLanguage(next)
              save(currentTheme, next)
            }}
            disabled={isPending}
          >
            <SelectTrigger id="language-select" className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={contentClass}>
              <SelectItem value="id" className={itemClass}>
                Indonesia
              </SelectItem>
              <SelectItem value="en" className={itemClass}>
                English
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}