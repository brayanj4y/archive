import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Powered Exam Question Generator",
  description:
    "Create customized exam questions instantly using AI. Generate multiple-choice, true/false, short answer, and essay questions for any subject with adjustable difficulty levels."
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <header className="border-b py-2">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-lg font-semibold">AI Exam Generator</h1>
              <ThemeToggle />
            </div>
          </header>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
