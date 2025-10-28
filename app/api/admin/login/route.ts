import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // For demo purposes, we'll use simple credentials
    // In production, you should use proper password hashing
    if (email === "admin@shiptrack.com" && password === "admin123") {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

      return NextResponse.json({
        success: true,
        token,
        user: {
          email: "admin@shiptrack.com",
          name: "System Administrator",
          role: "admin",
        },
      })
    }

    // Try to authenticate against the database
    try {
      const { data: adminUser, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

      if (error || !adminUser) {
        return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
      }

      // For the demo, we'll also accept plain text password "admin123"
      const isValidPassword =
        password === "admin123" ||
        (adminUser.password_hash && (await bcrypt.compare(password, adminUser.password_hash)))

      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
      }

      // Generate a simple token
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        },
      })
    } catch (dbError) {
      console.error("Database authentication error:", dbError)

      // Fallback to hardcoded credentials for demo
      if (email === "admin@shiptrack.com" && password === "admin123") {
        const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

        return NextResponse.json({
          success: true,
          token,
          user: {
            email: "admin@shiptrack.com",
            name: "System Administrator",
            role: "admin",
          },
        })
      }

      return NextResponse.json({ success: false, error: "Authentication service unavailable" }, { status: 503 })
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
