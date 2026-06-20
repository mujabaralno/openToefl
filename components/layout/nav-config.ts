/**
 * components/layout/nav-config.ts
 * Static navigation definitions for each role's sidebar.
 * Icons are string keys (see nav-icons.ts) so these objects stay serializable
 * across the Server→Client boundary.
 */

import { type NavItem } from "@/types/layout"

export const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { title: "Simulasi", href: "/simulation", icon: "simulasi" },
  { title: "Latihan", href: "/practice", icon: "latihan" },
  { title: "Riwayat", href: "/history", icon: "riwayat" },
  { title: "Leaderboard", href: "/leaderboard", icon: "leaderboard" },
  { title: "Settings", href: "/settings", icon: "settings" },
]

export const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { title: "Soal", href: "/admin/questions", icon: "soal" },
  { title: "Passage", href: "/admin/passages", icon: "passage" },
  { title: "Sesi", href: "/admin/sesi", icon: "sesi" },
  { title: "Pengguna", href: "/admin/users", icon: "pengguna" },
]
