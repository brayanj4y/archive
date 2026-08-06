"use client"
import dynamic from "next/dynamic"

// Dynamically import the client-side map component with no SSR
const ShipmentMapClient = dynamic(() => import("./shipment-map-client"), {
  ssr: false,
  loading: () => <MapLoading />,
})

function MapLoading() {
  return (
    <div className="h-[400px] w-full bg-slate-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-slate-600">Loading map...</p>
      </div>
    </div>
  )
}

interface ShipmentMapProps {
  pickupAddress: string
  deliveryAddress: string
  currentStatus: string
  className?: string
}

export default function ShipmentMap(props: ShipmentMapProps) {
  return <ShipmentMapClient {...props} />
}
