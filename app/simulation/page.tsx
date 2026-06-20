import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { TestInfo } from "@/components/simulation/test-info"
import { SimulationStartButton } from "@/components/simulation/simulation-start-button"

export const metadata: Metadata = {
  title: "Simulasi TOEFL ITP | PTESOL",
  description: "Informasi dan mulai simulasi TOEFL ITP",
}

export default function SimulationInfoPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Simulasi Penuh"
        title="Simulasi TOEFL ITP"
        description="Tiga seksi berurutan dengan timer ketat, persis format resmi ETS."
      />
      <TestInfo />
      <SimulationStartButton />
    </div>
  )
}
