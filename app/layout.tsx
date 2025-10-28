import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

import { Inter, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'
import { Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: '--v0-font-geist' })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: '--v0-font-geist-mono' })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"], variable: '--v0-font-source-serif-4' })
const _v0_fontVariables = `${_geist.variable} ${_geistMono.variable} ${_sourceSerif_4.variable}`

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://shiptrackpro.com"),
  title: {
    default: "ShipTrack Pro - Professional Package Tracking & Logistics Services",
    template: "%s | ShipTrack Pro",
  },
  description:
    "Track your shipments with real-time GPS updates. Professional logistics services including express shipping, fragile items, pet transportation, and international shipping. 99.9% on-time delivery rate.",
  keywords: [
    "package tracking",
    "shipment tracking",
    "logistics",
    "express shipping",
    "international shipping",
    "pet transportation",
    "fragile items shipping",
    "real-time tracking",
    "GPS tracking",
    "courier service",
  ],
  authors: [{ name: "ShipTrack Pro" }],
  creator: "ShipTrack Pro",
  publisher: "ShipTrack Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shiptrackpro.com",
    siteName: "ShipTrack Pro",
    title: "ShipTrack Pro - Professional Package Tracking & Logistics Services",
    description:
      "Track your shipments with real-time GPS updates. Professional logistics services with 99.9% on-time delivery rate.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShipTrack Pro - Professional Package Tracking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipTrack Pro - Professional Package Tracking & Logistics Services",
    description:
      "Track your shipments with real-time GPS updates. Professional logistics services with 99.9% on-time delivery rate.",
    images: ["/og-image.jpg"],
    creator: "@shiptrackpro",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ShipTrack Pro",
              url: "https://shiptrackpro.com",
              logo: "https://shiptrackpro.com/logo.png",
              description: "Professional package tracking and logistics services with real-time GPS updates",
              address: {
                "@type": "PostalAddress",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-800-SHIPTRACK",
                contactType: "Customer Service",
                areaServed: "Worldwide",
                availableLanguage: ["English"],
              },
              sameAs: [
                "https://facebook.com/shiptrackpro",
                "https://twitter.com/shiptrackpro",
                "https://linkedin.com/company/shiptrackpro",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className + " " + _v0_fontVariables}>{children}</body>
    </html>
  )
}
