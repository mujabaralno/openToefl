import { type Metadata } from "next"

import { PageHeader } from "@/components/dashboard/page-header"
import { UsersManager } from "@/components/admin/users/users-manager"
import { createClient } from "@/lib/supabase/server"
import { getAllUsers } from "@/server/queries/users"

export const metadata: Metadata = {
  title: "Manajemen Pengguna | PTESOL",
  description: "Kelola akun mahasiswa, unlock, dan status akun",
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const users = await getAllUsers()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        eyebrow="Admin"
        title="Pengguna"
        description="Kelola akun, buka kunci anti-cheat, dan lihat riwayat tes."
      />
      <UsersManager users={users} currentUserId={user?.id ?? ""} />
    </div>
  )
}
