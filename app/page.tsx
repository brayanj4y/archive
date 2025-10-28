"use client"

import { useState } from "react"
import {
  Package,
  Truck,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Search,
  Heart,
  Globe,
  Users,
  TrendingUp,
  Zap,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const router = useRouter()

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      router.push(`/track/${trackingNumber.trim()}`)
    }
  }

  const stats = [
    { label: "Packages Delivered", value: "250,000+", icon: Package },
    { label: "Happy Customers", value: "50,000+", icon: Users },
    { label: "Success Rate", value: "99.9%", icon: TrendingUp },
    { label: "Countries Served", value: "45+", icon: Globe },
  ]

  const services = [
    {
      title: "Express Shipping",
      description: "Lightning-fast delivery for urgent packages with real-time tracking",
      icon: Zap,
      features: ["Same-day pickup", "24-48 hour delivery", "Priority handling", "SMS notifications"],
    },
    {
      title: "Fragile & Valuable",
      description: "Specialized care for delicate items with premium protection",
      icon: Shield,
      features: ["Custom packaging", "Insurance up to $50K", "White glove service", "Photo documentation"],
    },
    {
      title: "Pet Transportation",
      description: "Safe, comfortable, and stress-free transport for your beloved pets",
      icon: Heart,
      features: ["$1,200 refundable crate", "$800 insurance", "Vet-certified handlers", "Climate controlled"],
    },
    {
      title: "Global Logistics",
      description: "Worldwide shipping with comprehensive customs and documentation support",
      icon: Globe,
      features: ["Customs clearance", "Door-to-door service", "Multi-modal transport", "Trade compliance"],
    },
  ]

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Exceptional service! My antique vase arrived in perfect condition.",
      service: "Fragile Items",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Outstanding pet transport service. My Golden Retriever was treated like royalty.",
      service: "Pet Transportation",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      comment: "Seamless international shipping. All customs paperwork handled perfectly.",
      service: "International",
      avatar: "ER",
    },
  ]

  const features = [
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Monitor your shipment's journey with live GPS tracking and instant notifications",
    },
    {
      icon: Shield,
      title: "Secure & Insured",
      description: "Comprehensive insurance coverage and secure handling for complete peace of mind",
    },
    {
      icon: Award,
      title: "Industry Leading",
      description: "Award-winning service with 99.9% on-time delivery rate and customer satisfaction",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPath="/" />

      <section className="relative py-20 bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/images/logistics-hero-bg.jpg')",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
              Trusted by 50,000+ customers worldwide
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Professional Shipping for
              <span className="block text-blue-600">Every Need</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              From everyday parcels to specialized pet transportation and fragile items - we deliver with precision,
              care, and complete transparency.
            </p>

            <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Track Your Package</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., ST12345678ABCD)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-12 pl-10 border-slate-300"
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                </div>
                <Button onClick={handleTrack} className="h-12 px-6 bg-blue-600 hover:bg-blue-700">
                  <Search className="w-5 h-5 mr-2" />
                  Track Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-lg w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our streamlined process ensures your packages are handled with care from pickup to delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Book Shipment",
                description: "Choose your service type and provide pickup/delivery details",
                icon: Package,
              },
              {
                step: "02",
                title: "Professional Pickup",
                description: "Our trained team collects your items with appropriate handling",
                icon: Truck,
              },
              {
                step: "03",
                title: "Real-time Tracking",
                description: "Monitor your shipment progress with live GPS updates",
                icon: Clock,
              },
              {
                step: "04",
                title: "Secure Delivery",
                description: "Safe delivery with confirmation and digital proof",
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="bg-blue-600 rounded-lg w-16 h-16 flex items-center justify-center mx-auto">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-white border-2 border-blue-600 rounded-full w-7 h-7 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Shipping Solutions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive logistics services tailored to your specific needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border-slate-200">
                <CardHeader>
                  <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted Worldwide</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Our commitment to excellence has earned the trust of customers across the globe
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                  <stat.icon className="w-10 h-10 mx-auto mb-3 text-white/80" />
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">Customer Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real feedback from satisfied customers who trust us with their shipments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 leading-relaxed italic">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{review.name}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {review.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
