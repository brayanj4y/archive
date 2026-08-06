import { NextResponse } from "next/server"
import { checkAvailableModels } from "@/lib/check-models"

export async function GET() {
  try {
    const models = await checkAvailableModels()
    return NextResponse.json({ models })
  } catch (error) {
    console.error("Error checking models:", error)
    return NextResponse.json({ error: "Failed to check models" }, { status: 500 })
  }
}

