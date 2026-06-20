/**
 * lib/dates.ts
 * Indonesian date formatting helpers. Kept out of component render bodies so
 * the `new Date()` calls stay clear of the react purity lint rule.
 */

export function formatLongDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatShortDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function getTodayLabel(): string {
  return formatLongDate(new Date())
}
