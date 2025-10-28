import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const results: string[] = []
    const errors: string[] = []

    // Step 1: Create shipments table
    try {
      const { error: shipmentsError } = await supabase.rpc("create_shipments_table")

      if (shipmentsError) {
        // Fallback: Try creating using a simple query
        const { error: fallbackError } = await supabase.from("shipments").select("id").limit(1)

        if (fallbackError && fallbackError.message.includes("does not exist")) {
          // Table doesn't exist, we need to create it manually
          errors.push("Shipments table creation failed - please run SQL manually in Supabase dashboard")
        } else {
          results.push("✅ Shipments table already exists or created successfully")
        }
      } else {
        results.push("✅ Shipments table created successfully")
      }
    } catch (error) {
      console.log("Checking if shipments table exists...")
      const { error: checkError } = await supabase.from("shipments").select("id").limit(1)

      if (checkError && checkError.message.includes("does not exist")) {
        errors.push("Shipments table needs to be created manually")
      } else {
        results.push("✅ Shipments table already exists")
      }
    }

    // Step 2: Create status_updates table
    try {
      const { error: statusError } = await supabase.from("status_updates").select("id").limit(1)

      if (statusError && statusError.message.includes("does not exist")) {
        errors.push("Status updates table needs to be created manually")
      } else {
        results.push("✅ Status updates table exists")
      }
    } catch (error) {
      errors.push("Could not verify status updates table")
    }

    // Step 3: Create admin_users table
    try {
      const { error: adminError } = await supabase.from("admin_users").select("id").limit(1)

      if (adminError && adminError.message.includes("does not exist")) {
        errors.push("Admin users table needs to be created manually")
      } else {
        results.push("✅ Admin users table exists")
      }
    } catch (error) {
      errors.push("Could not verify admin users table")
    }

    // Step 4: Insert sample data if tables exist
    if (errors.length === 0) {
      try {
        // Insert sample shipment
        const { error: insertError } = await supabase.from("shipments").upsert(
          {
            tracking_number: "ST12345678ABCD",
            client_name: "John Smith",
            client_email: "john.smith@email.com",
            client_phone: "+1-555-0123",
            pickup_address: "123 Main Street, New York, NY 10001",
            delivery_address: "456 Oak Avenue, Los Angeles, CA 90210",
            receiver_name: "Jane Doe",
            receiver_email: "jane.doe@email.com",
            receiver_phone: "+1-555-0456",
            receiver_address: "456 Oak Avenue, Los Angeles, CA 90210",
            package_name: "Electronics Package",
            package_weight: 5.5,
            package_type: "fragile",
            current_status: "in_transit",
            insurance_amount: 500.0,
            special_instructions: "Handle with extreme care - contains sensitive electronics",
          },
          {
            onConflict: "tracking_number",
          },
        )

        if (!insertError) {
          results.push("✅ Sample shipment data inserted")
        }

        // Insert admin user
        const { error: adminInsertError } = await supabase.from("admin_users").upsert(
          {
            email: "admin@shiptrack.com",
            password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
            name: "System Administrator",
            role: "admin",
          },
          {
            onConflict: "email",
          },
        )

        if (!adminInsertError) {
          results.push("✅ Admin user created/updated")
        }
      } catch (insertError) {
        console.log("Insert error:", insertError)
      }
    }

    const success = results.length > 0 && errors.length === 0

    return NextResponse.json({
      success,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message: success ? "Database setup completed" : "Database setup needs manual intervention",
      sqlScript: errors.length > 0 ? generateSQLScript() : undefined,
    })
  } catch (error) {
    console.error("Setup API error:", error)
    return NextResponse.json(
      {
        success: false,
        errors: ["Internal server error during database setup"],
        details: error instanceof Error ? error.message : "Unknown error",
        sqlScript: generateSQLScript(),
      },
      { status: 500 },
    )
  }
}

function generateSQLScript(): string {
  return `
-- ShipTrack Pro Database Setup Script
-- Copy and paste this into your Supabase SQL Editor

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  receiver_name VARCHAR(255),
  receiver_email VARCHAR(255),
  receiver_phone VARCHAR(255),
  receiver_address TEXT,
  package_name VARCHAR(255) NOT NULL,
  package_weight DECIMAL(10,2) NOT NULL,
  package_type VARCHAR(100) DEFAULT 'general',
  current_status VARCHAR(50) DEFAULT 'pending',
  insurance_amount DECIMAL(10,2) DEFAULT 0,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create status updates table
CREATE TABLE IF NOT EXISTS status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(current_status);
CREATE INDEX IF NOT EXISTS idx_shipments_client_email ON shipments(client_email);
CREATE INDEX IF NOT EXISTS idx_shipments_receiver_email ON shipments(receiver_email);
CREATE INDEX IF NOT EXISTS idx_status_updates_shipment_id ON status_updates(shipment_id);
CREATE INDEX IF NOT EXISTS idx_status_updates_created_at ON status_updates(created_at);

-- Insert sample shipment data
INSERT INTO shipments (
  tracking_number, client_name, client_email, client_phone, pickup_address,
  delivery_address, receiver_name, receiver_email, receiver_phone, receiver_address,
  package_name, package_weight, package_type, current_status, insurance_amount,
  special_instructions
) VALUES (
  'ST12345678ABCD',
  'John Smith',
  'john.smith@email.com',
  '+1-555-0123',
  '123 Main Street, New York, NY 10001',
  '456 Oak Avenue, Los Angeles, CA 90210',
  'Jane Doe',
  'jane.doe@email.com',
  '+1-555-0456',
  '456 Oak Avenue, Los Angeles, CA 90210',
  'Electronics Package',
  5.5,
  'fragile',
  'in_transit',
  500.00,
  'Handle with extreme care - contains sensitive electronics'
) ON CONFLICT (tracking_number) DO NOTHING;

-- Insert more sample data
INSERT INTO shipments (
  tracking_number, client_name, client_email, client_phone, pickup_address,
  delivery_address, receiver_name, receiver_email, receiver_phone, receiver_address,
  package_name, package_weight, package_type, current_status, insurance_amount
) VALUES 
(
  'ST87654321EFGH',
  'Sarah Johnson',
  'sarah.johnson@email.com',
  '+1-555-0789',
  '789 Pine Street, Chicago, IL 60601',
  '321 Elm Drive, Miami, FL 33101',
  'Mike Wilson',
  'mike.wilson@email.com',
  '+1-555-0321',
  '321 Elm Drive, Miami, FL 33101',
  'Important Documents',
  2.0,
  'general',
  'delivered',
  100.00
),
(
  'ST11223344IJKL',
  'Robert Davis',
  'robert.davis@email.com',
  '+1-555-0654',
  '654 Cedar Lane, Seattle, WA 98101',
  '987 Maple Court, Denver, CO 80201',
  'Lisa Brown',
  'lisa.brown@email.com',
  '+1-555-0987',
  '987 Maple Court, Denver, CO 80201',
  'Golden Retriever - Max',
  65.0,
  'pet',
  'pending',
  800.00
) ON CONFLICT (tracking_number) DO NOTHING;

-- Insert status updates for sample shipments
INSERT INTO status_updates (shipment_id, status, location, description) VALUES
(
  (SELECT id FROM shipments WHERE tracking_number = 'ST12345678ABCD'),
  'pending',
  'New York, NY',
  'Package received and processed at origin facility'
),
(
  (SELECT id FROM shipments WHERE tracking_number = 'ST12345678ABCD'),
  'in_transit',
  'Chicago, IL',
  'Package in transit - passed through Chicago sorting facility'
),
(
  (SELECT id FROM shipments WHERE tracking_number = 'ST87654321EFGH'),
  'delivered',
  'Miami, FL',
  'Package delivered successfully to recipient'
);

-- Insert default admin user
INSERT INTO admin_users (email, password_hash, name, role) VALUES (
  'admin@shiptrack.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'System Administrator',
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role;
`.trim()
}
