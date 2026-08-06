import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateTrackingNumber } from "@/lib/utils/tracking"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const {
      client_name,
      client_email,
      client_phone,
      pickup_address,
      delivery_address,
      receiver_name,
      receiver_email,
      receiver_phone,
      receiver_address,
      package_name,
      package_weight,
      package_type = "general",
      insurance_amount = 0,
      special_instructions,
    } = body

    // Validate required fields
    if (
      !client_name ||
      !client_email ||
      !client_phone ||
      !pickup_address ||
      !delivery_address ||
      !receiver_name ||
      !receiver_email ||
      !receiver_phone ||
      !receiver_address ||
      !package_name ||
      !package_weight
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique tracking number
    const tracking_number = generateTrackingNumber()

    // Insert shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .insert({
        tracking_number,
        client_name,
        client_email,
        client_phone,
        pickup_address,
        delivery_address,
        receiver_name,
        receiver_email,
        receiver_phone,
        receiver_address,
        package_name,
        package_weight: Number.parseFloat(package_weight),
        package_type,
        insurance_amount: Number.parseFloat(insurance_amount) || 0,
        special_instructions,
        current_status: "pending",
      })
      .select()
      .single()

    if (shipmentError) {
      console.error("Shipment creation error:", shipmentError)
      return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
    }

    // Create initial status update
    const { error: statusError } = await supabase.from("status_updates").insert({
      shipment_id: shipment.id,
      status: "pending",
      description: "Shipment created and pending pickup",
      location: pickup_address,
    })

    if (statusError) {
      console.error("Status update error:", statusError)
    }

    return NextResponse.json({
      success: true,
      shipment,
      tracking_number,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: shipments, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 })
    }

    return NextResponse.json({ shipments })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
