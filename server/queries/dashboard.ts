import { createClient } from "@/lib/supabase/server"
import type { QuestionSection } from "@/types/question"
import type { UserRow } from "@/types/user"

export interface AdminDashboardData {
  adminName: string
  studentCount: number
  lockedCount: number
  activeQuestionCount: number
  sectionCounts: Record<QuestionSection, number>
  completedAttempts: number
  inProgressAttempts: number
  recentStudents: UserRow[]
}

/** Real platform stats for the admin dashboard. RLS limits this to admins. */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let adminName = ""
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
    adminName = profile?.full_name ?? ""
  }

  const [
    students,
    locked,
    activeQuestions,
    listening,
    structure,
    reading,
    completed,
    inProgress,
    recent,
  ] = await Promise.all([
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_locked", true),
    supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("section", "listening"),
    supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("section", "structure"),
    supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("section", "reading"),
    supabase
      .from("test_attempts")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    supabase
      .from("test_attempts")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress"),
    supabase
      .from("users")
      .select("*")
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return {
    adminName,
    studentCount: students.count ?? 0,
    lockedCount: locked.count ?? 0,
    activeQuestionCount: activeQuestions.count ?? 0,
    sectionCounts: {
      listening: listening.count ?? 0,
      structure: structure.count ?? 0,
      reading: reading.count ?? 0,
    },
    completedAttempts: completed.count ?? 0,
    inProgressAttempts: inProgress.count ?? 0,
    recentStudents: recent.data ?? [],
  }
}
