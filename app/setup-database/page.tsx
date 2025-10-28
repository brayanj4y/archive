"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Database, Play, Loader2, Copy, ExternalLink } from "lucide-react"

export default function DatabaseSetupPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [sqlScript, setSqlScript] = useState<string>("")
  const [showManualSetup, setShowManualSetup] = useState(false)

  const runDatabaseSetup = async () => {
    setIsRunning(true)
    setResults([])
    setErrors([])
    setIsComplete(false)
    setSqlScript("")
    setShowManualSetup(false)

    try {
      const response = await fetch("/api/setup-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results || [])
        setIsComplete(true)
      } else {
        setErrors(data.errors || ["Unknown error occurred"])
        if (data.sqlScript) {
          setSqlScript(data.sqlScript)
          setShowManualSetup(true)
        }
      }
    } catch (error) {
      console.error("Setup error:", error)
      setErrors(["Failed to connect to database setup API"])
      setShowManualSetup(true)
    } finally {
      setIsRunning(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript)
      alert("SQL script copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">Database Setup</Badge>
          <h1 className="text-4xl font-bold font-display text-slate-900 mb-4">Initialize ShipTrack Pro Database</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Set up your database tables and initial data for the shipment tracking system
          </p>
        </div>

        <Card className="shadow-elegant border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl w-12 h-12 flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-display">Database Setup</CardTitle>
                <CardDescription>
                  This will create all necessary tables and initial data for your shipment tracking system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-800 mb-4">What will be created:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Shipments table with all required fields</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Status updates table for tracking history</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Admin users table for authentication</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Database indexes for performance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Sample shipment data for testing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Default admin user account</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={runDatabaseSetup}
                  disabled={isRunning}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-4 text-lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Setting up database...
                    </>
                  ) : isComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Setup Complete!
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Run Database Setup
                    </>
                  )}
                </Button>
              </div>

              {isComplete && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Database setup completed successfully!</strong>
                    <br />
                    You can now use the admin dashboard with:
                    <br />
                    Email: <code className="bg-green-100 px-1 rounded">admin@shiptrack.com</code>
                    <br />
                    Password: <code className="bg-green-100 px-1 rounded">admin123</code>
                    <br />
                    Demo tracking number: <code className="bg-green-100 px-1 rounded">ST12345678ABCD</code>
                  </AlertDescription>
                </Alert>
              )}

              {errors.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Automatic setup encountered issues:</strong>
                    <ul className="mt-2 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm">
                          • {error}
                        </li>
                      ))}
                    </ul>
                    {showManualSetup && (
                      <p className="mt-2 text-sm">
                        <strong>Don't worry!</strong> You can set up the database manually using the SQL script below.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {results.length > 0 && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-800 mb-4">Setup Results:</h3>
                  <ul className="space-y-2">
                    {results.map((result, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showManualSetup && sqlScript && (
          <Card className="shadow-elegant border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl w-12 h-12 flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-display">Manual Database Setup</CardTitle>
                    <CardDescription>Copy and paste this SQL script into your Supabase SQL Editor</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="border-orange-200 hover:bg-orange-50"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                  <Button asChild variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                    <a href="https://supabase.com/dashboard/project/_/sql" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Supabase SQL Editor
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-orange-700">
                    <li>Copy the SQL script below</li>
                    <li>Open your Supabase project dashboard</li>
                    <li>Go to the SQL Editor</li>
                    <li>Paste the script and click "Run"</li>
                    <li>Return here and try the automatic setup again</li>
                  </ol>
                </div>

                <Textarea
                  value={sqlScript}
                  readOnly
                  className="font-mono text-sm h-96 bg-slate-50 border-2 border-slate-200"
                  placeholder="SQL script will appear here..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {(isComplete || showManualSetup) && (
          <Card className="shadow-elegant border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold font-display text-slate-800 mb-4">Next Steps</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="border-2 border-blue-200 hover:bg-blue-50">
                  <a href="/admin">Access Admin Dashboard</a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-green-200 hover:bg-green-50">
                  <a href="/track">Test Tracking System</a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-purple-200 hover:bg-purple-50">
                  <a href="/track/ST12345678ABCD">View Demo Shipment</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
