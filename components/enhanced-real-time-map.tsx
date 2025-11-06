"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { geocodeAddress, calculateDistance, generateRoutePoints, type Coordinates } from "@/lib/services/geocoding"
import { calculateSimulationState, interpolatePosition, getPhaseDisplay, UPDATE_INTERVAL } from "@/lib/services/simulation"
import type { Shipment, SimulationState } from "@/lib/types"

const loadLeaflet = async () => {
  if (typeof window === "undefined") return null
  try {
    const L = await import("leaflet")
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
    return L
  } catch {
    return null
  }
}

interface RealTimeMapProps {
  shipment: Shipment
  className?: string
}

export default function RealTimeMap({ shipment, className = "" }: RealTimeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const packageMarkerRef = useRef<any>(null)
  const routePolylineRef = useRef<any>(null)
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLeaflet().then((L) => {
      if (!L) setError("Failed to load map library")
      else setLeafletLib(L)
    })
  }, [])

  useEffect(() => {
    if (!shipment.pickup_address || !shipment.delivery_address) return
    const fetchCoords = async () => {
      try {
        const pickup = await geocodeAddress(shipment.pickup_address)
        const delivery = await geocodeAddress(shipment.delivery_address)
        if (pickup.coordinates && delivery.coordinates) {
          setPickupCoords(pickup.coordinates)
          setDeliveryCoords(delivery.coordinates)
          setDistance(calculateDistance(pickup.coordinates, delivery.coordinates))
          setRoutePoints(generateRoutePoints(pickup.coordinates, delivery.coordinates, 200))
          setIsLoading(false)
        } else setError("Invalid address data")
      } catch {
        setError("Failed to fetch coordinates")
      }
    }
    fetchCoords()
  }, [shipment])

  const createIcon = useCallback((L: any, color: string) => {
    return L.divIcon({
      html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;"></div>`,
      className: "",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    })
  }, [])

  useEffect(() => {
    if (!leafletLib || !mapRef.current || !pickupCoords || !deliveryCoords) return
    const L = leafletLib
    const map = L.map(mapRef.current)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
    map.fitBounds([
      [pickupCoords.lat, pickupCoords.lng],
      [deliveryCoords.lat, deliveryCoords.lng],
    ])

    L.marker([pickupCoords.lat, pickupCoords.lng], { icon: createIcon(L, "#666") }).addTo(map)
    L.marker([deliveryCoords.lat, deliveryCoords.lng], { icon: createIcon(L, "#000") }).addTo(map)

    const polyline = L.polyline(
      routePoints.map((p) => [p.lat, p.lng]),
      { color: "#444", weight: 3 },
    ).addTo(map)

    const packageMarker = L.marker([pickupCoords.lat, pickupCoords.lng], {
      icon: createIcon(L, "#007aff"),
    }).addTo(map)

    mapInstanceRef.current = map
    packageMarkerRef.current = packageMarker
    routePolylineRef.current = polyline

    return () => map.remove()
  }, [leafletLib, pickupCoords, deliveryCoords, routePoints, createIcon])

  useEffect(() => {
    if (!pickupCoords || !deliveryCoords || !routePoints.length) return
    const update = () => {
      const state = calculateSimulationState(shipment)
      setSimulationState(state)
      if (packageMarkerRef.current) {
        const pos = interpolatePosition(
          pickupCoords.lat,
          pickupCoords.lng,
          deliveryCoords.lat,
          deliveryCoords.lng,
          state.progress,
        )
        packageMarkerRef.current.setLatLng([pos.lat, pos.lng])
      }
    }
    update()
    simulationIntervalRef.current = setInterval(update, UPDATE_INTERVAL)
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current)
    }
  }, [shipment, pickupCoords, deliveryCoords, routePoints])

  if (isLoading) return <div className="h-96 flex items-center justify-center text-gray-500">Loading map...</div>
  if (error) return <div className="h-96 flex items-center justify-center text-gray-500">{error}</div>

  return (
    <div className={`border rounded ${className}`}>
      <div ref={mapRef} className="h-96 w-full" />
      <div className="p-4 text-sm border-t">
        <div className="flex justify-between mb-2">
          <span>Phase: {getPhaseDisplay(simulationState.currentPhase)}</span>
          <span>{simulationState.progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div className="bg-gray-700 h-2 rounded" style={{ width: `${simulationState.progress}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Distance: {distance.toFixed(1)} mi</span>
          {simulationState.isActive && <span>Active</span>}
          {simulationState.isPaused && <span>Paused</span>}
        </div>
      </div>
    </div>
  )
}
