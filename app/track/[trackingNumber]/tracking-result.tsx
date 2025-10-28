"use client"

import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Printer,
  ArrowLeft,
  AlertCircle,
  Shield,
  User,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import ProfessionalBarcode from "@/components/professional-barcode"
import type { Shipment, StatusUpdate } from "@/lib/types"
import { getStatusColor, getStatusIcon, formatTrackingNumber } from "@/lib/utils/tracking"
import EnhancedRealTimeMap from "@/components/enhanced-real-time-map"

interface Props {
  shipment: Shipment
  statusUpdates: StatusUpdate[]
}

export default function TrackingResult({ shipment, statusUpdates }: Props) {
  console.log("TrackingResult received:", { shipment, statusUpdates })
  const [showMap, setShowMap] = useState(true)

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md shadow-elegant border-0">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold font-display mb-4 text-slate-800">Shipment Not Found</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              The tracking number you entered was not found in our system.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Link href="/track">Try Another Number</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  const getProgressPercentage = () => {
    // This will be overridden by the map component's real-time calculation
    switch (shipment.current_status) {
      case "pending":
        return 0
      case "on_hold":
        return shipment.paused_progress_percent || 0
      case "in_transit":
        // Real progress will be calculated by simulation
        return shipment.paused_progress_percent || 1
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-slate-200/60 print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Package className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse-soft"></div>
              </div>
              <div>
                <span className="text-2xl font-bold font-display gradient-text">ShipTrack Pro</span>
                <div className="text-xs text-slate-500 font-medium">Professional Logistics</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handlePrint} className="border-2 border-slate-200 hover:bg-slate-50">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" asChild className="border-2 border-blue-200 hover:bg-blue-50">
                <Link href="/track">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Track Another
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Tracking Card */}
        <Card className="mb-8 shadow-elegant border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <CardTitle className="text-3xl mb-4 font-display text-slate-800">
                  Tracking: {formatTrackingNumber(shipment.tracking_number)}
                </CardTitle>
                <div className="flex items-center space-x-4 flex-wrap gap-2">
                  <Badge className={`${getStatusColor(shipment.current_status)} text-sm px-3 py-1`}>
                    {getStatusIcon(shipment.current_status)} {shipment.current_status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    <Package className="w-3 h-3 mr-1" />
                    {shipment.package_type}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    <Shield className="w-3 h-3 mr-1" />${shipment.insurance_amount} insured
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <ProfessionalBarcode
                  value={shipment.tracking_number}
                  width={320}
                  height={100}
                  showText={true}
                  format="CODE128"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold font-display text-slate-800">Delivery Progress</span>
                <span className="text-lg font-bold text-blue-600">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Pending</span>
                <span>In Transit</span>
                <span>Delivered</span>
              </div>
            </div>

            {/* Enhanced Address Information */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Sender Information */}
              <Card className="shadow-soft border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold font-display mb-4 flex items-center text-lg text-slate-800">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Sender Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-slate-800">{shipment.client_name}</div>
                        <div className="text-sm text-slate-600">Sender</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-slate-700">{shipment.client_email}</div>
                        <div className="text-sm text-slate-600">Email</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-slate-700">{shipment.client_phone}</div>
                        <div className="text-sm text-slate-600">Phone</div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                      <div className="text-sm text-slate-600 mb-1">Pickup Address</div>
                      <div className="text-slate-700">{shipment.pickup_address}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Receiver Information */}
              <Card className="shadow-soft border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold font-display mb-4 flex items-center text-lg text-slate-800">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Receiver Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-slate-800">{shipment.receiver_name || "Not specified"}</div>
                        <div className="text-sm text-slate-600">Receiver</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-slate-700">{shipment.receiver_email || "Not specified"}</div>
                        <div className="text-sm text-slate-600">Email</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-slate-700">{shipment.receiver_phone || "Not specified"}</div>
                        <div className="text-sm text-slate-600">Phone</div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                      <div className="text-sm text-slate-600 mb-1">Delivery Address</div>
                      <div className="text-slate-700">{shipment.delivery_address}</div>
                    </div>
                    {shipment.receiver_address && shipment.receiver_address !== shipment.delivery_address && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-sm text-slate-600 mb-1">Receiver Address</div>
                        <div className="text-slate-700">{shipment.receiver_address}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Package Details */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="shadow-soft border-0 bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-6 text-center">
                  <div className="text-sm text-slate-500 mb-2">Package Name</div>
                  <div className="font-semibold text-lg text-slate-800">{shipment.package_name}</div>
                </CardContent>
              </Card>
              <Card className="shadow-soft border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6 text-center">
                  <div className="text-sm text-slate-500 mb-2">Weight</div>
                  <div className="font-semibold text-lg text-slate-800">{shipment.package_weight} lbs</div>
                </CardContent>
              </Card>
              <Card className="shadow-soft border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-6 text-center">
                  <div className="text-sm text-slate-500 mb-2">Insurance</div>
                  <div className="font-semibold text-lg text-slate-800">${shipment.insurance_amount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Shipment Map */}
            <Card className="mb-10 shadow-soft border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl border-b">
                <CardTitle className="flex items-center justify-between text-lg font-display text-slate-800">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Live Shipment Tracking
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMap}
                    className="border-2 border-slate-200 hover:bg-slate-50"
                  >
                    {showMap ? "Hide Map" : "Show Map"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 mb-4">
                  Watch your package move in real-time from pickup to delivery. The simulation uses actual geocoded
                  addresses and shows precise movement along the calculated route.
                </p>

                {showMap && <EnhancedRealTimeMap shipment={shipment} className="mt-4" />}
              </CardContent>
            </Card>

            {/* Special Instructions */}
            {shipment.special_instructions && (
              <Card className="mb-10 shadow-soft border-0 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold font-display mb-3 text-lg text-slate-800">Special Instructions</h3>
                  <div className="bg-white border-2 border-yellow-200 p-4 rounded-xl">
                    <p className="text-slate-700 leading-relaxed">{shipment.special_instructions}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card className="shadow-elegant border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-xl">
            <CardTitle className="flex items-center text-2xl font-display text-slate-800">
              <Clock className="w-6 h-6 mr-3" />
              Tracking Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {statusUpdates && statusUpdates.length > 0 ? (
              <div className="space-y-8">
                {statusUpdates.map((update, index) => (
                  <div key={update.id} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Card className="shadow-soft border-0 bg-gradient-to-r from-slate-50 to-blue-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-lg text-slate-800 font-display">
                                {update.status.replace("_", " ").toUpperCase()}
                              </p>
                              {update.location && (
                                <p className="text-slate-600 flex items-center mt-1">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {update.location}
                                </p>
                              )}
                            </div>
                            <div className="text-sm text-slate-500 text-right">{formatDate(update.created_at)}</div>
                          </div>
                          {update.description && (
                            <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                              {update.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold font-display text-slate-600 mb-2">
                  No tracking updates available yet
                </h3>
                <p className="text-slate-500">Updates will appear here as your package moves through our network.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ParcelDelivery",
              deliveryAddress: {
                "@type": "PostalAddress",
                addressLocality: shipment.delivery_address,
                name: shipment.receiver_name,
                email: shipment.receiver_email,
                telephone: shipment.receiver_phone,
              },
              originAddress: {
                "@type": "PostalAddress",
                addressLocality: shipment.pickup_address,
                name: shipment.client_name,
                email: shipment.client_email,
                telephone: shipment.client_phone,
              },
              trackingNumber: shipment.tracking_number,
              deliveryStatus: shipment.current_status,
              hasDeliveryMethod: {
                "@type": "DeliveryMethod",
                name: shipment.package_type,
              },
              itemShipped: {
                "@type": "Product",
                name: shipment.package_name,
                weight: {
                  "@type": "QuantitativeValue",
                  value: shipment.package_weight,
                  unitCode: "LBR",
                },
              },
              provider: {
                "@type": "Organization",
                name: "ShipTrack Pro",
                url: "https://shiptrackpro.com",
                logo: "https://shiptrackpro.com/logo.png",
              },
            }),
          }}
        />
      </div>
    </div>
  )
}
