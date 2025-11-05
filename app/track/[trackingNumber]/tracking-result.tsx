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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="max-w-md border border-black rounded-sm">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-black">Shipment Not Found</h3>
            <p className="text-sm text-black mb-4">The tracking number you entered was not found.</p>
            <Button asChild className="w-full sm:w-auto border border-black">
              <Link href="/track">Try Another Number</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePrint = () => window.print()
  const toggleMap = () => setShowMap(!showMap)

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

      <div className="max-w-4xl mx-auto px-4 py-6 w-full">
        <Card className="border border-black rounded-sm mb-6">
          <CardHeader className="border-b border-dotted border-black p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-lg font-bold mb-1">
                Tracking: {formatTrackingNumber(shipment.tracking_number)}
              </CardTitle>
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <Badge className={`border border-black px-2 py-1`}>{shipment.current_status.replace("_", " ").toUpperCase()}</Badge>
                <Badge className="border border-black px-2 py-1 flex items-center gap-1">
                  <Package className="w-3 h-3" /> {shipment.package_type}
                </Badge>
                <Badge className="border border-black px-2 py-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> ${shipment.insurance_amount} insured
                </Badge>
              </div>
            </div>
            <div ref={barcodeWrapperRef} className="w-full sm:w-auto flex justify-center sm:justify-end mt-2 sm:mt-0">
              <ProfessionalBarcode value={shipment.tracking_number} width={barcodeWidth} height={80} showText={true} format="CODE128" />
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm font-semibold">
                <span>Delivery Progress</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <div className="w-full h-3 border border-black rounded-sm overflow-hidden">
                <div
                  className="h-3 bg-black"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Pending</span>
                <span>In Transit</span>
                <span>Delivered</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className="border border-black rounded-sm p-2">
                <h3 className="text-sm font-bold mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Sender Information
                </h3>
                <div className="text-xs">
                  <div className="mb-1"><User className="w-3 h-3 inline mr-1" /> {shipment.client_name}</div>
                  <div className="mb-1"><Mail className="w-3 h-3 inline mr-1" /> {shipment.client_email}</div>
                  <div className="mb-1"><Phone className="w-3 h-3 inline mr-1" /> {shipment.client_phone}</div>
                  <div className="border-t border-dotted border-black pt-1 text-xs">{shipment.pickup_address}</div>
                </div>
              </Card>

              <Card className="border border-black rounded-sm p-2">
                <h3 className="text-sm font-bold mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Receiver Information
                </h3>
                <div className="text-xs">
                  <div className="mb-1"><User className="w-3 h-3 inline mr-1" /> {shipment.receiver_name || "N/A"}</div>
                  <div className="mb-1"><Mail className="w-3 h-3 inline mr-1" /> {shipment.receiver_email || "N/A"}</div>
                  <div className="mb-1"><Phone className="w-3 h-3 inline mr-1" /> {shipment.receiver_phone || "N/A"}</div>
                  <div className="border-t border-dotted border-black pt-1 text-xs">{shipment.delivery_address}</div>
                  {shipment.receiver_address && shipment.receiver_address !== shipment.delivery_address && (
                    <div className="border-t border-dotted border-black pt-1 text-xs">{shipment.receiver_address}</div>
                  )}
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-2 mb-4">
              <Card className="border border-black rounded-sm p-2 text-center text-xs">
                <div className="font-semibold">{shipment.package_name}</div>
                <div>Package Name</div>
              </Card>
              <Card className="border border-black rounded-sm p-2 text-center text-xs">
                <div className="font-semibold">{shipment.package_weight} lbs</div>
                <div>Weight</div>
              </Card>
              <Card className="border border-black rounded-sm p-2 text-center text-xs">
                <div className="font-semibold">${shipment.insurance_amount}</div>
                <div>Insurance</div>
              </Card>
            </div>

            <Card className="border border-black rounded-sm p-2 mb-4">
              <CardHeader className="border-b border-dotted border-black p-1 text-xs flex justify-between items-center">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Live Shipment Tracking</div>
                <Button variant="outline" size="sm" onClick={toggleMap} className="border border-black text-xs px-2 py-1">{showMap ? "Hide Map" : "Show Map"}</Button>
              </CardHeader>
              {showMap && <CardContent className="p-1"><EnhancedRealTimeMap shipment={shipment} /></CardContent>}
            </Card>

            {shipment.special_instructions && (
              <Card className="border border-black rounded-sm p-2 mb-4 text-xs">
                <div className="font-bold mb-1">Special Instructions</div>
                <div className="border-t border-dotted border-black pt-1">{shipment.special_instructions}</div>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card className="border border-black rounded-sm mb-4">
          <CardHeader className="border-b border-dotted border-black p-2 text-sm font-bold flex items-center gap-1">
            <Clock className="w-4 h-4" /> Tracking Timeline
          </CardHeader>
          <CardContent className="p-2 text-xs">
            {statusUpdates && statusUpdates.length > 0 ? (
              <div className="space-y-1">
                {statusUpdates.map((update) => (
                  <div key={update.id} className="flex flex-col gap-1 border-b border-dotted border-black pb-1">
                    <div className="flex justify-between">
                      <span>{update.status.replace("_", " ").toUpperCase()}</span>
                      <span>{formatDate(update.created_at)}</span>
                    </div>
                    {update.location && <div>Location: {update.location}</div>}
                    {update.description && <div>{update.description}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2">No tracking updates yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
