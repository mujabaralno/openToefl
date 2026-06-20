import { redirect } from "next/navigation"

import { AppNavbar } from "@/components/layout/app-navbar"
import { SidebarContent } from "@/components/layout/sidebar-content"
import { adminNavItems } from "@/components/layout/nav-config"
import { createClient } from "@/lib/supabase/server"
import { type NavUser } from "@/types/layout"

const HOME_HREF = "/admin/dashboard"
const PANEL_LABEL = "Panel Admin"

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, email, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) redirect("/login")
  // Middleware already gates this, but guard again so the admin shell never
  // renders for a non-admin.
  if (profile.role !== "admin") redirect("/dashboard")

  const navUser: NavUser = {
    id: user.id,
    name: profile.full_name || profile.email,
    email: profile.email,
    avatarUrl: profile.avatar_url,
    role: profile.role,
  }

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0 h-svh overflow-y-auto">
          <SidebarContent items={adminNavItems} homeHref={HOME_HREF} panelLabel={PANEL_LABEL} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar
          user={navUser}
          items={adminNavItems}
          homeHref={HOME_HREF}
          panelLabel={PANEL_LABEL}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
