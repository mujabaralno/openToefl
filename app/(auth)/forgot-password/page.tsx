import { type Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Lupa Password | PTESOL",
  description: "Reset password akun PTESOL Anda",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Lupa Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
