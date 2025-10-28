import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

// Database setup script
export async function setupDatabase() {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    console.log("Please set the following environment variables:")
    console.log("- NEXT_PUBLIC_SUPABASE_URL")
    console.log("- SUPABASE_SERVICE_ROLE_KEY")
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log("🚀 Starting database setup...")

  try {
    // Read and execute SQL scripts in order
    const scriptsDir = path.join(process.cwd(), "scripts")
    const sqlFiles = [
      "01-create-tables.sql",
      "02-create-rls-policies.sql",
      "03-create-triggers.sql",
      "04-seed-data.sql",
      "05-create-functions.sql",
    ]

    for (const file of sqlFiles) {
      console.log(`📝 Executing ${file}...`)
      const sqlContent = fs.readFileSync(path.join(scriptsDir, file), "utf8")

      const { error } = await supabase.rpc("exec_sql", { sql: sqlContent })

      if (error) {
        console.error(`❌ Error executing ${file}:`, error)
        return false
      }

      console.log(`✅ ${file} executed successfully`)
    }

    console.log("🎉 Database setup completed successfully!")
    console.log("📋 Next steps:")
    console.log("1. Create an admin user in Supabase Auth dashboard")
    console.log("2. Update and run 06-create-admin-user.sql with the actual user ID")
    console.log("3. Run 07-verify-setup.sql to verify everything works")

    return true
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    return false
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
}
