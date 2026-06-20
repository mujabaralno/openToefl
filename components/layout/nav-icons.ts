/**
 * components/layout/nav-icons.ts
 * Maps serializable nav icon keys to their Lucide components. Imported by the
 * client sidebar so icon components never have to cross the RSC boundary.
 */

import {
  LayoutDashboard,
  Timer,
  Dumbbell,
  History,
  Trophy,
  Settings,
  BookOpen,
  ScrollText,
  CalendarRange,
  Users,
  type LucideIcon,
} from "lucide-react"
import { type NavIcon } from "@/types/layout"

export const navIcons: Record<NavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  simulasi: Timer,
  latihan: Dumbbell,
  riwayat: History,
  leaderboard: Trophy,
  settings: Settings,
  soal: BookOpen,
  passage: ScrollText,
  sesi: CalendarRange,
  pengguna: Users,
}
