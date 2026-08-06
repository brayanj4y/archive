import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for admin operations)
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Client component client (for use in client components)
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: "admin" | "customer" | "operator"
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: "admin" | "customer" | "operator"
          avatar_url?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: "admin" | "customer" | "operator"
          avatar_url?: string | null
        }
      }
      shipments: {
        Row: {
          id: string
          tracking_number: string
          client_name: string
          client_email: string
          client_phone: string
          pickup_address: string
          receiver_name: string
          receiver_email: string
          receiver_phone: string
          receiver_address: string
          delivery_address: string
          package_name: string
          package_weight: number
          package_type: "general" | "fragile" | "pet" | "international"
          current_status: "pending" | "on_hold" | "in_transit" | "delivered"
          insurance_amount: number
          shipping_cost: number | null
          special_instructions: string | null
          estimated_delivery_date: string | null
          actual_delivery_date: string | null
          start_time: string | null
          paused_progress_percent: number | null
          total_paused_duration: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          tracking_number: string
          client_name: string
          client_email: string
          client_phone: string
          pickup_address: string
          receiver_name: string
          receiver_email: string
          receiver_phone: string
          receiver_address: string
          delivery_address: string
          package_name: string
          package_weight: number
          package_type?: "general" | "fragile" | "pet" | "international"
          current_status?: "pending" | "on_hold" | "in_transit" | "delivered"
          insurance_amount?: number
          shipping_cost?: number | null
          special_instructions?: string | null
          estimated_delivery_date?: string | null
          actual_delivery_date?: string | null
          start_time?: string | null
          paused_progress_percent?: number | null
          total_paused_duration?: number | null
          created_by?: string | null
        }
        Update: {
          client_name?: string
          client_email?: string
          client_phone?: string
          pickup_address?: string
          receiver_name?: string
          receiver_email?: string
          receiver_phone?: string
          receiver_address?: string
          delivery_address?: string
          package_name?: string
          package_weight?: number
          package_type?: "general" | "fragile" | "pet" | "international"
          current_status?: "pending" | "on_hold" | "in_transit" | "delivered"
          insurance_amount?: number
          shipping_cost?: number | null
          special_instructions?: string | null
          estimated_delivery_date?: string | null
          actual_delivery_date?: string | null
          start_time?: string | null
          paused_progress_percent?: number | null
          total_paused_duration?: number | null
        }
      }
      status_updates: {
        Row: {
          id: string
          shipment_id: string
          status: "pending" | "on_hold" | "in_transit" | "delivered"
          location: string | null
          description: string | null
          latitude: number | null
          longitude: number | null
          updated_by: string | null
          created_at: string
        }
        Insert: {
          shipment_id: string
          status: "pending" | "on_hold" | "in_transit" | "delivered"
          location?: string | null
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          updated_by?: string | null
        }
        Update: {
          status?: "pending" | "on_hold" | "in_transit" | "delivered"
          location?: string | null
          description?: string | null
          latitude?: number | null
          longitude?: number | null
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          password_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          name: string
          role?: string
          password_hash?: string | null
        }
        Update: {
          email?: string
          name?: string
          role?: string
          password_hash?: string | null
        }
      }
    }
  }
}
