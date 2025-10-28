import type { Metadata } from "next"
import { Star, Quote, TrendingUp, Users, Award, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Customer Reviews - ShipTrack Pro",
  description:
    "Read what our customers say about ShipTrack Pro shipping services. Real reviews from satisfied customers.",
  keywords: "reviews, testimonials, customer feedback, shipping reviews",
}

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    service: "Fragile Items",
    date: "2024-12-15",
    comment:
      "Absolutely fantastic service! I needed to ship a valuable antique vase across the country, and ShipTrack Pro handled it with incredible care. The custom packaging was top-notch, and I received updates every step of the way. The vase arrived in perfect condition. Highly recommend for fragile items!",
    verified: true,
    avatar: "SJ",
    location: "New York, NY",
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 5,
    service: "Pet Transportation",
    date: "2024-12-10",
    comment:
      "Moving across the country with my Golden Retriever was stressful, but ShipTrack Pro made the pet transport seamless. The $1,200 crate service was worth every penny - it was spacious and comfortable. My dog arrived happy and healthy, and the staff kept me updated throughout the journey. Professional and caring service.",
    verified: true,
    avatar: "MC",
    location: "Los Angeles, CA",
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 5,
    service: "International",
    date: "2024-12-08",
    comment:
      "Shipped important documents to our London office. The international service was flawless - they handled all customs paperwork, provided real-time tracking, and delivered on time. Much better experience than other carriers I've used. Will definitely use again for international shipments.",
    verified: true,
    avatar: "ED",
    location: "Chicago, IL",
  },
  {
    id: 4,
    name: "Robert Martinez",
    rating: 4,
    service: "General Shipping",
    date: "2024-12-05",
    comment:
      "Great service overall. Package arrived on time and in good condition. The tracking system is very detailed and user-friendly. Only minor issue was that the pickup was delayed by a few hours, but customer service kept me informed. Would use again.",
    verified: true,
    avatar: "RM",
    location: "Houston, TX",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    rating: 5,
    service: "Pet Transportation",
    date: "2024-12-01",
    comment:
      "I was nervous about flying my cat to my new home, but ShipTrack Pro's pet service exceeded expectations. The veterinary health certificates were handled professionally, and the climate-controlled transport ensured my cat was comfortable. The $800 insurance gave me peace of mind. Excellent service!",
    verified: true,
    avatar: "LT",
    location: "Miami, FL",
  },
  {
    id: 6,
    name: "David Wilson",
    rating: 5,
    service: "Fragile Items",
    date: "2024-11-28",
    comment:
      "Needed to ship a custom-built computer setup for work. The white glove service was incredible - they disassembled, packed, shipped, and reassembled everything at the destination. Not a single component was damaged. Worth the premium for valuable electronics.",
    verified: true,
    avatar: "DW",
    location: "Seattle, WA",
  },
  {
    id: 7,
    name: "Jennifer Brown",
    rating: 4,
    service: "International",
    date: "2024-11-25",
    comment:
      "Shipped holiday gifts to family in Canada. The process was smooth and the customs handling was professional. Packages arrived in time for the holidays. Pricing was competitive and the service was reliable. Minor delay at customs but that's expected for international shipping.",
    verified: true,
    avatar: "JB",
    location: "Boston, MA",
  },
  {
    id: 8,
    name: "Mark Anderson",
    rating: 5,
    service: "General Shipping",
    date: "2024-11-20",
    comment:
      "Regular business customer here. ShipTrack Pro consistently delivers our products to customers on time. Their API integration made it easy to automate our shipping process. Customer service is responsive and professional. Highly recommend for business shipping needs.",
    verified: true,
    avatar: "MA",
    location: "Denver, CO",
  },
]

export default function ReviewsPage() {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalReviews = reviews.length
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* New Header Component */}
      <Header currentPath="/reviews" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">Customer Stories</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Customer Reviews</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            See what our customers say about our shipping services. Real feedback from satisfied customers.
          </p>
        </div>

        {/* Rating Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-slate-200">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-slate-600">Average Rating</div>
            </CardContent>
          </Card>

          <Card className="text-center border-slate-200">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalReviews}</div>
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-slate-600">Total Reviews</div>
            </CardContent>
          </Card>

          <Card className="text-center border-slate-200">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {Math.round((fiveStarCount / totalReviews) * 100)}%
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-slate-600">5-Star Reviews</div>
            </CardContent>
          </Card>

          <Card className="text-center border-slate-200">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-slate-600">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {review.service}
                  </Badge>
                </div>

                <div className="mb-4">
                  <Quote className="w-6 h-6 text-slate-300 mb-2" />
                  <p className="text-slate-700 leading-relaxed text-sm">{review.comment}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{review.name}</div>
                      <div className="text-xs text-slate-500">{review.location}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="text-center border-slate-200 bg-slate-50">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Experience Our Service?</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust ShipTrack Pro with their shipments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/track">Track Your Package</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-300 bg-transparent">
                <Link href="/contact">Get a Quote</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Footer Component */}
      <Footer />
    </div>
  )
}
