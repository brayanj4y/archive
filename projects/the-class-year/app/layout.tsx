import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Class @Year — A Timeline of Teenagers",
  description: "A timeline of teenagers from the 1970s to the 2020s",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      new URL("icons/favicon.ico", "https://example.com"), // if you have a CDN
      { url: "icons/favicon-96x96.png", type: "image/png", sizes: "32x32" },
      { url: "icons/favicon-96x96.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "icons/apple-touch-icon.png" },
    ],
    other: [
      {
        rel: "icons/favicon-96x96",
        url: "icons/favicon-96x96.png",
      },
      {
        rel: "icons/favicon-96x96",
        url: "icons/favicon-96x96.png",
      },
    ],
  },
  manifest: "icons/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}