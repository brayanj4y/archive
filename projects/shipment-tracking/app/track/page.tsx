import type { Metadata } from "next"
import TrackClientPage from "./track-client-page"

export const metadata: Metadata = {
  title: "Track Your Package - Real-Time Shipment Tracking",
  description:
    "Track your shipment in real-time with live GPS updates. Enter your tracking number to get instant status updates, location information, and estimated delivery time.",
  keywords: [
    "track package",
    "shipment tracking",
    "tracking number",
    "real-time tracking",
    "GPS tracking",
    "package location",
  ],
  openGraph: {
    title: "Track Your Package - Real-Time Shipment Tracking | ShipTrack Pro",
    description: "Track your shipment in real-time with live GPS updates and instant notifications.",
    url: "https://shiptrackpro.com/track",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Track Your Package - Real-Time Shipment Tracking",
    description: "Track your shipment in real-time with live GPS updates and instant notifications.",
  },
}

export default function TrackPage() {
  return <TrackClientPage />
}
