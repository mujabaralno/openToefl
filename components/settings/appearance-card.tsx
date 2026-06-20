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
import { updateAppearanceAction } from "@/server/actions/settings"
import type { LanguagePreference, ThemePreference } from "@/types/settings"

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
    <Card>
      <CardHeader>
        <CardTitle>Tampilan</CardTitle>
        <CardDescription>Atur tema dan bahasa aplikasi.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <div className="flex flex-1 flex-col gap-2">
          <Label>Tema</Label>
          <Select
            value={currentTheme}
            onValueChange={(value) => {
              const next = value as ThemePreference
              setTheme(next)
              save(next, language)
            }}
            disabled={isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Terang</SelectItem>
              <SelectItem value="dark">Gelap</SelectItem>
              <SelectItem value="system">Ikuti sistem</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label>Bahasa</Label>
          <Select
            value={language}
            onValueChange={(value) => {
              const next = value as LanguagePreference
              setLanguage(next)
              save(currentTheme, next)
            }}
            disabled={isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
