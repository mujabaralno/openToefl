import { describe, expect, it } from "vitest"

import {
  toScoreTrend,
  toSectionBalance,
  toSectionComparison,
  type ProgressAttempt,
} from "./charts"

const attempts: ProgressAttempt[] = [
  {
    date: "2026-01-01T00:00:00Z",
    total: 450,
    listening: 45,
    structure: 44,
    reading: 46,
  },
  {
    date: "2026-02-01T00:00:00Z",
    total: 520,
    listening: 52,
    structure: 50,
    reading: 53,
  },
]

describe("toScoreTrend", () => {
  it("maps attempts to labelled totals in order", () => {
    expect(toScoreTrend(attempts)).toEqual([
      { label: "Tes 1", total: 450 },
      { label: "Tes 2", total: 520 },
    ])
  })

  it("returns an empty array for no attempts", () => {
    expect(toScoreTrend([])).toEqual([])
  })
})

describe("toSectionComparison", () => {
  it("maps per-section scaled scores per attempt", () => {
    expect(toSectionComparison(attempts)).toEqual([
      { label: "Tes 1", listening: 45, structure: 44, reading: 46 },
      { label: "Tes 2", listening: 52, structure: 50, reading: 53 },
    ])
  })
})

describe("toSectionBalance", () => {
  it("uses the latest attempt's three sections", () => {
    expect(toSectionBalance(attempts)).toEqual([
      { section: "Listening", score: 52 },
      { section: "Structure", score: 50 },
      { section: "Reading", score: 53 },
    ])
  })

  it("returns an empty array when there are no attempts", () => {
    expect(toSectionBalance([])).toEqual([])
  })
})
