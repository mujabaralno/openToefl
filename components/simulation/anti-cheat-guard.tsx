"use client"

import * as React from "react"

import { useAntiCheat } from "@/hooks/use-anti-cheat"
import { SimulationGuardContext } from "@/components/simulation/simulation-guard-context"

interface AntiCheatGuardProps {
  attemptId: string
  children: React.ReactNode
}

/** Mounts anti-cheat detection and exposes `disarm` to descendants. */
export function AntiCheatGuard({ attemptId, children }: AntiCheatGuardProps) {
  const guard = useAntiCheat({ attemptId })
  return (
    <SimulationGuardContext.Provider value={guard}>
      {children}
    </SimulationGuardContext.Provider>
  )
}
