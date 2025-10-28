"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { geocodeAddress, calculateDistance, generateRoutePoints, type Coordinates } from "@/lib/services/geocoding"
import {
  calculateSimulationState,
  interpolatePosition,
  formatTimeRemaining,
  getPhaseDisplay,
  SHAKE_INTERVAL,
  UPDATE_INTERVAL,
} from "@/lib/services/simulation"
import type { Shipment, SimulationState } from "@/lib/types"

// Dynamic import for Leaflet
const loadLeaflet = async () => {
  if (typeof window === "undefined") return null

  try {
    const L = await import("leaflet")

    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })

    return L
  } catch (error) {
    console.error("Failed to load Leaflet:", error)
    return null
  }
}

interface EnhancedRealTimeMapProps {
  shipment: Shipment
  className?: string
}

export default function EnhancedRealTimeMap({ shipment, className = "" }: EnhancedRealTimeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const packageMarkerRef = useRef<any>(null)
  const routePolylineRef = useRef<any>(null)
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const shakeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leafletLib, setLeafletLib] = useState<any>(null)
  const [pickupCoords, setPickupCoords] = useState<Coordinates | null>(null)
  const [deliveryCoords, setDeliveryCoords] = useState<Coordinates | null>(null)
  const [routePoints, setRoutePoints] = useState<Coordinates[]>([])
  const [simulationState, setSimulationState] = useState<SimulationState>({
    progress: 0,
    isActive: false,
    isPaused: false,
    timeRemaining: 0,
    currentPhase: "pending",
  })
  const [distance, setDistance] = useState(0)
  const [geocodingStatus, setGeocodingStatus] = useState<string>("Initializing...")

  // Load Leaflet library
  useEffect(() => {
    let mounted = true

    const initLeaflet = async () => {
      try {
        const L = await loadLeaflet()
        if (!mounted) return

        if (L) {
          setLeafletLib(L)
          setError(null)
        } else {
          setError("Failed to load mapping library")
        }
      } catch (err) {
        if (mounted) {
          console.error("Error loading Leaflet:", err)
          setError("Failed to load mapping library")
        }
      }
    }

    initLeaflet()

    return () => {
      mounted = false
    }
  }, [])

  // Geocode addresses
  useEffect(() => {
    let mounted = true

    const geocodeAddresses = async () => {
      if (!shipment.pickup_address || !shipment.delivery_address) return

      try {
        setGeocodingStatus("Locating pickup address...")
        const pickupResult = await geocodeAddress(shipment.pickup_address)

        if (!mounted) return

        setGeocodingStatus("Locating delivery address...")
        const deliveryResult = await geocodeAddress(shipment.delivery_address)

        if (!mounted) return

        if (pickupResult.coordinates && deliveryResult.coordinates) {
          setPickupCoords(pickupResult.coordinates)
          setDeliveryCoords(deliveryResult.coordinates)

          // Calculate distance
          const dist = calculateDistance(pickupResult.coordinates, deliveryResult.coordinates)
          setDistance(dist)

          // Generate route points for smooth animation
          const points = generateRoutePoints(pickupResult.coordinates, deliveryResult.coordinates, 200)
          setRoutePoints(points)

          setGeocodingStatus("Map ready")
          setIsLoading(false)
        } else {
          setError("Could not locate one or both addresses")
          setIsLoading(false)
        }
      } catch (error) {
        if (mounted) {
          console.error("Geocoding error:", error)
          setError("Failed to locate addresses")
          setIsLoading(false)
        }
      }
    }

    geocodeAddresses()

    return () => {
      mounted = false
    }
  }, [shipment.pickup_address, shipment.delivery_address])

  // Create custom icons
  const createCustomIcon = useCallback((L: any, type: "pickup" | "delivery" | "package") => {
    const iconConfigs = {
      pickup: {
        html: `<div style="background: #10b981; width: 36px; height: 36px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                   <circle cx="12" cy="10" r="3"/>
                 </svg>
               </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      },
      delivery: {
        html: `<div style="background: #ef4444; width: 36px; height: 36px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                   <circle cx="12" cy="10" r="3"/>
                 </svg>
               </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      },
      package: {
        html: `<div id="package-marker" style="background: #3b82f6; width: 48px; height: 48px; border-radius: 50%; border: 4px solid white; box-shadow: 0 6px 20px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 1000;">
                 <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                   <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                   <path d="M9 12l2 2 4-4"/>
                 </svg>
               </div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      },
    }

    const config = iconConfigs[type]
    return L.divIcon({
      html: config.html,
      className: `custom-${type}-icon`,
      iconSize: config.iconSize,
      iconAnchor: config.iconAnchor,
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletLib || !mapRef.current || !pickupCoords || !deliveryCoords || !routePoints.length) {
      return
    }

    try {
      // Create map
      const map = leafletLib.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      })

      // Add tile layer
      leafletLib
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        })
        .addTo(map)

      // Set view to fit both points
      const bounds = leafletLib.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [deliveryCoords.lat, deliveryCoords.lng],
      ])
      map.fitBounds(bounds, { padding: [50, 50] })

      // Add pickup marker
      leafletLib
        .marker([pickupCoords.lat, pickupCoords.lng], {
          icon: createCustomIcon(leafletLib, "pickup"),
        })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 12px; min-width: 220px;">
            <strong style="color: #10b981; font-size: 16px;">📦 Pickup Location</strong><br/>
            <div style="margin: 10px 0; padding: 10px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
              ${shipment.pickup_address}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px;">
              <small style="color: #6b7280;">Package origin</small>
              <small style="color: #10b981; font-weight: 600;">START</small>
            </div>
          </div>
        `)

      // Add delivery marker
      leafletLib
        .marker([deliveryCoords.lat, deliveryCoords.lng], {
          icon: createCustomIcon(leafletLib, "delivery"),
        })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 12px; min-width: 220px;">
            <strong style="color: #ef4444; font-size: 16px;">🎯 Delivery Location</strong><br/>
            <div style="margin: 10px 0; padding: 10px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
              ${shipment.delivery_address}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px;">
              <small style="color: #6b7280;">Package destination</small>
              <small style="color: #ef4444; font-weight: 600;">END</small>
            </div>
          </div>
        `)

      // Add route polyline
      const polyline = leafletLib
        .polyline(
          routePoints.map((point) => [point.lat, point.lng]),
          {
            color: "#3b82f6",
            weight: 5,
            opacity: 0.8,
            dashArray: shipment.current_status === "delivered" ? "" : "15,10",
          },
        )
        .addTo(map)

      // Add package marker (initially at pickup location)
      const packageMarker = leafletLib
        .marker([pickupCoords.lat, pickupCoords.lng], {
          icon: createCustomIcon(leafletLib, "package"),
          zIndexOffset: 1000,
        })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 12px; min-width: 250px;">
            <strong style="color: #3b82f6; font-size: 16px;">📦 Package Location</strong><br/>
            <div style="margin: 10px 0; padding: 10px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <div style="margin-bottom: 6px;"><strong>Tracking:</strong> ${shipment.tracking_number}</div>
              <div style="margin-bottom: 6px;"><strong>Status:</strong> <span id="popup-status">${shipment.current_status.replace("_", " ").toUpperCase()}</span></div>
              <div><strong>Progress:</strong> <span id="popup-progress">0%</span></div>
            </div>
            <small style="color: #6b7280;">Real-time package location</small>
          </div>
        `)

      mapInstanceRef.current = map
      packageMarkerRef.current = packageMarker
      routePolylineRef.current = polyline
    } catch (error) {
      console.error("Error initializing map:", error)
      setError("Failed to initialize map")
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [
    leafletLib,
    pickupCoords,
    deliveryCoords,
    routePoints,
    shipment.pickup_address,
    shipment.delivery_address,
    shipment.tracking_number,
    shipment.current_status,
    createCustomIcon,
  ])

  // Main simulation loop
  useEffect(() => {
    if (!pickupCoords || !deliveryCoords || !routePoints.length) return

    const updateSimulation = () => {
      const newState = calculateSimulationState(shipment)
      setSimulationState(newState)

      // Update package position
      if (packageMarkerRef.current) {
        const position = interpolatePosition(
          pickupCoords.lat,
          pickupCoords.lng,
          deliveryCoords.lat,
          deliveryCoords.lng,
          newState.progress,
        )

        packageMarkerRef.current.setLatLng([position.lat, position.lng])

        // Update popup content
        const popupStatus = document.getElementById("popup-status")
        const popupProgress = document.getElementById("popup-progress")

        if (popupStatus) {
          popupStatus.textContent = getPhaseDisplay(newState.currentPhase)
        }
        if (popupProgress) {
          popupProgress.textContent = `${newState.progress.toFixed(1)}%`
        }
      }

      // Update route style based on status
      if (routePolylineRef.current) {
        const isDashed = newState.currentPhase !== "delivered"
        routePolylineRef.current.setStyle({
          dashArray: isDashed ? "15,10" : "",
          color: newState.currentPhase === "delivered" ? "#10b981" : "#3b82f6",
          weight: 5,
          opacity: 0.8,
        })
      }
    }

    // Initial update
    updateSimulation()

    // Set up simulation interval
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
    }

    simulationIntervalRef.current = setInterval(updateSimulation, UPDATE_INTERVAL)

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current)
        simulationIntervalRef.current = null
      }
    }
  }, [shipment, pickupCoords, deliveryCoords, routePoints])

  // Shake animation for in-transit packages
  useEffect(() => {
    if (shakeIntervalRef.current) {
      clearInterval(shakeIntervalRef.current)
    }

    if (simulationState.isActive && !simulationState.isPaused) {
      const triggerShake = () => {
        const packageElement = document.getElementById("package-marker")
        if (packageElement) {
          packageElement.style.animation = "none"
          // Force reflow
          packageElement.offsetHeight
          packageElement.style.animation = "shake 0.6s ease-in-out"
        }
      }

      // Initial shake after 1 second
      const initialTimeout = setTimeout(triggerShake, 1000)

      // Then shake every 8 seconds
      shakeIntervalRef.current = setInterval(triggerShake, SHAKE_INTERVAL)

      return () => {
        clearTimeout(initialTimeout)
        if (shakeIntervalRef.current) {
          clearInterval(shakeIntervalRef.current)
          shakeIntervalRef.current = null
        }
      }
    }

    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current)
        shakeIntervalRef.current = null
      }
    }
  }, [simulationState.isActive, simulationState.isPaused])

  if (isLoading) {
    return (
      <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
        <div className="h-96 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">{geocodingStatus}</p>
            <p className="text-slate-500 text-sm mt-2">Preparing real-time tracking...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
        <div className="h-96 flex items-center justify-center bg-slate-50">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Map Unavailable</h3>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
      {/* Add shake animation CSS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
      `}</style>

      {/* Map Header */}
      <div className="absolute top-0 left-0 z-[1000] bg-white/95 backdrop-blur-sm m-4 px-4 py-3 rounded-lg shadow-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">🚚 Live Package Tracking</h3>
        <p className="text-xs text-slate-600 mt-1">{getPhaseDisplay(simulationState.currentPhase)}</p>
        {distance > 0 && <p className="text-xs text-slate-500 mt-1">Distance: {distance.toFixed(0)} miles</p>}
      </div>

      {/* Status Indicator */}
      <div className="absolute top-0 right-0 z-[1000] m-4">
        {simulationState.isPaused && (
          <div className="bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-lg mb-2">
            <p className="text-xs font-medium">⏸️ On Hold</p>
          </div>
        )}
        {simulationState.isActive && !simulationState.isPaused && (
          <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg mb-2">
            <p className="text-xs font-medium">🚛 Moving</p>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="h-96 w-full" />

      {/* Enhanced Progress Bar and Info */}
      <div className="bg-white p-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-slate-800">Delivery Progress</h4>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-600">{simulationState.progress.toFixed(1)}%</span>
            <p className="text-xs text-slate-500">{getPhaseDisplay(simulationState.currentPhase)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner mb-4">
          <div
            className={`h-4 rounded-full transition-all duration-1000 shadow-sm ${
              simulationState.currentPhase === "delivered"
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : simulationState.isPaused
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
            }`}
            style={{ width: `${simulationState.progress}%` }}
          ></div>
        </div>

        {/* Status Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-slate-600">Pickup</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-slate-600">Package</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-slate-600">Delivery</span>
            </div>
          </div>

          {simulationState.timeRemaining > 0 && simulationState.isActive && (
            <div className="text-right">
              <span className="text-slate-500">ETA: </span>
              <span className="font-bold text-slate-700">{formatTimeRemaining(simulationState.timeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Simulation Status */}
        <div className="mt-4 p-3 rounded-lg border">
          {simulationState.isPaused && (
            <div className="bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-700">
                ⏸️ <strong>Shipment On Hold</strong> - Package movement is paused at{" "}
                {simulationState.progress.toFixed(1)}% progress
              </p>
            </div>
          )}
          {simulationState.isActive && !simulationState.isPaused && (
            <div className="bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-700">
                🚛 <strong>Package Moving</strong> - Real-time simulation in progress. Package shakes every 8 seconds.
              </p>
            </div>
          )}
          {simulationState.currentPhase === "delivered" && (
            <div className="bg-green-50 border-green-200">
              <p className="text-sm text-green-700">
                ✅ <strong>Package Delivered</strong> - Shipment has reached its destination successfully!
              </p>
            </div>
          )}
          {simulationState.currentPhase === "pending" && (
            <div className="bg-slate-50 border-slate-200">
              <p className="text-sm text-slate-700">
                📦 <strong>Awaiting Pickup</strong> - Package is ready for collection and transport
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
