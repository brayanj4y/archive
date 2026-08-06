"use client"

import { useEffect, useState, useRef } from "react"
import { MapPin } from "lucide-react"

interface CityCoordinates {
  x: number
  y: number
  name: string
}

// Helper function to get coordinates for a location
function getCoordinatesForLocation(address: string): CityCoordinates {
  // Extract city name from address
  const cityMatch = address.match(/([A-Za-z\s]+),/)
  const city = cityMatch ? cityMatch[1].trim().toLowerCase() : ""

  // Map of cities to coordinates (normalized to our SVG viewport)
  const cityCoordinates: Record<string, CityCoordinates> = {
    "new york": { x: 800, y: 200, name: "New York" },
    "los angeles": { x: 150, y: 350, name: "Los Angeles" },
    chicago: { x: 600, y: 200, name: "Chicago" },
    houston: { x: 500, y: 450, name: "Houston" },
    phoenix: { x: 250, y: 350, name: "Phoenix" },
    philadelphia: { x: 780, y: 220, name: "Philadelphia" },
    "san antonio": { x: 450, y: 450, name: "San Antonio" },
    "san diego": { x: 150, y: 400, name: "San Diego" },
    dallas: { x: 500, y: 400, name: "Dallas" },
    "san francisco": { x: 100, y: 250, name: "San Francisco" },
    austin: { x: 480, y: 430, name: "Austin" },
    seattle: { x: 150, y: 100, name: "Seattle" },
    denver: { x: 400, y: 250, name: "Denver" },
    boston: { x: 850, y: 150, name: "Boston" },
    miami: { x: 750, y: 500, name: "Miami" },
    atlanta: { x: 650, y: 350, name: "Atlanta" },
    washington: { x: 780, y: 250, name: "Washington DC" },
    portland: { x: 120, y: 120, name: "Portland" },
    "las vegas": { x: 200, y: 300, name: "Las Vegas" },
    detroit: { x: 650, y: 180, name: "Detroit" },
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
    ny: { x: 800, y: 200, name: "New York" },
    ca: { x: 150, y: 300, name: "California" },
    tx: { x: 450, y: 400, name: "Texas" },
    fl: { x: 750, y: 500, name: "Florida" },
    il: { x: 600, y: 250, name: "Illinois" },
    pa: { x: 750, y: 220, name: "Pennsylvania" },
    oh: { x: 700, y: 250, name: "Ohio" },
    ga: { x: 650, y: 350, name: "Georgia" },
    nc: { x: 700, y: 300, name: "North Carolina" },
    mi: { x: 650, y: 200, name: "Michigan" },
  }

  // Try to find state in our map
  if (state && stateCoordinates[state]) {
    return stateCoordinates[state]
  }

  // Extract any location name we can find
  const locationName = city || address.split(",")[0] || "Unknown Location"

  // Default to a random position if nothing found
  return {
    x: 200 + Math.random() * 600,
    y: 150 + Math.random() * 300,
    name: locationName,
  }
}

// Helper function to generate route points between two locations
function generateRoutePoints(start: CityCoordinates, end: CityCoordinates, numPoints: number): CityCoordinates[] {
  const points: CityCoordinates[] = []

  for (let i = 0; i <= numPoints; i++) {
    // Linear interpolation between start and end
    const fraction = i / numPoints

    // Add some randomness to make the route look more realistic
    const randomX = (Math.random() - 0.5) * 40
    const randomY = (Math.random() - 0.5) * 40

    // Only add randomness to middle points
    const jitter = i > 0 && i < numPoints ? { x: randomX, y: randomY } : { x: 0, y: 0 }

    points.push({
      x: start.x + (end.x - start.x) * fraction + jitter.x,
      y: start.y + (end.y - start.y) * fraction + jitter.y,
      name: `Point ${i}`,
    })
  }

  return points
}

interface CustomShipmentMapProps {
  pickupAddress: string
  deliveryAddress: string
  currentStatus: string
  className?: string
}

export default function CustomShipmentMap({
  pickupAddress,
  deliveryAddress,
  currentStatus,
  className = "",
}: CustomShipmentMapProps) {
  const [originCoords, setOriginCoords] = useState<CityCoordinates | null>(null)
  const [destinationCoords, setDestinationCoords] = useState<CityCoordinates | null>(null)
  const [routePoints, setRoutePoints] = useState<CityCoordinates[]>([])
  const [currentPosition, setCurrentPosition] = useState<CityCoordinates | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const animationRef = useRef<number | null>(null)
  const shakeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate coordinates from addresses
  useEffect(() => {
    try {
      console.log("CustomShipmentMap: Processing addresses", { pickupAddress, deliveryAddress })

      const origin = getCoordinatesForLocation(pickupAddress)
      const destination = getCoordinatesForLocation(deliveryAddress)

      console.log("CustomShipmentMap: Coordinates calculated", { origin, destination })

      setOriginCoords(origin)
      setDestinationCoords(destination)

      // Generate route with some randomness
      const points = generateRoutePoints(origin, destination, 6)
      setRoutePoints(points)

      // Set initial position to origin
      setCurrentPosition(origin)
    } catch (error) {
      console.error("Error in CustomShipmentMap address processing:", error)
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
    if (!routePoints.length) return

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

    // Find the position along the route
    const pointIndex = Math.min(Math.floor(progress * routePoints.length), routePoints.length - 1)
    setCurrentPosition(routePoints[pointIndex])
  }, [currentStatus, routePoints])

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
            <MapPin className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Map Unavailable</h3>
          <p className="text-slate-600">Unable to display the shipment route map at this time.</p>
        </div>
      </div>
    )
  }

  // SVG viewBox dimensions
  const viewBoxWidth = 1000
  const viewBoxHeight = 600

  // Calculate package position with shake effect if needed
  const packageX = currentPosition ? currentPosition.x + (isShaking ? (Math.random() - 0.5) * 10 : 0) : originCoords.x
  const packageY = currentPosition ? currentPosition.y + (isShaking ? (Math.random() - 0.5) * 10 : 0) : originCoords.y

  // Generate SVG path for the route
  const pathData =
    routePoints.length > 0
      ? `M ${routePoints[0].x},${routePoints[0].y} ` +
        routePoints
          .slice(1)
          .map((point) => `L ${point.x},${point.y}`)
          .join(" ")
      : ""

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-md ${className}`}>
      <div className="absolute top-0 left-0 z-10 bg-white/80 backdrop-blur-sm m-4 px-3 py-2 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">Shipment Route</h3>
        <p className="text-xs text-slate-600">
          {currentStatus === "delivered" ? "Package delivered successfully" : "Estimated route visualization"}
        </p>
      </div>

      <div className="relative" style={{ height: "400px", width: "100%" }}>
        {/* US Map Background */}
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          <svg
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-full"
            style={{ maxHeight: "400px" }}
          >
            {/* US Map Outline (simplified) */}
            <path
              d="M100,100 L900,100 L900,500 L100,500 Z"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              opacity="0.5"
            />

            {/* Background Grid */}
            <g opacity="0.2">
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 60}
                  x2={viewBoxWidth}
                  y2={i * 60}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 60}
                  y1="0"
                  x2={i * 60}
                  y2={viewBoxHeight}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* Major Cities (dots) */}
            <g>
              <circle cx="800" cy="200" r="3" fill="#94a3b8" />
              <circle cx="150" cy="350" r="3" fill="#94a3b8" />
              <circle cx="600" cy="200" r="3" fill="#94a3b8" />
              <circle cx="500" cy="450" r="3" fill="#94a3b8" />
              <circle cx="150" cy="100" r="3" fill="#94a3b8" />
              <circle cx="750" cy="500" r="3" fill="#94a3b8" />
              <circle cx="100" cy="250" r="3" fill="#94a3b8" />
              <circle cx="400" cy="250" r="3" fill="#94a3b8" />
              <circle cx="650" cy="350" r="3" fill="#94a3b8" />
            </g>

            {/* Route Path */}
            <path
              d={pathData}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
              strokeDasharray={currentStatus.toLowerCase() === "in_transit" ? "none" : "10,10"}
            />

            {/* Origin Marker */}
            <g transform={`translate(${originCoords.x - 16}, ${originCoords.y - 32})`}>
              <circle cx="16" cy="16" r="16" fill="#22c55e" />
              <path
                d="M16 8c-3.31 0-6 2.69-6 6 0 4.5 6 11 6 11s6-6.5 6-11c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="white"
              />
              <text
                x="16"
                y="40"
                textAnchor="middle"
                fill="#22c55e"
                fontWeight="bold"
                fontSize="12"
                className="text-xs"
              >
                {originCoords.name}
              </text>
            </g>

            {/* Destination Marker */}
            <g transform={`translate(${destinationCoords.x - 16}, ${destinationCoords.y - 32})`}>
              <circle cx="16" cy="16" r="16" fill="#ef4444" />
              <path
                d="M16 8c-3.31 0-6 2.69-6 6 0 4.5 6 11 6 11s6-6.5 6-11c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="white"
              />
              <text
                x="16"
                y="40"
                textAnchor="middle"
                fill="#ef4444"
                fontWeight="bold"
                fontSize="12"
                className="text-xs"
              >
                {destinationCoords.name}
              </text>
            </g>

            {/* Package Marker */}
            {currentPosition && (
              <g transform={`translate(${packageX - 20}, ${packageY - 20})`}>
                <circle cx="20" cy="20" r="20" fill="#3b82f6" />
                <path
                  d="M26 14v-4c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2v4h-4v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-10h-4zm-10-4h8v4h-8v-4zm10 14h-16v-8h4v2h2v-2h8v2h2v-2h4v8z"
                  fill="white"
                />
              </g>
            )}
          </svg>
        </div>
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
