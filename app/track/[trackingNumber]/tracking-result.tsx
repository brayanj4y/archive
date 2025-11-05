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
import { useState, useEffect, useRef } from "react"
import ProfessionalBarcode from "@/components/professional-barcode"
import type { Shipment, StatusUpdate } from "@/lib/types"
import { getStatusColor, getStatusIcon, formatTrackingNumber } from "@/lib/utils/tracking"
import EnhancedRealTimeMap from "@/components/enhanced-real-time-map"

interface Props {
  shipment: Shipment
  statusUpdates: StatusUpdate[]
}

export default function TrackingResult({ shipment, statusUpdates }: Props) {
  const [showMap, setShowMap] = useState(true)
  const [barcodeWidth, setBarcodeWidth] = useState(320)
  const barcodeWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (barcodeWrapperRef.current) {
        const width = barcodeWrapperRef.current.offsetWidth
        setBarcodeWidth(Math.min(width, 320))
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md shadow-elegant border-0">
          <CardContent className="p-6 sm:p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-slate-800">Shipment Not Found</h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
              The tracking number you entered was not found in our system.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg w-full sm:w-auto"
            >
              <Link href="/track">Try Another Number</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePrint = () => window.print()

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const getProgressPercentage = () => {
    switch (shipment.current_status) {
      case "pending":
        return 0
      case "on_hold":
        return shipment.paused_progress_percent || 0
      case "in_transit":
        return shipment.paused_progress_percent || 1
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const toggleMap = () => setShowMap(!showMap)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-slate-200/60 print:hidden sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 py-2 gap-3">
          <Link href="/" className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
            <div className="relative">
              <Package className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse-soft"></div>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-xl sm:text-2xl font-bold gradient-text">ShipTrack Pro</span>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">Professional Logistics</div>
            </div>
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto border-2 border-slate-200">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto border-2 border-blue-200">
              <Link href="/track">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Track Another
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-x-hidden">
        <Card className="mb-8 shadow-elegant border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl mb-2 sm:mb-4 font-display text-slate-800">
                  Tracking: {formatTrackingNumber(shipment.tracking_number)}
                </CardTitle>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge className={`${getStatusColor(shipment.current_status)} text-sm px-2 py-1`}>
                    {getStatusIcon(shipment.current_status)} {shipment.current_status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-sm flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {shipment.package_type}
                  </Badge>
                  <Badge variant="outline" className="text-sm flex items-center gap-1">
                    <Shield className="w-3 h-3" />${shipment.insurance_amount} insured
                  </Badge>
                </div>
              </div>

              <div ref={barcodeWrapperRef} className="w-full sm:w-auto mt-4 lg:mt-0 flex justify-center lg:justify-end">
                <ProfessionalBarcode
                  value={shipment.tracking_number}
                  width={barcodeWidth}
                  height={100}
                  showText={true}
                  format="CODE128"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold font-display text-slate-800">Delivery Progress</span>
                <span className="text-lg font-bold text-blue-600">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Pending</span>
                <span>In Transit</span>
                <span>Delivered</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="shadow-soft border-0 bg-gradient-to-br from-green-50 to-emerald-50 w-full">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold font-display mb-3 flex items-center text-lg text-slate-800">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Sender Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-slate-800">{shipment.client_name}</div>
                        <div className="text-sm text-slate-600">Sender</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      <div className="text-slate-700 text-sm">{shipment.client_email}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <div className="text-slate-700 text-sm">{shipment.client_phone}</div>
                    </div>
                    <div className="mt-2 p-2 sm:p-3 bg-white rounded-lg border border-green-200">
                      <div className="text-xs text-slate-600 mb-1">Pickup Address</div>
                      <div className="text-sm text-slate-700">{shipment.pickup_address}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-0 bg-gradient-to-br from-blue-50 to-purple-50 w-full">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold font-display mb-3 flex items-center text-lg text-slate-800">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Receiver Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <div className="font-medium text-slate-800">{shipment.receiver_name || "Not specified"}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div className="text-slate-700 text-sm">{shipment.receiver_email || "Not specified"}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <div className="text-slate-700 text-sm">{shipment.receiver_phone || "Not specified"}</div>
                    </div>
                    <div className="mt-2 p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                      <div className="text-xs text-slate-600 mb-1">Delivery Address</div>
                      <div className="text-sm text-slate-700">{shipment.delivery_address}</div>
                    </div>
                    {shipment.receiver_address && shipment.receiver_address !== shipment.delivery_address && (
                      <div className="mt-2 p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                        <div className="text-xs text-slate-600 mb-1">Receiver Address</div>
                        <div className="text-sm text-slate-700">{shipment.receiver_address}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="shadow-soft border-0 bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">Package Name</div>
                  <div className="font-semibold text-base sm:text-lg text-slate-800">{shipment.package_name}</div>
                </CardContent>
              </Card>
              <Card className="shadow-soft border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">Weight</div>
                  <div className="font-semibold text-base sm:text-lg text-slate-800">{shipment.package_weight} lbs</div>
                </CardContent>
              </Card>
              <Card className="shadow-soft border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">Insurance</div>
                  <div className="font-semibold text-base sm:text-lg text-slate-800">${shipment.insurance_amount}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 shadow-soft border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl border-b">
                <CardTitle className="flex flex-col sm:flex-row items-center justify-between text-lg font-display text-slate-800 gap-2 sm:gap-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
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
              <CardContent className="p-4 sm:p-6">
                <p className="text-slate-600 mb-2 sm:mb-4 text-sm sm:text-base">
                  Watch your package move in real-time from pickup to delivery. The simulation uses actual geocoded addresses.
                </p>
                {showMap && <EnhancedRealTimeMap shipment={shipment} className="mt-2 sm:mt-4" />}
              </CardContent>
            </Card>

            {shipment.special_instructions && (
              <Card className="mb-6 shadow-soft border-0 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold font-display mb-2 text-lg text-slate-800">Special Instructions</h3>
                  <div className="bg-white border-2 border-yellow-200 p-2 sm:p-4 rounded-xl text-sm sm:text-base text-slate-700">
                    {shipment.special_instructions}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-xl">
            <CardTitle className="flex items-center text-xl sm:text-2xl font-display text-slate-800 gap-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              Tracking Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            {statusUpdates && statusUpdates.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {statusUpdates.map((update) => (
                  <div key={update.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <Card className="shadow-soft border-0 bg-gradient-to-r from-slate-50 to-blue-50">
                        <CardContent className="p-3 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-3 gap-2 sm:gap-0">
                            <div>
                              <p className="font-semibold text-sm sm:text-lg text-slate-800 font-display">
                                {update.status.replace("_", " ").toUpperCase()}
                              </p>
                              {update.location && (
                                <p className="text-slate-600 flex items-center mt-1 text-xs sm:text-sm">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {update.location}
                                </p>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 text-right">{formatDate(update.created_at)}</div>
                          </div>
                          {update.description && (
                            <p className="text-slate-600 leading-relaxed bg-white p-2 sm:p-3 rounded-lg border border-slate-200 text-sm sm:text-base">
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
              <div className="text-center py-8 sm:py-12">
                <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-semibold font-display text-slate-600 mb-1 sm:mb-2">
                  No tracking updates available yet
                </h3>
                <p className="text-sm sm:text-base text-slate-500">
                  Updates will appear here as your package moves through our network.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
