import { SimulationSectionPage } from "@/components/simulation/simulation-section-page"

export default async function ReadingSectionPage({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params
  return <SimulationSectionPage attemptId={attemptId} section="reading" />
}
