import { type Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | PTESOL",
  description: "Masuk ke akun PTESOL Anda",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5">
        <LoginForm />
      </div>
    </div>
  )
}
