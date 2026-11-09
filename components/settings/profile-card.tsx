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
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { getInitials } from "@/lib/users"
import { profileSchema } from "@/lib/validations/settings"
import { updateProfileAction } from "@/server/actions/settings"
import type { ProfileFormData } from "@/types/settings"

// Gaya pixel: semua warna dari token (lihat tokens.css)
const focusClass =
  "focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring"

const fieldClass = cn(
  "h-12 rounded-none border-3 border-border bg-card px-4 font-sans text-xl text-foreground shadow-none dark:bg-background",
  "placeholder:text-muted-foreground focus-visible:border-border",
  "disabled:border-border/30 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 dark:disabled:bg-muted",
  focusClass
)

const labelClass = "font-mono text-xs font-bold text-foreground"
const messageClass = "text-lg text-danger-foreground"

const secondaryButtonClass = cn(
  "h-9 w-fit rounded-none border-3 border-border bg-card px-3 font-mono text-[11px] font-bold uppercase text-foreground shadow-sm",
  "transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-accent hover:shadow",
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs",
  "disabled:border-border/30 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:shadow-none",
  focusClass
)

const primaryButtonClass = cn(
  "h-11 w-fit rounded-none border-3 border-primary-foreground bg-primary px-5 font-mono text-xs font-bold tracking-wider uppercase text-primary-foreground shadow-sm",
  "transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-primary hover:shadow",
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs",
  "disabled:border-border/30 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:shadow-none",
  focusClass
)

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
    <Card className="rounded-none border-4 border-border shadow">
      <CardHeader className="gap-2 border-b-2 border-border pb-4">
        <CardTitle className="font-serif text-sm leading-snug font-normal">
          Profil
        </CardTitle>
        <CardDescription className="text-xl leading-tight text-muted-foreground">
          Perbarui identitas dan foto Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-4">
              {/* Avatar kotak 56px: tanpa prop size agar tidak bentrok dengan data-size */}
              <Avatar className="size-14 rounded-none border-3 border-border shadow-xs">
                <AvatarImage
                  src={avatarUrl || undefined}
                  alt={fullName}
                  className="rounded-none"
                />
                <AvatarFallback className="rounded-none bg-primary font-serif text-sm text-primary-foreground">
                  {getInitials(fullName || email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  aria-label="Pilih foto profil"
                  className="sr-only"
                  onChange={onSelectFile}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={secondaryButtonClass}
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload aria-hidden="true" />
                  {uploading ? "Mengunggah…" : "Ganti foto"}
                </Button>
                <span className="text-lg leading-none text-muted-foreground">
                  PNG/JPG, maksimal 2MB.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-email" className={labelClass}>
                Email
              </Label>
              <Input
                id="profile-email"
                value={email}
                disabled
                readOnly
                className={fieldClass}
              />
            </div>

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Nama lengkap</FormLabel>
                  <FormControl>
                    <Input className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage className={messageClass} />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>NIM</FormLabel>
                    <FormControl>
                      <Input className={fieldClass} {...field} />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="program_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Program studi</FormLabel>
                    <FormControl>
                      <Input className={fieldClass} {...field} />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className={primaryButtonClass}
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