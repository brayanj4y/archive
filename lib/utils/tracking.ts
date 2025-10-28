export function generateTrackingNumber(): string {
  const prefix = "ST"
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export function formatTrackingNumber(trackingNumber: string): string {
  return trackingNumber.replace(/(.{2})(.{4})(.{4})(.{4})/, "$1-$2-$3-$4")
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "on_hold":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "in_transit":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "⏳"
    case "on_hold":
      return "⏸️"
    case "in_transit":
      return "🚚"
    case "delivered":
      return "✅"
    default:
      return "📦"
  }
}
