// Simple mapping of cities to coordinates
export interface CityCoordinates {
  lat: number
  lng: number
}

export const cityCoordinates: Record<string, CityCoordinates> = {
  // United States
  "New York, NY": { lat: 40.7128, lng: -74.006 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Houston, TX": { lat: 29.7604, lng: -95.3698 },
  "Phoenix, AZ": { lat: 33.4484, lng: -112.074 },
  "Philadelphia, PA": { lat: 39.9526, lng: -75.1652 },
  "San Antonio, TX": { lat: 29.4241, lng: -98.4936 },
  "San Diego, CA": { lat: 32.7157, lng: -117.1611 },
  "Dallas, TX": { lat: 32.7767, lng: -96.797 },
  "San Jose, CA": { lat: 37.3382, lng: -121.8863 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "Jacksonville, FL": { lat: 30.3322, lng: -81.6557 },
  "Fort Worth, TX": { lat: 32.7555, lng: -97.3308 },
  "Columbus, OH": { lat: 39.9612, lng: -82.9988 },
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "Charlotte, NC": { lat: 35.2271, lng: -80.8431 },
  "Indianapolis, IN": { lat: 39.7684, lng: -86.1581 },
  "Seattle, WA": { lat: 47.6062, lng: -122.3321 },
  "Denver, CO": { lat: 39.7392, lng: -104.9903 },
  "Washington, DC": { lat: 38.9072, lng: -77.0369 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
  "El Paso, TX": { lat: 31.7619, lng: -106.485 },
  "Nashville, TN": { lat: 36.1627, lng: -86.7816 },
  "Detroit, MI": { lat: 42.3314, lng: -83.0458 },
  "Oklahoma City, OK": { lat: 35.4676, lng: -97.5164 },
  "Portland, OR": { lat: 45.5051, lng: -122.675 },
  "Las Vegas, NV": { lat: 36.1699, lng: -115.1398 },
  "Memphis, TN": { lat: 35.1495, lng: -90.049 },
  "Louisville, KY": { lat: 38.2527, lng: -85.7585 },
  "Baltimore, MD": { lat: 39.2904, lng: -76.6122 },
  "Milwaukee, WI": { lat: 43.0389, lng: -87.9065 },
  "Albuquerque, NM": { lat: 35.0844, lng: -106.6504 },
  "Tucson, AZ": { lat: 32.2226, lng: -110.9747 },
  "Fresno, CA": { lat: 36.7378, lng: -119.7871 },
  "Sacramento, CA": { lat: 38.5816, lng: -121.4944 },
  "Kansas City, MO": { lat: 39.0997, lng: -94.5786 },
  "Mesa, AZ": { lat: 33.4152, lng: -111.8315 },
  "Atlanta, GA": { lat: 33.749, lng: -84.388 },
  "Omaha, NE": { lat: 41.2565, lng: -95.9345 },
  "Colorado Springs, CO": { lat: 38.8339, lng: -104.8214 },
  "Raleigh, NC": { lat: 35.7796, lng: -78.6382 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Tampa, FL": { lat: 27.9506, lng: -82.4572 },
  "Minneapolis, MN": { lat: 44.9778, lng: -93.265 },
  "New Orleans, LA": { lat: 29.9511, lng: -90.0715 },
  "Cleveland, OH": { lat: 41.4993, lng: -81.6944 },
  "St. Louis, MO": { lat: 38.627, lng: -90.1994 },
  "Pittsburgh, PA": { lat: 40.4406, lng: -79.9959 },
  "Cincinnati, OH": { lat: 39.1031, lng: -84.512 },

  // Generic fallbacks
  "Unknown Location": { lat: 0, lng: 0 },
}

/**
 * Extracts city and state from an address string
 * @param address Full address string
 * @returns City and state in "City, ST" format or null if not found
 */
export function extractCityState(address: string): string | null {
  // Try to match patterns like "City, ST" or "City, State"
  const cityStateRegex = /([A-Za-z\s.]+),\s*([A-Z]{2}|[A-Za-z\s]+)(?:\s+\d{5})?/
  const match = address.match(cityStateRegex)

  if (match && match[1] && match[2]) {
    return `${match[1].trim()}, ${match[2].trim()}`
  }

  // Try to extract just the city name if the above pattern fails
  const cityRegex = /([A-Za-z\s.]+)(?:\s+\d{5})/
  const cityMatch = address.match(cityRegex)

  if (cityMatch && cityMatch[1]) {
    return cityMatch[1].trim()
  }

  return null
}

/**
 * Gets coordinates for a location string
 * @param location Location string (address, city, etc.)
 * @returns Coordinates or default coordinates if not found
 */
export function getCoordinatesForLocation(location: string): CityCoordinates {
  if (!location || typeof location !== "string") {
    console.warn("Invalid location provided to getCoordinatesForLocation:", location)
    return { lat: 39.8283, lng: -98.5795 } // Center of US as fallback
  }

  // Try to extract city and state first
  const cityState = extractCityState(location)

  if (cityState && cityCoordinates[cityState]) {
    return cityCoordinates[cityState]
  }

  // Try to match any part of the address to our city database
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (location.includes(city)) {
      return coords
    }
  }

  // Try to match just the state abbreviation
  const stateMatch = location.match(/\b([A-Z]{2})\b/)
  if (stateMatch && stateMatch[1]) {
    const state = stateMatch[1]
    // Find a city in that state
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (city.endsWith(`, ${state}`)) {
        console.log(`Using ${city} as fallback for address: ${location}`)
        return coords
      }
    }
  }

  // If we can't find a match, return a random US location
  const usLocations = Object.values(cityCoordinates).filter(
    (coord) => coord.lat > 24 && coord.lat < 50 && coord.lng < -65 && coord.lng > -125,
  )

  if (usLocations.length > 0) {
    const randomLocation = usLocations[Math.floor(Math.random() * usLocations.length)]
    console.log(`Using random location as fallback for address: ${location}`, randomLocation)
    return randomLocation
  }

  // Fallback to a default location (center of US)
  return { lat: 39.8283, lng: -98.5795 }
}

/**
 * Generates intermediate points between two coordinates
 * @param start Starting coordinates
 * @param end Ending coordinates
 * @param numPoints Number of points to generate
 * @returns Array of coordinates
 */
export function generateRoutePoints(start: CityCoordinates, end: CityCoordinates, numPoints = 10): CityCoordinates[] {
  const points: CityCoordinates[] = []

  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints

    // Add some randomness to make the route less straight
    const jitter =
      i > 0 && i < numPoints
        ? {
            lat: (Math.random() - 0.5) * 0.5,
            lng: (Math.random() - 0.5) * 0.5,
          }
        : { lat: 0, lng: 0 }

    points.push({
      lat: start.lat + (end.lat - start.lat) * fraction + jitter.lat,
      lng: start.lng + (end.lng - start.lng) * fraction + jitter.lng,
    })
  }

  return points
}
