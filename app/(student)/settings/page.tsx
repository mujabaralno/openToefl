import { type Metadata } from "next"
import { redirect } from "next/navigation"

import { PageHeader } from "@/components/dashboard/page-header"
import { ProfileCard } from "@/components/settings/profile-card"
import { AppearanceCard } from "@/components/settings/appearance-card"
import { NotificationsCard } from "@/components/settings/notifications-card"
import { PrivacyCard } from "@/components/settings/privacy-card"
import { PasswordCard } from "@/components/settings/password-card"
import { getSettings } from "@/server/queries/settings"

export const metadata: Metadata = {
  title: "Pengaturan | PTESOL",
  description: "Kelola preferensi dan profil akun Anda",
}

export default async function SettingsPage() {
  const settings = await getSettings()
  if (!settings) redirect("/login")

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <PageHeader
        eyebrow="Mahasiswa"
        title="Pengaturan"
        description="Kelola preferensi, profil, dan keamanan akun."
      />

      <ProfileCard
        userId={settings.userId}
        email={settings.profile.email}
        initial={{
          full_name: settings.profile.fullName,
          student_id: settings.profile.studentId,
          program_study: settings.profile.programStudy,
          avatar_url: settings.profile.avatarUrl,
        }}
      />
      <AppearanceCard initialLanguage={settings.language} />
      <NotificationsCard
        initialEmail={settings.emailNotifications}
        initialInApp={settings.inappNotifications}
      />
      <PrivacyCard initialHide={settings.hideLeaderboard} />
      <PasswordCard />
    </div>
  )
}
