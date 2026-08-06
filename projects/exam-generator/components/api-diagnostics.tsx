"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ApiDiagnostics() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const checkModels = async () => {
    setIsChecking(true)
    setError(null)

    try {
      const response = await fetch("/api/check-models")
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      setResults(data.models)
    } catch (err) {
      console.error("Error checking models:", err)
      setError(err.message)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Google AI API Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={checkModels} disabled={isChecking} className="mb-4">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking Gemini 1.5 Flash Availability...
            </>
          ) : (
            "Check Gemini 1.5 Flash Availability"
          )}
        </Button>

        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Model Name</th>
                  <th className="p-2 text-left">Available</th>
                  <th className="p-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{result.modelName || "N/A"}</td>
                    <td className="p-2">
                      {result.available ? (
                        <span className="text-green-600">✓ Yes</span>
                      ) : (
                        <span className="text-red-600">✗ No</span>
                      )}
                    </td>
                    <td className="p-2 text-sm">{result.response || result.error || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p className="font-medium">Gemini 1.5 Flash Unavailable?</p>
          <p className="mt-1">This may be due to:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Invalid or missing API key.</li>
            <li>Insufficient quota.</li>
            <li>Too many requests in a short period.</li>
          </ul>
          <p className="mt-2">Note: The application will use fallback questions if the API is unavailable.</p>
        </div>
      </CardContent>
    </Card>
  )
}

