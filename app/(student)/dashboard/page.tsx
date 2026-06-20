import { type Metadata } from "next"
import { ClipboardCheck, Trophy, BarChart3, Dumbbell } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ProgressSection } from "@/components/dashboard/progress-section"
import { StartSimulationCard } from "@/components/student/start-simulation-card"
import { getStudentProgress } from "@/server/queries/student-dashboard"

export const metadata: Metadata = {
  title: "Dashboard | PTESOL",
  description: "Ringkasan progres simulasi TOEFL ITP Anda",
}

export default async function StudentDashboardPage() {
  const progress = await getStudentProgress()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        eyebrow="Mahasiswa"
        title="Dashboard"
        description="Pantau progres dan mulai simulasi TOEFL ITP Anda."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Simulasi Selesai"
          icon={ClipboardCheck}
          value={progress.completedCount}
          hint="Total simulasi selesai"
        />
        <StatCard
          label="Skor Tertinggi"
          icon={Trophy}
          value={progress.bestScore}
          hint="Skala 310–677"
        />
        <StatCard
          label="Rata-rata Skor"
          icon={BarChart3}
          value={progress.averageScore}
          hint="Dari semua simulasi"
        />
        <StatCard
          label="Latihan Selesai"
          icon={Dumbbell}
          value={progress.practiceCount}
          hint="Mode latihan mandiri"
        />
      </section>

      <StartSimulationCard />

      <ProgressSection attempts={progress.attempts} />
    </div>
  )
}
