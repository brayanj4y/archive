export interface Shipment {
  id: string
  tracking_number: string
  client_name: string
  client_email: string
  client_phone: string
  pickup_address: string
  delivery_address: string
  // New receiver fields
  receiver_name: string
  receiver_email: string
  receiver_phone: string
  receiver_address: string
  package_name: string
  package_weight: number
  package_type: string
  current_status: "pending" | "on_hold" | "in_transit" | "delivered"
  insurance_amount: number
  special_instructions?: string
  created_at: string
  updated_at: string
  // New simulation fields
  start_time?: string
  paused_progress_percent?: number
  total_paused_duration?: number
}

export interface StatusUpdate {
  id: string
  shipment_id: string
  status: string
  location?: string
  description?: string
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

// New interface for simulation state
export interface SimulationState {
  progress: number
  isActive: boolean
  isPaused: boolean
  timeRemaining: number
  currentPhase: "pending" | "in_transit" | "near_destination" | "delivered"
}
