"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { getCoordinatesForLocation, generateRoutePoints, type CityCoordinates } from "@/lib/utils/geo-mapping"

// Dynamic import for Leaflet to avoid SSR issues
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

interface EnhancedShipmentMapProps {
  pickupAddress: string
  deliveryAddress: string
  currentStatus: string
  statusUpdates?: Array<{
    id: string
    status: string
    location?: string
    description?: string
    created_at: string
  }>
  className?: string
}

export default function EnhancedShipmentMap({
  pickupAddress,
  deliveryAddress,
  currentStatus,
  statusUpdates = [],
  className = "",
}: EnhancedShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const packageMarkerRef = useRef<any>(null)
  const routePolylineRef = useRef<any>(null)
  const animationRef = useRef<number | null>(null)
  const shakeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leafletLib, setLeafletLib] = useState<any>(null)
  const [routePoints, setRoutePoints] = useState<CityCoordinates[]>([])
  const [originCoords, setOriginCoords] = useState<CityCoordinates | null>(null)
  const [destinationCoords, setDestinationCoords] = useState<CityCoordinates | null>(null)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [isShaking, setIsShaking] = useState(false)

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
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initLeaflet()

    return () => {
      mounted = false
    }
  }, [])

  // Calculate coordinates and route
  useEffect(() => {
    if (!pickupAddress || !deliveryAddress) return

    try {
      const origin = getCoordinatesForLocation(pickupAddress)
      const destination = getCoordinatesForLocation(deliveryAddress)
      const points = generateRoutePoints(origin, destination, 20) // More points for smoother animation

      setOriginCoords(origin)
      setDestinationCoords(destination)
      setRoutePoints(points)
    } catch (error) {
      console.error("Error calculating coordinates:", error)
    }
  }, [pickupAddress, deliveryAddress])

  // Calculate progress based on status and timeline
  const calculateProgress = useCallback(() => {
    if (!statusUpdates.length) {
      // Fallback to status-based progress
      switch (currentStatus.toLowerCase()) {
        case "pending":
          return 0
        case "on_hold":
          return 0.2
        case "in_transit":
          return 0.6
        case "delivered":
          return 1
        default:
          return 0
      }
    }

    // Calculate based on timeline
    const totalUpdates = statusUpdates.length
    const currentIndex = statusUpdates.findIndex(
      (update) => update.status.toLowerCase() === currentStatus.toLowerCase(),
    )

    if (currentIndex === -1) return 0

    return Math.min((currentIndex + 1) / totalUpdates, 1)
  }, [currentStatus, statusUpdates])

  // Create custom icons
  const createCustomIcon = useCallback(
    (L: any, type: "origin" | "destination" | "package") => {
      const iconConfigs = {
        origin: {
          html: `<div style="background: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                   <circle cx="12" cy="10" r="3"/>
                 </svg>
               </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        },
        destination: {
          html: `<div style="background: #ef4444; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                   <circle cx="12" cy="10" r="3"/>
                 </svg>
               </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        },
        package: {
          html: `<div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; ${isShaking ? "animation: shake 0.5s ease-in-out infinite;" : ""}">
                 <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                   <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                   <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                   <line x1="12" y1="22.08" x2="12" y2="12"/>
                 </svg>
               </div>
               <style>
                 @keyframes shake {
                   0%, 100% { transform: translate(0, 0) rotate(0deg); }
                   25% { transform: translate(1px, 1px) rotate(1deg); }
                   50% { transform: translate(-1px, 1px) rotate(-1deg); }
                   75% { transform: translate(1px, -1px) rotate(1deg); }
                 }
               </style>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        },
      }

      const config = iconConfigs[type]
      return L.divIcon({
        html: config.html,
        className: `custom-${type}-icon`,
        iconSize: config.iconSize,
        iconAnchor: config.iconAnchor,
      })
    },
    [isShaking],
  )

  // Initialize map
  useEffect(() => {
    if (!leafletLib || !mapRef.current || !originCoords || !destinationCoords || !routePoints.length) {
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
        [originCoords.lat, originCoords.lng],
        [destinationCoords.lat, destinationCoords.lng],
      ])
      map.fitBounds(bounds, { padding: [50, 50] })

      // Add origin marker
      leafletLib
        .marker([originCoords.lat, originCoords.lng], {
          icon: createCustomIcon(leafletLib, "origin"),
        })
        .addTo(map)
        .bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <strong>Pickup Location</strong><br/>
          ${pickupAddress}
        </div>
      `)

      // Add destination marker
      leafletLib
        .marker([destinationCoords.lat, destinationCoords.lng], {
          icon: createCustomIcon(leafletLib, "destination"),
        })
        .addTo(map)
        .bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <strong>Delivery Location</strong><br/>
          ${deliveryAddress}
        </div>
      `)

      // Add route polyline
      const polyline = leafletLib
        .polyline(
          routePoints.map((point) => [point.lat, point.lng]),
          {
            color: "#3b82f6",
            weight: 4,
            opacity: 0.8,
            dashArray: currentStatus.toLowerCase() === "delivered" ? "" : "10,5",
          },
        )
        .addTo(map)

      // Add package marker
      const packageMarker = leafletLib
        .marker([originCoords.lat, originCoords.lng], {
          icon: createCustomIcon(leafletLib, "package"),
        })
        .addTo(map)
        .bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <strong>Package Location</strong><br/>
          Status: ${currentStatus.replace("_", " ").toUpperCase()}
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
    originCoords,
    destinationCoords,
    routePoints,
    pickupAddress,
    deliveryAddress,
    currentStatus,
    createCustomIcon,
  ])

  // Animate package movement
  useEffect(() => {
    if (!packageMarkerRef.current || !routePoints.length) return

    const targetProgress = calculateProgress()
    setCurrentProgress(targetProgress)

    let startTime: number | null = null
    const duration = 2000 // 2 seconds for smooth animation
    const startProgress = currentProgress

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const animationProgress = Math.min(elapsed / duration, 1)

      // Smooth easing function
      const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
      const easedProgress = easeInOutCubic(animationProgress)

      const currentAnimProgress = startProgress + (targetProgress - startProgress) * easedProgress
      const pointIndex = Math.min(Math.floor(currentAnimProgress * (routePoints.length - 1)), routePoints.length - 1)

      const currentPoint = routePoints[pointIndex]
      if (currentPoint && packageMarkerRef.current) {
        packageMarkerRef.current.setLatLng([currentPoint.lat, currentPoint.lng])
      }

      if (animationProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [routePoints, calculateProgress, currentProgress])

  // Shaking effect for in-transit packages
  useEffect(() => {
    if (currentStatus.toLowerCase() === "in_transit" && packageMarkerRef.current) {
      const startShaking = () => {
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 1000) // Shake for 1 second
      }

      // Start immediately
      startShaking()

      // Then every 8 seconds
      shakeIntervalRef.current = setInterval(startShaking, 8000)
    }

    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current)
      }
      setIsShaking(false)
    }
  }, [currentStatus])

  // Update package marker icon when shaking state changes
  useEffect(() => {
    if (packageMarkerRef.current && leafletLib) {
      packageMarkerRef.current.setIcon(createCustomIcon(leafletLib, "package"))
    }
  }, [isShaking, leafletLib, createCustomIcon])

  if (isLoading) {
    return (
      <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
        <div className="h-96 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading map...</p>
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
      <div className="absolute top-0 left-0 z-[1000] bg-white/90 backdrop-blur-sm m-4 px-4 py-2 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">Live Tracking</h3>
        <p className="text-xs text-slate-600">
          {currentStatus === "delivered" ? "Package delivered" : "Real-time location"}
        </p>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="h-96 w-full" />

      {/* Map Legend */}
      <div className="bg-white p-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Pickup</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
              <span>Package</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Delivery</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">Progress: {Math.round(calculateProgress() * 100)}%</div>
        </div>
      </div>
    </div>
  )
}
