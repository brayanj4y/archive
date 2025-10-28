"use client"

import { useEffect, useState, useRef } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Define types for coordinates
interface CityCoordinates {
  lat: number
  lng: number
}

// Helper function to get coordinates for a location
function getCoordinatesForLocation(address: string): CityCoordinates {
  // Extract city name from address
  const cityMatch = address.match(/([A-Za-z\s]+),/)
  const city = cityMatch ? cityMatch[1].trim().toLowerCase() : ""

  // Map of cities to coordinates
  const cityCoordinates: Record<string, CityCoordinates> = {
    "new york": { lat: 40.7128, lng: -74.006 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    chicago: { lat: 41.8781, lng: -87.6298 },
    houston: { lat: 29.7604, lng: -95.3698 },
    phoenix: { lat: 33.4484, lng: -112.074 },
    philadelphia: { lat: 39.9526, lng: -75.1652 },
    "san antonio": { lat: 29.4241, lng: -98.4936 },
    "san diego": { lat: 32.7157, lng: -117.1611 },
    dallas: { lat: 32.7767, lng: -96.797 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    austin: { lat: 30.2672, lng: -97.7431 },
    seattle: { lat: 47.6062, lng: -122.3321 },
    denver: { lat: 39.7392, lng: -104.9903 },
    boston: { lat: 42.3601, lng: -71.0589 },
    miami: { lat: 25.7617, lng: -80.1918 },
    atlanta: { lat: 33.749, lng: -84.388 },
    washington: { lat: 38.9072, lng: -77.0369 },
    portland: { lat: 45.5051, lng: -122.675 },
    "las vegas": { lat: 36.1699, lng: -115.1398 },
    detroit: { lat: 42.3314, lng: -83.0458 },
  }

  // Try to find city in our map
  if (city && cityCoordinates[city]) {
    return cityCoordinates[city]
  }

  // If city not found, try to extract state
  const stateMatch = address.match(/([A-Z]{2})/)
  const state = stateMatch ? stateMatch[1].toLowerCase() : ""

  // Map of states to coordinates (center points)
  const stateCoordinates: Record<string, CityCoordinates> = {
    ny: { lat: 42.1657, lng: -74.9481 },
    ca: { lat: 36.7783, lng: -119.4179 },
    tx: { lat: 31.9686, lng: -99.9018 },
    fl: { lat: 27.6648, lng: -81.5158 },
    il: { lat: 40.6331, lng: -89.3985 },
    pa: { lat: 41.2033, lng: -77.1945 },
    oh: { lat: 40.4173, lng: -82.9071 },
    ga: { lat: 33.0406, lng: -83.6431 },
    nc: { lat: 35.7596, lng: -79.0193 },
    mi: { lat: 44.3148, lng: -85.6024 },
  }

  // Try to find state in our map
  if (state && stateCoordinates[state]) {
    return stateCoordinates[state]
  }

  // Default to US center if nothing found
  return { lat: 39.8283, lng: -98.5795 }
}

// Helper function to generate route points between two locations
function generateRoutePoints(start: CityCoordinates, end: CityCoordinates, numPoints: number): CityCoordinates[] {
  const points: CityCoordinates[] = []

  for (let i = 0; i <= numPoints; i++) {
    // Linear interpolation between start and end
    const fraction = i / numPoints

    // Add some randomness to make the route look more realistic
    const randomLat = (Math.random() - 0.5) * 0.5
    const randomLng = (Math.random() - 0.5) * 0.5

    // Only add randomness to middle points
    const jitter = i > 0 && i < numPoints ? { lat: randomLat, lng: randomLng } : { lat: 0, lng: 0 }

    points.push({
      lat: start.lat + (end.lat - start.lat) * fraction + jitter.lat,
      lng: start.lng + (end.lng - start.lng) * fraction + jitter.lng,
    })
  }

  return points
}

// Create custom icons
const createPackageIcon = () =>
  new L.DivIcon({
    html: `<div class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>`,
    className: "package-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

const createLocationIcon = (color: string) =>
  new L.DivIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 bg-${color}-600 rounded-full shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>`,
    className: `location-icon-${color}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })

interface ShipmentMapProps {
  pickupAddress: string
  deliveryAddress: string
  currentStatus: string
  className?: string
}

export default function ShipmentMapClient({
  pickupAddress,
  deliveryAddress,
  currentStatus,
  className = "",
}: ShipmentMapProps) {
  const [originCoords, setOriginCoords] = useState<CityCoordinates | null>(null)
  const [destinationCoords, setDestinationCoords] = useState<CityCoordinates | null>(null)
  const [routePoints, setRoutePoints] = useState<CityCoordinates[]>([])
  const [currentPosition, setCurrentPosition] = useState<CityCoordinates | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const animationRef = useRef<number | null>(null)
  const shakeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fix for Leaflet marker icons in Next.js
  useEffect(() => {
    // Fix Leaflet icons
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  // Calculate coordinates from addresses
  useEffect(() => {
    try {
      console.log("ShipmentMap: Processing addresses", { pickupAddress, deliveryAddress })

      const origin = getCoordinatesForLocation(pickupAddress)
      const destination = getCoordinatesForLocation(deliveryAddress)

      console.log("ShipmentMap: Coordinates calculated", { origin, destination })

      setOriginCoords(origin)
      setDestinationCoords(destination)

      // Generate route with some randomness
      const points = generateRoutePoints(origin, destination, 10)
      setRoutePoints(points)

      // Set initial position to origin
      setCurrentPosition(origin)
    } catch (error) {
      console.error("Error in ShipmentMap address processing:", error)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current)
      }
    }
  }, [pickupAddress, deliveryAddress])

  // Determine animation progress based on status
  useEffect(() => {
    let progress = 0

    switch (currentStatus.toLowerCase()) {
      case "pending":
        progress = 0
        break
      case "on_hold":
        progress = 0.2
        break
      case "in_transit":
        progress = 0.6
        break
      case "delivered":
        progress = 1
        break
      default:
        progress = 0
    }

    setAnimationProgress(progress)
  }, [currentStatus])

  // Animate package movement
  useEffect(() => {
    if (!originCoords || !destinationCoords || !routePoints.length) return

    let startTime: number | null = null
    const duration = 2000 // 2 seconds for the animation

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Find the current position along the route
      const targetProgress = animationProgress
      const currentProgress = progress * targetProgress

      if (currentProgress < 1) {
        const pointIndex = Math.min(Math.floor(currentProgress * routePoints.length), routePoints.length - 1)

        setCurrentPosition(routePoints[pointIndex])
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // If delivered, set to final position
        if (targetProgress >= 1) {
          setCurrentPosition(destinationCoords)
        } else {
          // Otherwise, set to the position based on status
          const pointIndex = Math.min(Math.floor(targetProgress * routePoints.length), routePoints.length - 1)
          setCurrentPosition(routePoints[pointIndex])
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [originCoords, destinationCoords, routePoints, animationProgress])

  // Set up shaking effect every 6 seconds
  useEffect(() => {
    if (currentStatus.toLowerCase() === "in_transit" && currentPosition) {
      shakeIntervalRef.current = setInterval(() => {
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 1000) // Shake for 1 second
      }, 6000) // Every 6 seconds
    }

    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current)
      }
    }
  }, [currentStatus, currentPosition])

  if (!originCoords || !destinationCoords) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-md ${className} p-6 bg-slate-50`}
      >
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Map Unavailable</h3>
          <p className="text-slate-600">Unable to display the shipment route map at this time.</p>
        </div>
      </div>
    )
  }

  // Calculate map bounds to fit both origin and destination
  const bounds = L.latLngBounds([originCoords.lat, originCoords.lng], [destinationCoords.lat, destinationCoords.lng])

  // Add some padding to the bounds
  bounds.pad(0.2)

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
      <div className="absolute top-0 left-0 z-10 bg-white/80 backdrop-blur-sm m-4 px-3 py-2 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">Shipment Route</h3>
        <p className="text-xs text-slate-600">
          {currentStatus === "delivered" ? "Package delivered successfully" : "Estimated route visualization"}
        </p>
      </div>

      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
          bounds={bounds}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          attributionControl={true}
          whenReady={() => setMapLoaded(true)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Origin Marker */}
          <Marker position={[originCoords.lat, originCoords.lng]} icon={createLocationIcon("green")}>
            <Popup>
              <div className="text-sm">
                <strong>Pickup Location</strong>
                <br />
                {pickupAddress}
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={createLocationIcon("red")}>
            <Popup>
              <div className="text-sm">
                <strong>Delivery Location</strong>
                <br />
                {deliveryAddress}
              </div>
            </Popup>
          </Marker>

          {/* Route Line */}
          <Polyline
            positions={routePoints.map((point) => [point.lat, point.lng])}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
            dashArray={currentStatus.toLowerCase() === "in_transit" ? "" : "5,10"}
          />

          {/* Package Marker */}
          {currentPosition && (
            <Marker
              position={[
                currentPosition.lat + (isShaking ? (Math.random() - 0.5) * 0.005 : 0),
                currentPosition.lng + (isShaking ? (Math.random() - 0.5) * 0.005 : 0),
              ]}
              icon={createPackageIcon()}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Package</strong>
                  <br />
                  Status: {currentStatus.replace("_", " ").toUpperCase()}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white p-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-1"></div>
            <span>Origin</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
            <span>Package</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-1"></div>
            <span>Destination</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-1 bg-blue-500 mr-1"></div>
            <span>Route</span>
          </div>
        </div>
      </div>
    </div>
  )
}
