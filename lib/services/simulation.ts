import type { Shipment, SimulationState } from "@/lib/types"

export const SIMULATION_DURATION = 48 * 60 * 60 * 1000 // 48 hours in milliseconds
export const SHAKE_INTERVAL = 8000 // 8 seconds
export const UPDATE_INTERVAL = 1000 // 1 second

export function calculateSimulationState(shipment: Shipment): SimulationState {
  const now = new Date().getTime()

  // Default state
  const state: SimulationState = {
    progress: 0,
    isActive: false,
    isPaused: false,
    timeRemaining: 0,
    currentPhase: "pending",
  }

  if (shipment.current_status === "pending") {
    return { ...state, currentPhase: "pending" }
  }

  if (shipment.current_status === "delivered") {
    return {
      progress: 100,
      isActive: false,
      isPaused: false,
      timeRemaining: 0,
      currentPhase: "delivered",
    }
  }

  if (shipment.current_status === "on_hold") {
    return {
      progress: shipment.paused_progress_percent || 0,
      isActive: false,
      isPaused: true,
      timeRemaining: 0,
      currentPhase: "in_transit",
    }
  }

  if (shipment.current_status === "in_transit" && shipment.start_time) {
    const startTime = new Date(shipment.start_time).getTime()
    const totalPausedDuration = (shipment.total_paused_duration || 0) * 1000 // convert to ms
    const pausedProgress = shipment.paused_progress_percent || 0

    // Calculate active time (excluding paused duration)
    const activeTime = now - startTime - totalPausedDuration

    // Calculate progress from paused point
    const additionalProgress = (activeTime / SIMULATION_DURATION) * 100
    const totalProgress = Math.min(pausedProgress + additionalProgress, 100)

    // Calculate time remaining
    const remainingProgress = 100 - totalProgress
    const timeRemaining = (remainingProgress / 100) * SIMULATION_DURATION

    // Determine current phase
    let currentPhase: SimulationState["currentPhase"] = "in_transit"
    if (totalProgress >= 100) {
      currentPhase = "delivered"
    } else if (totalProgress >= 85) {
      currentPhase = "near_destination"
    }

    return {
      progress: totalProgress,
      isActive: true,
      isPaused: false,
      timeRemaining,
      currentPhase,
    }
  }

  return state
}

export function interpolatePosition(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  progress: number,
): { lat: number; lng: number } {
  const normalizedProgress = Math.max(0, Math.min(1, progress / 100))

  return {
    lat: startLat + (endLat - startLat) * normalizedProgress,
    lng: startLng + (endLng - startLng) * normalizedProgress,
  }
}

export function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function getPhaseDisplay(phase: SimulationState["currentPhase"]): string {
  switch (phase) {
    case "pending":
      return "📦 Awaiting Pickup"
    case "in_transit":
      return "🚛 In Transit"
    case "near_destination":
      return "🎯 Near Destination"
    case "delivered":
      return "✅ Delivered"
    default:
      return "📦 Processing"
  }
}
