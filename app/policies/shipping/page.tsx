import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Home, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ShippingPage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Shipping Policy</h1>
        <p className="text-lg text-muted-foreground mb-12">
          We offer safe, reliable delivery options to bring your French Bulldog puppy home, whether you're local or
          across the country.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" />
                Travel Nanny Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our professional travel nanny service ensures your puppy arrives safely and comfortably.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Flat fee of $500 to most U.S. cities</li>
                <li>• Experienced pet handlers</li>
                <li>• Door-to-door service</li>
                <li>• Real-time updates during travel</li>
                <li>• Climate-controlled transportation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Local Pickup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Prefer a personal touch? Pick up your puppy directly from our location in Dallas, Texas.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• No additional fees</li>
                <li>• Meet the puppy's parents</li>
                <li>• Tour our facilities</li>
                <li>• Personal orientation and care instructions</li>
                <li>• Flexible scheduling</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Safety Protocols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Your puppy's safety is our top priority during transport:</p>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1">Health Certification</h3>
                <p className="text-sm text-muted-foreground">
                  All puppies receive a health certificate from a licensed veterinarian before travel.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Comfortable Carriers</h3>
                <p className="text-sm text-muted-foreground">
                  Airline-approved carriers with proper ventilation and comfort.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Climate Control</h3>
                <p className="text-sm text-muted-foreground">
                  Temperature-controlled environment throughout the journey.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Regular Monitoring</h3>
                <p className="text-sm text-muted-foreground">Constant supervision and care during the entire trip.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Delivery Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1">Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule delivery at least 1 week in advance for best availability.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Preparation</h3>
                <p className="text-sm text-muted-foreground">
                  We'll coordinate with you on the best delivery date and time.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Travel Day</h3>
                <p className="text-sm text-muted-foreground">
                  Most deliveries are completed within 24 hours of departure.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Arrival</h3>
                <p className="text-sm text-muted-foreground">
                  Your puppy will be delivered directly to your home or a nearby airport.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We can arrange international shipping to select countries. Additional requirements include:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Import permits and documentation</li>
              <li>• Country-specific health certificates</li>
              <li>• Quarantine requirements (varies by country)</li>
              <li>• Additional fees for international transport</li>
              <li>• Extended preparation time (2-4 weeks)</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Contact us to discuss international shipping options and requirements for your specific location.
            </p>
          </CardContent>
        </Card>

        <div className="bg-muted p-6 border border-border mb-8">
          <h3 className="font-bold mb-2">Location</h3>
          <p className="text-sm mb-4">Dallas, Texas</p>
          <div className="h-[300px] border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d134243.6242823796!2d-96.889963!3d32.776664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e9911c5f9d6e1%3A0x3a6c7f6b7e6e1c0!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/contact">Schedule Delivery</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
