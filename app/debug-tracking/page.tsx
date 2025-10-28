"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugTracking() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    if (!trackingNumber) return

    setLoading(true)
    try {
      const response = await fetch(`/api/shipments/${trackingNumber}`)
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    }
    setLoading(false)
  }

  const testAllShipments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/shipments")
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Debug Tracking System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Button onClick={testAPI} disabled={loading}>
              Test API
            </Button>
            <Button onClick={testAllShipments} disabled={loading}>
              Get All Shipments
            </Button>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
