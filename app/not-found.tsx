import { Package, Search, Home, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center px-4">
        <Card className="shadow-elegant border-0 bg-white/80 backdrop-blur-md">
          <CardContent className="p-12">
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-float">
                <Package className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-6xl font-bold font-display gradient-text mb-4">404</h1>
              <h2 className="text-3xl font-bold font-display text-slate-800 mb-4">Package Not Found</h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                The tracking number or page you're looking for doesn't exist in our system. Don't worry, we'll help you
                find what you need.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Link href="/track">
                  <Search className="w-5 h-5 mr-2" />
                  Try Another Tracking Number
                </Link>
              </Button>

              <Button variant="outline" asChild size="lg" className="border-2 border-slate-300 hover:bg-slate-50">
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <p className="text-slate-600 mb-4">Need help finding your package or have questions?</p>
              <Button variant="outline" asChild className="border-2 border-blue-200 hover:bg-blue-50">
                <Link href="/contact">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
