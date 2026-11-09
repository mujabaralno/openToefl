"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { loginAction } from "@/server/actions/auth"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "../ui/alert"
import { CircleAlert, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

const fieldClass =
  "h-12 rounded-none border-3 border-border bg-card px-4 font-sans text-xl text-foreground shadow-none " +
  "placeholder:text-muted-foreground dark:bg-background " +
  "focus-visible:border-border focus-visible:ring-0 focus-visible:outline-3 " +
  "focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring"

const labelClass = "font-mono text-xs font-bold text-foreground"
const messageClass = "text-lg text-danger-foreground"
const linkClass =
  "font-mono text-[11px] text-foreground underline underline-offset-4 hover:bg-primary hover:text-primary-foreground"

export function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: LoginFormData) {
    startTransition(async () => {
      try {
        const result = await loginAction(data)
        if (result.success) {
          toast.success(result.message)
          if (result.redirectTo) {
            router.push(result.redirectTo)
          }
        } else {
          toast.error(result.message)
          setSubmitError(result.message)
        }
      } catch {
        toast.error("Terjadi kesalahan sistem")
        setSubmitError("Terjadi kesalahan sistem")
      }
    })
  }

  return (
    <div className="grid gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-card translate-x-3 translate-y-3"></div>
        <div className="relative bg-card border-4 border-border p-6 sm:p-9 z-10">
          <div className="mb-8">
            <h1
              className="text-2xl sm:text-3xl text-foreground font-bold tracking-wide"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Masuk
            </h1>
            <p
              className="mt-3 text-lg text-secondary-foreground font-medium"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              Masuk ke dashboard openToefl.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {submitError && (
                <Alert className="rounded-none border-2 border-black bg-red-100 p-3 shadow-[2px_2px_0px_#000]">
                  <CircleAlert className="w-5 h-5 text-red-600" />
                  <AlertDescription
                    className="text-red-700 text-sm font-semibold ml-2"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nama@email.com"
                        type="email"
                        autoCapitalize="none"
                        className="w-full h-12 bg-white border-3 border-border px-4 text-base font-mono text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-[#faffd6]"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel className={labelClass}>Password</FormLabel>
                      <Link href="/forgot-password" className={linkClass}>
                        Lupa password?
                      </Link>
                    </div>
                    {/* relative wrapper di luar FormControl: FormControl (Slot) hanya boleh punya 1 child */}
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          disabled={isPending}
                          className={cn(fieldClass, "pr-12")}
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-ring disabled:opacity-50"
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        aria-pressed={showPassword}
                        disabled={isPending}
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" aria-hidden="true" />
                        ) : (
                          <Eye className="size-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                aria-live="polite"
                disabled={isPending}
                className="w-full h-13 mt-2 bg-[#cbf526] hover:bg-[#bce31f] text-black font-bold border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {isPending ? "MEMPROSES..." : "MASUK"}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
