export interface Coordinates {
  lat: number
  lng: number
}

export interface GeocodingResult {
  coordinates: Coordinates | null
  address: string
  error?: string
}

// Cache for geocoded addresses to avoid repeated API calls
const geocodingCache = new Map<string, Coordinates>()

/**
 * Geocode an address using Nominatim (OpenStreetMap) API
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!address || typeof address !== "string") {
    return {
      coordinates: null,
      address,
      error: "Invalid address provided",
    }
  }

  // Check cache first
  const cacheKey = address.toLowerCase().trim()
  if (geocodingCache.has(cacheKey)) {
    return {
      coordinates: geocodingCache.get(cacheKey)!,
      address,
    }
  }

  try {
    // Use Nominatim API with proper headers and rate limiting
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`,
      {
        headers: {
          "User-Agent": "ShipTrack-Pro/1.0 (tracking@shiptrackpro.com)",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      const coordinates: Coordinates = {
        lat: Number.parseFloat(result.lat),
        lng: Number.parseFloat(result.lon),
      }

      // Cache the result
      geocodingCache.set(cacheKey, coordinates)

      return {
        coordinates,
        address,
      }
    } else {
      // No results found, try to extract city/state and use fallback
      const fallbackCoords = getFallbackCoordinates(address)
      if (fallbackCoords) {
        geocodingCache.set(cacheKey, fallbackCoords)
        return {
          coordinates: fallbackCoords,
          address,
          error: "Used approximate location",
        }
      }

      return {
        coordinates: null,
        address,
        error: "Address not found",
      }
    }
  } catch (error) {
    console.error("Geocoding error:", error)

    // Try fallback coordinates
    const fallbackCoords = getFallbackCoordinates(address)
    if (fallbackCoords) {
      return {
        coordinates: fallbackCoords,
        address,
        error: "Used approximate location due to API error",
      }
    }

    return {
      coordinates: null,
      address,
      error: error instanceof Error ? error.message : "Geocoding failed",
    }
  }
}

/**
 * Get fallback coordinates based on common US cities
 */
function getFallbackCoordinates(address: string): Coordinates | null {
  const cityStatePatterns = [
    // Major US cities with coordinates
    { pattern: /new york|nyc|ny/i, coords: { lat: 40.7128, lng: -74.006 } },
    { pattern: /los angeles|la|california/i, coords: { lat: 34.0522, lng: -118.2437 } },
    { pattern: /chicago|il|illinois/i, coords: { lat: 41.8781, lng: -87.6298 } },
    { pattern: /houston|tx|texas/i, coords: { lat: 29.7604, lng: -95.3698 } },
    { pattern: /phoenix|az|arizona/i, coords: { lat: 33.4484, lng: -112.074 } },
    { pattern: /philadelphia|pa|pennsylvania/i, coords: { lat: 39.9526, lng: -75.1652 } },
    { pattern: /san antonio|texas/i, coords: { lat: 29.4241, lng: -98.4936 } },
    { pattern: /san diego|california/i, coords: { lat: 32.7157, lng: -117.1611 } },
    { pattern: /dallas|texas/i, coords: { lat: 32.7767, lng: -96.797 } },
    { pattern: /san jose|california/i, coords: { lat: 37.3382, lng: -121.8863 } },
    { pattern: /austin|texas/i, coords: { lat: 30.2672, lng: -97.7431 } },
    { pattern: /jacksonville|fl|florida/i, coords: { lat: 30.3322, lng: -81.6557 } },
    { pattern: /san francisco|california/i, coords: { lat: 37.7749, lng: -122.4194 } },
    { pattern: /columbus|oh|ohio/i, coords: { lat: 39.9612, lng: -82.9988 } },
    { pattern: /charlotte|nc|north carolina/i, coords: { lat: 35.2271, lng: -80.8431 } },
    { pattern: /indianapolis|in|indiana/i, coords: { lat: 39.7684, lng: -86.1581 } },
    { pattern: /seattle|wa|washington/i, coords: { lat: 47.6062, lng: -122.3321 } },
    { pattern: /denver|co|colorado/i, coords: { lat: 39.7392, lng: -104.9903 } },
    { pattern: /washington|dc/i, coords: { lat: 38.9072, lng: -77.0369 } },
    { pattern: /boston|ma|massachusetts/i, coords: { lat: 42.3601, lng: -71.0589 } },
    { pattern: /miami|fl|florida/i, coords: { lat: 25.7617, lng: -80.1918 } },
    { pattern: /atlanta|ga|georgia/i, coords: { lat: 33.749, lng: -84.388 } },
  ]

  for (const { pattern, coords } of cityStatePatterns) {
    if (pattern.test(address)) {
      return coords
    }
  }

  // Default to center of US if no match
  return { lat: 39.8283, lng: -98.5795 }
}

/**
 * Calculate distance between two coordinates (in miles)
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Generate route points between two coordinates
 */
export function generateRoutePoints(start: Coordinates, end: Coordinates, numPoints = 50): Coordinates[] {
  const points: Coordinates[] = []

  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints

    // Add some curve to make the route more realistic
    const curveFactor = Math.sin(fraction * Math.PI) * 0.1

    points.push({
      lat: start.lat + (end.lat - start.lat) * fraction + (Math.random() - 0.5) * curveFactor,
      lng: start.lng + (end.lng - start.lng) * fraction + (Math.random() - 0.5) * curveFactor,
    })
  }

  return points
}
