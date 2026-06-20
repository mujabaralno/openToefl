import { type Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | PTESOL",
  description: "Masuk ke akun PTESOL Anda",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email dan password Anda untuk masuk
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
