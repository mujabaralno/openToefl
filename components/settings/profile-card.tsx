"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Upload } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { getInitials } from "@/lib/users"
import { profileSchema } from "@/lib/validations/settings"
import { updateProfileAction } from "@/server/actions/settings"
import type { ProfileFormData } from "@/types/settings"

interface ProfileCardProps {
  userId: string
  email: string
  initial: ProfileFormData
}

export function ProfileCard({ userId, email, initial }: ProfileCardProps) {
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = React.useTransition()
  const [uploading, setUploading] = React.useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial,
  })

  const avatarUrl = useWatch({ control: form.control, name: "avatar_url" })
  const fullName = useWatch({ control: form.control, name: "full_name" })

  function onSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB.")
      return
    }

    setUploading(true)
    const ext = file.name.split(".").pop() ?? "png"
    const path = `${userId}/avatar-${Date.now()}.${ext}`
    supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })
      .then(({ error }) => {
        if (error) {
          toast.error("Gagal mengunggah avatar.")
          return
        }
        const { data } = supabase.storage.from("avatars").getPublicUrl(path)
        form.setValue("avatar_url", data.publicUrl, { shouldDirty: true })
        toast.success("Avatar terunggah. Klik simpan untuk menerapkan.")
      })
      .finally(() => setUploading(false))
  }

  function onSubmit(values: ProfileFormData) {
    startTransition(async () => {
      const result = await updateProfileAction(values)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Perbarui identitas dan foto Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={avatarUrl || undefined} alt={fullName} />
                <AvatarFallback className="font-mono">
                  {getInitials(fullName || email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onSelectFile}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload />
                  {uploading ? "Mengunggah…" : "Ganti foto"}
                </Button>
                <span className="text-xs text-muted-foreground">
                  PNG/JPG, maksimal 2MB.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input value={email} disabled readOnly />
            </div>

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama lengkap</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIM</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="program_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program studi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-fit"
              disabled={isPending || uploading}
            >
              {isPending ? "Menyimpan…" : "Simpan profil"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
