/**
 * lib/get-app-settings.ts
 *
 * Reader for the singleton `app_settings` row, used by the middleware on every
 * request (maintenance gate) and by the /maintenance page.
 *
 * The middleware runs on the Edge runtime where Next's Data Cache isn't
 * available, so we keep a small in-memory TTL cache (per runtime isolate) to
 * avoid hitting the database on every request. The row is read via the Supabase
 * REST API with the anon key (no cookies needed — RLS allows SELECT for all).
 *
 * Fail-open: if the row can't be read, we return maintenance OFF so a transient
 * DB/network hiccup never locks every visitor out of the app.
 */

/** Explicit, camelCase view of the app_settings row (no `any`). */
export interface AppSettings {
  maintenanceMode: boolean
  maintenanceMessage: string | null
  updatedBy: string | null
  updatedAt: string | null
}

const DEFAULT_SETTINGS: AppSettings = {
  maintenanceMode: false,
  maintenanceMessage: null,
  updatedBy: null,
  updatedAt: null,
}

const TTL_MS = 10_000

interface CacheEntry {
  value: AppSettings
  expiresAt: number
}

// Per-isolate memo. Best-effort: persists across requests within one runtime
// instance, converges within TTL after an admin toggles the setting.
let memo: CacheEntry | null = null

/** Narrow an unknown REST row into AppSettings without using `any`. */
function toAppSettings(row: unknown): AppSettings {
  if (typeof row !== "object" || row === null) return DEFAULT_SETTINGS
  const record = row as Record<string, unknown>
  return {
    maintenanceMode: record.maintenance_mode === true,
    maintenanceMessage:
      typeof record.maintenance_message === "string"
        ? record.maintenance_message
        : null,
    updatedBy: typeof record.updated_by === "string" ? record.updated_by : null,
    updatedAt: typeof record.updated_at === "string" ? record.updated_at : null,
  }
}

async function fetchAppSettings(): Promise<AppSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return DEFAULT_SETTINGS

  try {
    const res = await fetch(
      `${url}/rest/v1/app_settings?select=maintenance_mode,maintenance_message,updated_by,updated_at&limit=1`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        // We do our own short-lived in-memory caching; don't let the runtime
        // serve an unexpectedly stale value.
        cache: "no-store",
      }
    )
    if (!res.ok) return DEFAULT_SETTINGS

    const data: unknown = await res.json()
    if (!Array.isArray(data) || data.length === 0) return DEFAULT_SETTINGS
    return toAppSettings(data[0])
  } catch {
    return DEFAULT_SETTINGS
  }
}

/** Read global app settings, served from a short in-memory cache when fresh. */
export async function getAppSettings(): Promise<AppSettings> {
  const now = Date.now()
  if (memo && memo.expiresAt > now) return memo.value

  const value = await fetchAppSettings()
  memo = { value, expiresAt: now + TTL_MS }
  return value
}

/**
 * Drop the in-memory cache so the next read re-fetches. Called by the admin
 * server action after a toggle (clears this runtime's memo immediately; other
 * isolates converge within TTL).
 */
export function invalidateAppSettingsCache(): void {
  memo = null
}
