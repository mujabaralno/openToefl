import { describe, expect, it } from "vitest"

import {
  calculateTotalScore,
  convertScore,
  getScoreCategory,
} from "./scoring"

describe("convertScore", () => {
  it("matches the PRD §8.4 example", () => {
    expect(convertScore("listening", 38)).toBe(52)
    expect(convertScore("structure", 30)).toBe(55)
    expect(convertScore("reading", 40)).toBe(57)
  })

  it("returns the bounds of each table", () => {
    expect(convertScore("listening", 50)).toBe(68)
    expect(convertScore("listening", 0)).toBe(31)
    expect(convertScore("structure", 40)).toBe(68)
    expect(convertScore("structure", 0)).toBe(31)
    expect(convertScore("reading", 50)).toBe(67)
    expect(convertScore("reading", 0)).toBe(31)
  })

  it("clamps out-of-range raw scores", () => {
    expect(convertScore("structure", 99)).toBe(68)
    expect(convertScore("listening", -5)).toBe(31)
  })
})

describe("calculateTotalScore", () => {
  it("matches the PRD §8.4 example (52 + 55 + 57 → 547)", () => {
    expect(calculateTotalScore(52, 55, 57)).toBe(547)
  })

  it("rounds to the nearest integer", () => {
    // (68 + 68 + 67) × 10 / 3 = 676.67 → 677
    expect(calculateTotalScore(68, 68, 67)).toBe(677)
    // (31 + 31 + 31) × 10 / 3 = 310
    expect(calculateTotalScore(31, 31, 31)).toBe(310)
  })
})

describe("getScoreCategory", () => {
  it("buckets totals per PRD §8.5", () => {
    expect(getScoreCategory(650)).toBe("Sangat Tinggi")
    expect(getScoreCategory(547)).toBe("Tinggi")
    expect(getScoreCategory(500)).toBe("Menengah")
    expect(getScoreCategory(400)).toBe("Rendah")
    expect(getScoreCategory(310)).toBe("Sangat Rendah")
  })
})
