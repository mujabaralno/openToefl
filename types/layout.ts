/**
 * types/layout.ts
 * Shared types for the dashboard shell (sidebar, navbar, user menu).
 * Used across both the student and admin layouts.
 */

import { type Enums } from "@/types/database.types"

/**
 * String keys for nav icons. Items carry the key (serializable) so they can
 * cross the Server→Client boundary; the client resolves it to a Lucide
 * component via `navIcons` in components/layout/nav-icons.ts.
 */
export type NavIcon =
  | "dashboard"
  | "simulasi"
  | "latihan"
  | "riwayat"
  | "leaderboard"
  | "settings"
  | "soal"
  | "passage"
  | "sesi"
  | "pengguna"

/** A single navigation entry rendered in the sidebar. */
export interface NavItem {
  /** Visible label, e.g. "Dashboard". */
  title: string
  /** Absolute route this entry links to, e.g. "/dashboard". */
  href: string
  /** Icon key resolved to a Lucide component on the client. */
  icon: NavIcon
}

/** Minimal profile data needed to render the navbar user menu. */
export interface NavUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: Enums<"user_role">
}
