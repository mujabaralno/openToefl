import type { Metadata } from "next"
import { Geist, Geist_Mono, Press_Start_2P, VT323, Silkscreen } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400"
})

const VT = VT323({
  variable: "--font-VT-323",
  weight: "400"
})

const silkScreen = Silkscreen({
  variable: "--font-silk-screen",
  weight: "400"
})

export const metadata: Metadata = {
  title: {
    default: "PTESOL — Simulasi TOEFL ITP",
    template: "%s",
  },
  description:
    "Platform simulasi TOEFL ITP gratis dan autentik untuk mahasiswa.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} ${VT.variable} ${silkScreen.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
