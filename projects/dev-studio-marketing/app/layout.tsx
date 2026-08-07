import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevStudio - No-Code Apps & Custom Websites",
  description: "We build no-code apps using FlutterFlow and custom websites using Next.js — fast and beautiful.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devstudio.com",
    title: "DevStudio - No-Code Apps & Custom Websites",
    description: "We build no-code apps using FlutterFlow and custom websites using Next.js — fast and beautiful.",
    siteName: "DevStudio",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
