import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

interface Props {
  params: { trackingNumber: string }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    console.log("API: Fetching shipment for tracking number:", params.trackingNumber)

    const supabase = createServerClient()

    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", params.trackingNumber)
      .single()

    console.log("API: Shipment query result:", { shipment, shipmentError })

    if (shipmentError) {
      console.error("API: Shipment error:", shipmentError)
      return NextResponse.json({ error: "Shipment not found", details: shipmentError }, { status: 404 })
    }

    if (!shipment) {
      console.log("API: No shipment found")
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    const { data: statusUpdates, error: statusError } = await supabase
      .from("status_updates")
      .select("*")
      .eq("shipment_id", shipment.id)
      .order("created_at", { ascending: false })

    console.log("API: Status updates query result:", { statusUpdates, statusError })

    if (statusError) {
      console.error("API: Status updates error:", statusError)
    }

    return NextResponse.json({
      shipment,
      statusUpdates: statusUpdates || [],
    })
  } catch (error) {
    console.error("API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    console.log("API: Updating shipment status for:", params.trackingNumber)

    const supabase = createServerClient()
    const body = await request.json()

    const { status, location, description } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Get shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", params.trackingNumber)
      .single()

    if (shipmentError || !shipment) {
      console.error("API: Shipment not found for update:", shipmentError)
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      current_status: status,
      updated_at: new Date().toISOString(),
    }

    // Handle timing logic based on status changes
    const currentTime = new Date().toISOString()

    if (status === "in_transit") {
      // If changing to in_transit and no start_time exists, set it
      if (!shipment.start_time) {
        updateData.start_time = currentTime
        updateData.paused_progress_percent = 0
        updateData.total_paused_duration = 0
      }
      // If resuming from on_hold, don't change start_time but reset paused state
    } else if (status === "on_hold") {
      // When putting on hold, we'll calculate and store the current progress
      if (shipment.start_time && shipment.current_status === "in_transit") {
        const startTime = new Date(shipment.start_time).getTime()
        const now = new Date().getTime()
        const totalPausedDuration = shipment.total_paused_duration || 0
        const activeTime = (now - startTime - totalPausedDuration) / 1000 // in seconds
        const progress = Math.min((activeTime / (48 * 60 * 60)) * 100, 100) // 48 hours = 172800 seconds
        updateData.paused_progress_percent = progress
      }
    } else if (status === "delivered") {
      // When delivered, set progress to 100%
      updateData.paused_progress_percent = 100
    } else if (status === "pending") {
      // Reset all timing data when going back to pending
      updateData.start_time = null
      updateData.paused_progress_percent = 0
      updateData.total_paused_duration = 0
    }

    // Update shipment status
    const { error: updateError } = await supabase.from("shipments").update(updateData).eq("id", shipment.id)

    if (updateError) {
      console.error("API: Failed to update shipment:", updateError)
      return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 })
    }

    // Add status update
    const { error: statusError } = await supabase.from("status_updates").insert({
      shipment_id: shipment.id,
      status,
      location,
      description,
    })

    if (statusError) {
      console.error("API: Status update error:", statusError)
    }

    console.log("API: Successfully updated shipment status")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API: Unexpected error in PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
