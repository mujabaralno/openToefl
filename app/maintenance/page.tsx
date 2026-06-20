import { type Metadata } from "next"
import { Wrench } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAppSettingsRow } from "@/server/queries/app-settings"

export const metadata: Metadata = {
  title: "Sedang Maintenance | PTESOL",
  description: "Aplikasi sedang dalam pemeliharaan.",
}

const DEFAULT_MESSAGE =
  "Aplikasi sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi."

export default async function MaintenancePage() {
  const settings = await getAppSettingsRow()
  const message = settings?.maintenance_message?.trim() || DEFAULT_MESSAGE

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Wrench className="size-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">Sedang Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
