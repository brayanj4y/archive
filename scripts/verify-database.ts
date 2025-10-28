import { createClient } from "@supabase/supabase-js"

export async function verifyDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log("🔍 Verifying database setup...")

  try {
    // Check tables exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["profiles", "shipments", "status_updates", "notifications", "audit_logs"])

    if (tablesError) {
      console.error("❌ Error checking tables:", tablesError)
      return false
    }

    console.log(`✅ Found ${tables?.length || 0} tables`)

    // Check sample data
    const { data: shipments, error: shipmentsError } = await supabase.from("shipments").select("*").limit(5)

    if (shipmentsError) {
      console.error("❌ Error checking shipments:", shipmentsError)
      return false
    }

    console.log(`✅ Found ${shipments?.length || 0} sample shipments`)

    // Check admin users
    const { data: admins, error: adminsError } = await supabase.from("profiles").select("*").eq("role", "admin")

    if (adminsError) {
      console.error("❌ Error checking admin users:", adminsError)
      return false
    }

    console.log(`✅ Found ${admins?.length || 0} admin users`)

    if (admins?.length === 0) {
      console.log("⚠️  No admin users found. Please create one in Supabase Auth dashboard.")
    }

    console.log("🎉 Database verification completed!")
    return true
  } catch (error) {
    console.error("❌ Database verification failed:", error)
    return false
  }
}

// Run verification if called directly
if (require.main === module) {
  verifyDatabase()
}
