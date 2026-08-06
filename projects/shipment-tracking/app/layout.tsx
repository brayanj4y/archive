import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

import { Inter, Roboto_Mono, Source_Serif_4 } from "next/font/google"

// Initialize fonts
const _inter = Inter({ subsets: ['latin'], weight: ["400", "500", "600", "700"], variable: '--inter-font' })
const _mono = Roboto_Mono({ subsets: ['latin'], weight: ["400", "500", "700"], variable: '--mono-font' })
const _serif = Source_Serif_4({ subsets: ['latin'], weight: ["400", "500", "600", "700"], variable: '--serif-font' })
const _fontVariables = `${_inter.variable} ${_mono.variable} ${_serif.variable}`

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${_fontVariables}`}>
        {children}
      </body>
    </html>
  )
}
