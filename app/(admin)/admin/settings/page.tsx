import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { MaintenanceCard } from "@/components/admin/settings/maintenance-card"
import { getAppSettingsRow } from "@/server/queries/app-settings"

export const metadata: Metadata = {
  title: "Pengaturan Aplikasi | PTESOL",
  description: "Pengaturan global aplikasi PTESOL",
}

export default async function AdminSettingsPage() {
  const settings = await getAppSettingsRow()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <PageHeader
        eyebrow="Admin"
        title="Pengaturan Aplikasi"
        description="Pengaturan global yang berlaku untuk seluruh aplikasi."
      />
      <MaintenanceCard
        initialEnabled={settings?.maintenance_mode ?? false}
        initialMessage={settings?.maintenance_message ?? ""}
      />
    </div>
  )
}
