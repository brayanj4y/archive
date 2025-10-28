"use client"

import { useState } from "react"
import { Search, Clock, Shield, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const router = useRouter()

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      router.push(`/track/${trackingNumber.trim()}`)
    }
  }

  const features = [
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live GPS tracking with instant notifications",
    },
    {
      icon: Shield,
      title: "Secure Tracking",
      description: "Protected data with enterprise-grade security",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get tracking information in milliseconds",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPath="/track" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Package Tracking</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Track Your Package</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Enter your tracking number to get real-time updates on your shipment's journey
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-12 border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-xl">Enter Tracking Number</CardTitle>
            <CardDescription>Your tracking number was provided when you shipped your package</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="e.g., ST12345678ABCD"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="h-12 pl-10 border-slate-300"
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              </div>
              <Button onClick={handleTrack} className="h-12 px-6 bg-blue-600 hover:bg-blue-700">
                <Search className="w-5 h-5 mr-2" />
                Track Package
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-slate-200">
              <CardContent className="p-6">
                <div className="bg-blue-100 rounded-lg w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Need Help?</h3>
            <p className="text-slate-600 mb-6 text-lg">
              Can't find your tracking number or having issues with your shipment?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild className="border-slate-300 bg-transparent">
                <Link href="/contact">
                  Contact Support
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-slate-300 bg-transparent">
                <Link href="/faq">
                  View FAQ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
