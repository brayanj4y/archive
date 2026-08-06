import type { Metadata } from "next"
import { notFound } from "next/navigation"
import TrackingResult from "./tracking-result"
import { createServerClient } from "@/lib/supabase"

interface Props {
  params: { trackingNumber: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = createServerClient()

    const { data: shipment } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", params.trackingNumber)
      .single()

    if (!shipment) {
      return {
        title: "Tracking Number Not Found - ShipTrack Pro",
        description: "The tracking number you entered was not found in our system.",
        robots: "noindex, nofollow",
      }
    }

    const senderInfo = `${shipment.client_name} (${shipment.client_email})`
    const receiverInfo = shipment.receiver_name
      ? `${shipment.receiver_name} (${shipment.receiver_email})`
      : "Receiver information available"

    return {
      title: `Track ${params.trackingNumber} - ${shipment.package_name} Shipment | ShipTrack Pro`,
      description: `Track your ${shipment.package_type} shipment of ${shipment.package_name} (${shipment.package_weight} lbs) from ${shipment.client_name} to ${shipment.receiver_name || "destination"}. Current status: ${shipment.current_status}. Professional logistics tracking with real-time updates.`,
      keywords: `package tracking, ${shipment.package_type} shipping, ${shipment.package_name}, logistics tracking, shipment status, ${params.trackingNumber}`,
      openGraph: {
        title: `Tracking ${params.trackingNumber} - ${shipment.package_name}`,
        description: `${shipment.package_type} shipment from ${senderInfo} to ${receiverInfo}. Status: ${shipment.current_status}`,
        type: "website",
        images: [
          {
            url: "/api/og-image?tracking=" + params.trackingNumber,
            width: 1200,
            height: 630,
            alt: `Tracking information for ${params.trackingNumber}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Track ${params.trackingNumber} - ShipTrack Pro`,
        description: `${shipment.package_name} shipment tracking - Current status: ${shipment.current_status}`,
        images: ["/api/og-image?tracking=" + params.trackingNumber],
      },
      alternates: {
        canonical: `/track/${params.trackingNumber}`,
      },
      other: {
        "shipment:tracking_number": params.trackingNumber,
        "shipment:status": shipment.current_status,
        "shipment:type": shipment.package_type,
        "shipment:sender": shipment.client_name,
        "shipment:receiver": shipment.receiver_name || "",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Tracking Error - ShipTrack Pro",
      description: "Error loading tracking information. Please try again.",
      robots: "noindex, nofollow",
    }
  }
}

export default async function TrackingPage({ params }: Props) {
  try {
    const supabase = createServerClient()

    console.log("Fetching shipment for tracking number:", params.trackingNumber)

    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", params.trackingNumber)
      .single()

    console.log("Shipment query result:", { shipment, shipmentError })

    if (shipmentError) {
      console.error("Shipment error:", shipmentError)
      notFound()
    }

    if (!shipment) {
      console.log("No shipment found")
      notFound()
    }

    const { data: statusUpdates, error: statusError } = await supabase
      .from("status_updates")
      .select("*")
      .eq("shipment_id", shipment.id)
      .order("created_at", { ascending: false })

    console.log("Status updates query result:", { statusUpdates, statusError })

    if (statusError) {
      console.error("Status updates error:", statusError)
    }

    return <TrackingResult shipment={shipment} statusUpdates={statusUpdates || []} />
  } catch (error) {
    console.error("Error in TrackingPage:", error)
    notFound()
  }
}
