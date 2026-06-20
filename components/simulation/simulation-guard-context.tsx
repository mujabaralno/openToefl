"use client"

import * as React from "react"

interface SimulationGuardValue {
  /** Suppress anti-cheat violations for the rest of this mount (e.g. when the
   *  test ends legitimately and we exit fullscreen ourselves). */
  disarm: () => void
}

export const SimulationGuardContext =
  React.createContext<SimulationGuardValue | null>(null)

export function useSimulationGuard(): SimulationGuardValue {
  return React.useContext(SimulationGuardContext) ?? { disarm: () => {} }
}
