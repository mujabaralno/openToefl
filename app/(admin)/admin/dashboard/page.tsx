import { type Metadata } from "next"
import { Users, BookOpen, ClipboardCheck, Lock } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ContentReadiness } from "@/components/admin/dashboard/content-readiness"
import { RecentStudents } from "@/components/admin/dashboard/recent-students"
import { getAdminDashboardData } from "@/server/queries/dashboard"
import { getTodayLabel } from "@/lib/dates"

export const metadata: Metadata = {
  title: "Dashboard Admin | PTESOL",
  description: "Ringkasan platform PTESOL",
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData()
  const firstName = data.adminName.split(" ")[0] || "Admin"

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        eyebrow={getTodayLabel()}
        title={`Halo, ${firstName}`}
        description="Ringkasan platform PTESOL hari ini."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Mahasiswa"
          icon={Users}
          value={data.studentCount}
          hint="Akun mahasiswa terdaftar"
        />
        <StatCard
          label="Bank Soal"
          icon={BookOpen}
          value={data.activeQuestionCount}
          hint="Soal aktif"
        />
        <StatCard
          label="Simulasi Selesai"
          icon={ClipboardCheck}
          value={data.completedAttempts}
          hint={`${data.inProgressAttempts} sedang berjalan`}
        />
        <StatCard
          label="Akun Terkunci"
          icon={Lock}
          value={data.lockedCount}
          hint="Pelanggaran anti-cheat"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContentReadiness sectionCounts={data.sectionCounts} />
        </div>
        <RecentStudents students={data.recentStudents} />
      </section>
    </div>
  )
}
