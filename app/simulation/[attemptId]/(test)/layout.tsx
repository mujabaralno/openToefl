import { AntiCheatGuard } from "@/components/simulation/anti-cheat-guard"

export default async function SimulationAttemptLayout({
  children,
  params,
}: LayoutProps<"/simulation/[attemptId]">) {
  const { attemptId } = await params
  return <AntiCheatGuard attemptId={attemptId}>{children}</AntiCheatGuard>
}
