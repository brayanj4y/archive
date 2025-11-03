import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import { OrganizationSchema } from "@/components/structured-data"
import "./globals.css"

import {
  Libre_Baskerville,
  IBM_Plex_Mono,
  Geist as V0_Font_Geist,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google"

// Initialize fonts
const _geist = V0_Font_Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _geistMono = V0_Font_Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
})

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  title: {
    default: "CH French Bulldogs - Premium French Bulldog Puppies for Sale, Adoption & Rehoming",
    template: "%s | CH French Bulldogs",
  },
  description:
    "Find your perfect French Bulldog companion. Premium French Bulldog puppies for sale, adoption, and rehoming. Champion bloodlines, health guarantees, and trusted breeders since 2008. Located in Dallas, Texas.",
  keywords: [
    "French Bulldog puppies for sale",
    "French Bulldog adoption",
    "French Bulldog rehoming",
    "French Bulldog breeders",
    "French Bulldog puppies near me",
    "buy French Bulldog puppy",
    "French Bulldog for adoption",
    "champion bloodline French Bulldogs",
    "healthy French Bulldog puppies",
    "Dallas French Bulldog breeder",
    "Texas French Bulldog puppies",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ch-french-bulldogs.vercel.app",
    siteName: "CH French Bulldogs",
    title: "CH French Bulldogs - Premium French Bulldog Puppies for Sale & Adoption",
    description:
      "Find your perfect French Bulldog companion. Quality bloodlines, health guarantees, and trusted breeders since 2008.",
    images: [
      {
        url: "/logo-hori.png",
        width: 1200,
        height: 630,
        alt: "CH French Bulldogs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CH French Bulldogs - Premium French Bulldog Puppies",
    description:
      "Find your perfect French Bulldog companion. Quality bloodlines, health guarantees, and trusted breeders since 2008.",
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://ch-french-bulldogs.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ch-french-bulldogs.vercel.app"

  return (
    <html lang="en">
      <head>
        <OrganizationSchema baseUrl={baseUrl} />
      </head>
      <body className={`${libreBaskerville.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        <CartProvider>
          <Navigation />
          <div className="h-16"></div>
          {children}
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
