"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { geocodeAddress, calculateDistance, generateRoutePoints, type Coordinates } from "@/lib/services/geocoding"

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

interface RealTimeShipmentMapProps {
  pickupAddress: string
  deliveryAddress: string
  currentStatus: string
  trackingNumber: string
  className?: string
}

export default function RealTimeShipmentMap({
  pickupAddress,
  deliveryAddress,
  currentStatus,
  trackingNumber,
  className = "",
}: RealTimeShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const packageMarkerRef = useRef<any>(null)
  const routePolylineRef = useRef<any>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leafletLib, setLeafletLib] = useState<any>(null)
  const [pickupCoords, setPickupCoords] = useState<Coordinates | null>(null)
  const [deliveryCoords, setDeliveryCoords] = useState<Coordinates | null>(null)
  const [routePoints, setRoutePoints] = useState<Coordinates[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)
  const [distance, setDistance] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [geocodingStatus, setGeocodingStatus] = useState<string>("Initializing...")

  // Animation constants
  const SIMULATION_DURATION = 172800 // 48 hours in seconds
  const UPDATE_INTERVAL = 1000 // Update every second
  const INITIAL_DELAY = 8000 // 8 seconds before starting animation

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
      if (!pickupAddress || !deliveryAddress) return

      try {
        setGeocodingStatus("Locating pickup address...")
        const pickupResult = await geocodeAddress(pickupAddress)

        if (!mounted) return

        setGeocodingStatus("Locating delivery address...")
        const deliveryResult = await geocodeAddress(deliveryAddress)

        if (!mounted) return

        if (pickupResult.coordinates && deliveryResult.coordinates) {
          setPickupCoords(pickupResult.coordinates)
          setDeliveryCoords(deliveryResult.coordinates)

          // Calculate distance
          const dist = calculateDistance(pickupResult.coordinates, deliveryResult.coordinates)
          setDistance(dist)

          // Generate route points
          const points = generateRoutePoints(pickupResult.coordinates, deliveryResult.coordinates, 100)
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
  }, [pickupAddress, deliveryAddress])

  // Create custom icons
  const createCustomIcon = useCallback((L: any, type: "pickup" | "delivery" | "package") => {
    const iconConfigs = {
      pickup: {
        html: `<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                   <circle cx="12" cy="10" r="3"/>
                 </svg>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      },
      delivery: {
        html: `<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                   <circle cx="12" cy="10" r="3"/>
                 </svg>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      },
      package: {
        html: `<div style="background: #3b82f6; width: 44px; height: 44px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                 <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                   <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                   <path d="M9 12l2 2 4-4"/>
                 </svg>
               </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
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
          <div style="font-family: system-ui; padding: 10px; min-width: 200px;">
            <strong style="color: #10b981;">📦 Pickup Location</strong><br/>
            <div style="margin: 8px 0; padding: 8px; background: #f0fdf4; border-radius: 6px; border-left: 3px solid #10b981;">
              ${pickupAddress}
            </div>
            <small style="color: #6b7280;">Package origin point</small>
          </div>
        `)

      // Add delivery marker
      leafletLib
        .marker([deliveryCoords.lat, deliveryCoords.lng], {
          icon: createCustomIcon(leafletLib, "delivery"),
        })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 10px; min-width: 200px;">
            <strong style="color: #ef4444;">🎯 Delivery Location</strong><br/>
            <div style="margin: 8px 0; padding: 8px; background: #fef2f2; border-radius: 6px; border-left: 3px solid #ef4444;">
              ${deliveryAddress}
            </div>
            <small style="color: #6b7280;">Package destination</small>
          </div>
        `)

      // Add route polyline
      const polyline = leafletLib
        .polyline(
          routePoints.map((point) => [point.lat, point.lng]),
          {
            color: "#3b82f6",
            weight: 4,
            opacity: 0.7,
            dashArray: currentStatus.toLowerCase() === "delivered" ? "" : "10,5",
          },
        )
        .addTo(map)

      // Add package marker (initially at pickup location)
      const packageMarker = leafletLib
        .marker([pickupCoords.lat, pickupCoords.lng], {
          icon: createCustomIcon(leafletLib, "package"),
        })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 10px; min-width: 200px;">
            <strong style="color: #3b82f6;">📦 Package Location</strong><br/>
            <div style="margin: 8px 0; padding: 8px; background: #eff6ff; border-radius: 6px; border-left: 3px solid #3b82f6;">
              Tracking: ${trackingNumber}<br/>
              Status: ${currentStatus.replace("_", " ").toUpperCase()}<br/>
              Progress: <span id="popup-progress">0%</span>
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
    pickupAddress,
    deliveryAddress,
    currentStatus,
    trackingNumber,
    createCustomIcon,
  ])

  // Start animation when status is in_transit
  useEffect(() => {
    if (currentStatus.toLowerCase() === "in_transit" && routePoints.length > 0 && !isAnimating) {
      // Start animation after 8-second delay
      const delayTimeout = setTimeout(() => {
        setIsAnimating(true)
        startTimeRef.current = Date.now()

        // Set initial progress to 1%
        setCurrentProgress(1)

        // Start the animation interval
        animationIntervalRef.current = setInterval(() => {
          if (!startTimeRef.current) return

          const elapsed = (Date.now() - startTimeRef.current) / 1000 // seconds
          const progress = Math.min(1 + (elapsed / SIMULATION_DURATION) * 99, 100) // 1% to 100%

          setCurrentProgress(progress)

          // Update package position
          if (packageMarkerRef.current && routePoints.length > 0) {
            const routeIndex = Math.floor((progress / 100) * (routePoints.length - 1))
            const currentPoint = routePoints[routeIndex]

            if (currentPoint) {
              packageMarkerRef.current.setLatLng([currentPoint.lat, currentPoint.lng])

              // Update popup content
              const popupElement = document.getElementById("popup-progress")
              if (popupElement) {
                popupElement.textContent = `${progress.toFixed(1)}%`
              }
            }
          }

          // Stop animation when reaching 100%
          if (progress >= 100) {
            if (animationIntervalRef.current) {
              clearInterval(animationIntervalRef.current)
              animationIntervalRef.current = null
            }
            setIsAnimating(false)
          }
        }, UPDATE_INTERVAL)
      }, INITIAL_DELAY)

      return () => {
        clearTimeout(delayTimeout)
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current)
          animationIntervalRef.current = null
        }
      }
    } else if (currentStatus.toLowerCase() === "delivered") {
      // If delivered, set to 100%
      setCurrentProgress(100)
      if (packageMarkerRef.current && deliveryCoords) {
        packageMarkerRef.current.setLatLng([deliveryCoords.lat, deliveryCoords.lng])
      }
    } else if (currentStatus.toLowerCase() === "pending") {
      // If pending, keep at 0%
      setCurrentProgress(0)
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
        animationIntervalRef.current = null
      }
    }
  }, [currentStatus, routePoints, isAnimating, deliveryCoords])

  // Calculate estimated time remaining
  const getEstimatedTimeRemaining = () => {
    if (currentStatus.toLowerCase() !== "in_transit" || !isAnimating) return null

    const remainingProgress = 100 - currentProgress
    const remainingSeconds = (remainingProgress / 100) * SIMULATION_DURATION
    const hours = Math.floor(remainingSeconds / 3600)
    const minutes = Math.floor((remainingSeconds % 3600) / 60)

    return `${hours}h ${minutes}m`
  }

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
      {/* Map Header */}
      <div className="absolute top-0 left-0 z-[1000] bg-white/95 backdrop-blur-sm m-4 px-4 py-3 rounded-lg shadow-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">🚚 Live Package Tracking</h3>
        <p className="text-xs text-slate-600 mt-1">
          {currentStatus === "delivered"
            ? "✅ Package delivered"
            : currentStatus === "in_transit"
              ? "🚛 Package in transit"
              : "📦 Awaiting pickup"}
        </p>
        {distance > 0 && <p className="text-xs text-slate-500 mt-1">Distance: {distance.toFixed(0)} miles</p>}
      </div>

      {/* Animation Status */}
      {currentStatus.toLowerCase() === "in_transit" && !isAnimating && (
        <div className="absolute top-0 right-0 z-[1000] bg-blue-500 text-white m-4 px-3 py-2 rounded-lg shadow-lg">
          <p className="text-xs font-medium">⏱️ Starting in 8 seconds...</p>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="h-96 w-full" />

      {/* Progress Bar and Info */}
      <div className="bg-white p-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-800">Delivery Progress</h4>
          <span className="text-lg font-bold text-blue-600">{currentProgress.toFixed(1)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner mb-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>

        {/* Status Info */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Pickup</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span>Package</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Delivery</span>
            </div>
          </div>

          {getEstimatedTimeRemaining() && (
            <div className="text-right">
              <span className="text-slate-500">ETA: </span>
              <span className="font-medium text-slate-700">{getEstimatedTimeRemaining()}</span>
            </div>
          )}
        </div>

        {/* Animation Status */}
        {currentStatus.toLowerCase() === "in_transit" && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              {isAnimating
                ? "🚛 Package is moving along the route in real-time"
                : "⏳ Package will start moving in 8 seconds"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
